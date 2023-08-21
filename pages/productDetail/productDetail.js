const app = getApp(); // 获取应用实例
Page({
  data: {
    navBarFullHeight: 0, // 整个导航栏高度
    goodData: {}, //商品的所有文本信息
    goodSwiper: [], //商品的头部轮播图
    activeIndex: 0, //商品的头部轮播图的激活序号
  },
  changeActiveIndex(e) {
    console.log("轮播图切换=>", e);
    this.setData({
      activeIndex: e.detail.current,
    });
  }, //轮播图变更时,修改右下方序号
  onLoad(options) {
    this.setData({ navBarFullHeight: app.globalData.navBarFullHeight });
    app
      .ajax({
        path: "/product/queryProductSwiper",
        data: { productId: options.id },
      })
      .then((res) => {
        console.log("获取到了商品轮播图=>", res, app.globalData.https);
        this.setData({
          goodSwiper: res.data.data.map((item) => {
            item.image = app.globalData.https + item.image;
            return item;
          }),
        });
      });
    app
      .ajax({
        path: "/product/queryProductDetail",
        data: { productId: options.id },
      })
      .then((res) => {
        console.log("获取到了商品数据=>", res);
        this.setData({
          goodData: res.data.data,
        });
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