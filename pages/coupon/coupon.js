const app = getApp(); // 获取应用实例
Component({
  data: {
    navBarFullHeight: 0, // 整个导航栏高度
    coupon: [], //优惠卷
  },
  methods: {
    onLoad(options) {
      this.setData({ navBarFullHeight: app.globalData.navBarFullHeight });
    },
    onReady() {},
    onShow() {
      app.ajax({ path: `/coupon/${this.data.id}` }).then((res) => {
        console.log("当前商品可用优惠卷=>", res);
        this.setData({ coupon: res.data.data });
      });
    },
    onHide() {},
    onUnload() {},
    onPullDownRefresh() {},
    onReachBottom() {},
    onShareAppMessage() {},
  },
});
