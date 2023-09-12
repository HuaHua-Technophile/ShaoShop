const app = getApp(); // 获取应用实例
Component({
  data: {
    navBarFullHeight: 0, // 整个导航栏高度
    addressList: [], //地址的数量
    isSelect: false, //是否处于多选状态
  },
  methods: {
    newAddress() {
      wx.navigateTo({
        url: "/pages/newAddress/newAddress",
      });
    },
    onLoad(options) {
      this.setData({ navBarFullHeight: app.globalData.navBarFullHeight });
      app
        .ajax({
          path: "/address/queryAddress",
        })
        .then((res) => {
          console.log("获取到了收货地址=>", res);
          this.setData({ addressList: res.data.data });
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
