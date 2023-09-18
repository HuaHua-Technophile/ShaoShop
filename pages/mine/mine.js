const app = getApp(); // 获取应用实例
Page({
  data: {
    navBarFullHeight: 0, // 整个导航栏高度
    userInfo: null, //用户信息
    couponQuantity: 0, //优惠卷数量
  },
  onLoad(options) {
    this.setData({
      navBarFullHeight: app.globalData.navBarFullHeight,
      userInfo: app.globalData.userInfo.UserInfo,
    });
    console.log("用户信息载入=>", this.data.userInfo);
  },
  onReady() {},
  onShow() {
    app.ajax({ path: "/coupon/queryUserCoupon" }).then((res) => {
      this.setData({ couponQuantity: res.data.data.length });
    });
  },
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {},
});
