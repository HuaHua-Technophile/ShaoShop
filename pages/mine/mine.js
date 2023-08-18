const app = getApp(); // 获取应用实例
Page({
  data: {
    navBarFullHeight: 0, // 整个导航栏高度
    userInfo: null, //用户信息
  },
  async onLoad(options) {
    this.setData({
      navBarFullHeight: app.globalData.navBarFullHeight,
      userInfo: app.globalData.userInfo.UserInfo,
    });
    console.log("用户信息载入=>", this.data.userInfo);
  },
  onReady() {},
  onShow() {},
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {},
});
