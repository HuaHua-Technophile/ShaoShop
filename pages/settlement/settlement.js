const app = getApp(); // 获取应用实例
Component({
  properties: {
    specCombIds: String,
  },
  data: {
    navBarFullHeight: 0, // 整个导航栏高度
    shoppingAddress: {}, //下单时的收货地址
    orderConfirmDTOList: [], //进入结算的商品
    orderConfirmPriceDetailVo: {}, //价格相关信息
  },
  methods: {
    onLoad(options) {
      this.setData({ navBarFullHeight: app.globalData.navBarFullHeight });
    },
    onReady() {},
    onShow() {
      app
        .ajax({
          path: `/shoppingCart/getSettlement/${JSON.parse(
            this.data.specCombIds
          )}`,
        })
        .then((res) => {
          console.log("进入结算=>", res);
          this.setData({
            orderConfirmDTOList: res.data.data.orderConfirmDTOList,
            orderConfirmPriceDetailVo: res.data.data.orderConfirmPriceDetailVo,
          });
        });
      app.ajax({ path: "/address/queryAddress" }).then((res) => {
        console.log("获取到了收货地址=>", res);
        let shoppingAddress = {};
        res.data.data.forEach((i) => {
          if (i.isDefault) shoppingAddress = i;
        });
        this.setData({ shoppingAddress });
      });
    },
    onHide() {},
    onUnload() {},
    onPullDownRefresh() {},
    onReachBottom() {},
    onShareAppMessage() {},
  },
});
