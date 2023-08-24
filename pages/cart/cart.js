const app = getApp(); // 获取应用实例
Page({
  data: {
    navBarFullHeight: 0, // 整个导航栏高度
    cartList: [], //购物车列表
    allSelect: false, //是否购物车全选
    allPrice: 0, //所有商品的价格
    checkoutTabbarHeight: 0, //底部"结算"栏高度
  },
  // 点击全选/取消全选
  allSelectChange() {
    this.setData({
      allSelect: !this.data.allSelect,
    });
  },
  onLoad(options) {
    this.setData({ navBarFullHeight: app.globalData.navBarFullHeight });
    // 查询底部"结算"栏高度为多少
    let query = wx.createSelectorQuery();
    query
      .select(".checkout-tabbar")
      .boundingClientRect((rect) => {
        this.setData({
          checkoutTabbarHeight: rect.height,
        });
      })
      .exec();
  },
  onReady() {},
  onShow() {},
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {},
});
