const app = getApp(); // 获取应用实例
Page({
  data: {
    navBarFullHeight: 0, // 整个导航栏高度
  },
  async onLoad(options) {
    this.setData({ navBarFullHeight: app.globalData.navBarFullHeight });
    await app
      .ajax({
        path: "/product/queryProductDetail",
        data: { productId: options.id },
      })
      .then((res) => {
        console.log("获取到了商品数据=>", res);
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
