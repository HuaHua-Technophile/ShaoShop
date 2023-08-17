const app = getApp(); // 获取应用实例
Page({
  data: {
    navBarFullHeight: 0, // 整个导航栏高度
  },
  async onLoad(options) {
    this.setData({ navBarFullHeight: app.globalData.navBarFullHeight });
    console.log(options.id);
    await app
      .ajax({
        path: "/product/queryProductDetail",
        data: { productId: options.id },
      })
      .then((res) => {
        console.log(res);
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
