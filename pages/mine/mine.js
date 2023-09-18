const app = getApp(); // 获取应用实例
Page({
  data: {
    navBarFullHeight: 0, // 整个导航栏高度
    userInfo: null, //用户信息
  },
  newPage(e) {
    console.log("跳转页面", e);
    wx.navigateTo({
      url: `/pages/${e.currentTarget.dataset.pageurl}/${e.currentTarget.dataset.pageurl}`,
    });
  },
  onLoad(options) {
    this.setData({
      navBarFullHeight: app.globalData.navBarFullHeight,
      userInfo: app.globalData.userInfo.UserInfo,
    });
    console.log("用户信息载入=>", this.data.userInfo);
    app.ajax({ path: "/coupon/queryUserCoupon" }).then((res) => {
      console.log("用户优惠卷=>", res);
    });
  },
  onReady() {},
  onShow() {},
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {},
});
