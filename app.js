// app.js
import { https, ajax } from "./api/http";
App({
  globalData: {
    userInfo: null, //用户登陆状态
    token: null, //用户登录token
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
      key: "token",
      success(res) {
        that.globalData.token = res.data;
      },
    });
    wx.login({
      success: async (loginRes) => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        await that
          .ajax({
            path: "/user/WxLogin",
            data: {
              code: loginRes.code,
            },
            method: "POST",
            header: that.globalData.token,
          })
          .then((res) => {
            console.log(res.data.data);
            wx.setStorage({
              key: "token",
              data: res.data.data,
            });
          });
      },
    });
  },
  ajax: ajax, //封装好的ajax请求方法
});
