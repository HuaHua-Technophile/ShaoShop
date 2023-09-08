const app = getApp(); // 获取应用实例
Component({
  data: {
    navBarFullHeight: 0, // 整个导航栏高度
  },
  methods: {
    onLoad(options) {
      this.setData({ navBarFullHeight: app.globalData.navBarFullHeight });
      app.ajax({ path: "/product/queryHot" }).then((res) => {
        console.log("获取到了10个热卖商品=>", res);
      });
    },
    onReady() {},
    onShow() {},
    onHide() {},
    onUnload() {},
    onPullDownRefresh() {},
    onReachBottom() {},
    onShareAppMessage() {},
  },
});
