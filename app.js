// app.js
import { https, ajax } from "./api/http";
App({
  globalData: {
    userInfo: { token: null }, //用户登陆状态,包含token等
    https: https, //请求的地址
    theme: "", //暗色/亮色
    navBarFullHeight: 0, // 整个导航栏高度
    navBarTop: 0, //navbar内容区域顶边距
    navBarHeight: 0, //navbar内容区域高度
    navBarWidth: 0, // 胶囊遮挡的不可用区域宽度,用作右外边距/右内边距
  },
  onLaunch() {
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
    /* // 展示本地存储能力
    const logs = wx.getStorageSync("logs") || [];
    logs.unshift(Date.now()); 
    wx.setStorageSync("logs", logs);*/
    // 登录
    wx.getStorage({
      key: "userInfo",
      success(res) {
        that.globalData.userInfo = res.data;
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
            res.data.data.UserInfo.avatarUrl =
              https + "/" + res.data.data.UserInfo.avatarUrl;
            wx.setStorage({
              key: "userInfo",
              data: res.data.data,
            });
            console.log("服务器返回用户信息,存入本地", res);
          });
      },
    });
    // 下载网络字体
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
  },
  ajax: ajax, //封装好的ajax请求方法
});
