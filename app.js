// app.js
import { https, ajax } from "./api/http";
//注册自定义钩子
import CustomHook from "spa-custom-hooks";
// 提前在外部定义globaldata
let globalData = {
  userInfo: {}, //用户登陆状态,包含token等
  https: https, //请求的地址
  theme: "", //暗色/亮色
  navBarFullHeight: 0, // 整个导航栏高度
  navBarTop: 0, //navbar内容区域顶边距
  navBarHeight: 0, //navbar内容区域高度
  navBarWidth: 0, // 胶囊遮挡的不可用区域宽度,用作右外边距/右内边距
  cart: undefined, // 购物车信息
};
CustomHook.install(
  {
    User: {
      name: "User",
      watchKey: "userInfo",
      deep: true,
      onUpdate(val) {
        //获取到userinfo则触发此钩子
        return !!val.token;
      },
    },
  },
  globalData || "globalData"
);
App({
  onLaunch() {
    console.log("app.vue页onLaunch");
    const that = this; //存储对象备份,避免随着运行环境的变化,this的指向改变
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect(); // 胶囊按钮位置信息
    that.globalData.navBarFullHeight =
      menuButtonInfo.top + menuButtonInfo.height;
    that.globalData.navBarTop = menuButtonInfo.top;
    that.globalData.navBarHeight = menuButtonInfo.height;
    that.globalData.navBarWidth = menuButtonInfo.left;
    // 暗色/亮色检测----------------------
    wx.getSystemInfo({
      success: (res) => (that.globalData.theme = res.theme),
    });
    // 加载网络字体.若提示 Failed to load font 可直接忽略,属正常现象
    wx.loadFontFace({
      global: true,
      family: "YouSheBiaoTiHei",
      source: `url("${that.globalData.https}/font/myfont.ttf")`,
      success: (res) => {
        console.log("字体加载成功", res);
      },
      fail: (err) => {
        console.log("字体加载失败", err);
      },
    });
    wx.login({
      success: (loginRes) => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        that
          .ajax({
            path: "/user/WxLogin",
            data: {
              code: loginRes.code,
            },
            method: "POST",
          })
          .then((res) => {
            console.log("获取到了服务器返回的用户登录数据=>", res);
            res.data.data.UserInfo.avatarUrl =
              https + "/" + res.data.data.UserInfo.avatarUrl;
            that.globalData.userInfo = res.data.data;
          });
      },
    });
  },
  globalData, //提前定义的全局数据
  ajax, //封装好的ajax请求方法
});
