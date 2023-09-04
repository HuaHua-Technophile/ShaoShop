const app = getApp(); // 获取应用实例
const computedBehavior = require("miniprogram-computed").behavior; //安装npm之后，工具---构建npm，再直接导入
Component({
  behaviors: [computedBehavior],
  data: {
    navBarFullHeight: 0, // 整个导航栏高度
    cart: {}, //购物车列表
    allSelect: false, //是否购物车全选
    allPrice: 0, //所有商品的价格
    checkoutTabbarHeight: 0, //底部"结算"栏高度
    productSpecList: [], // 每个商品规格排列组合的展示
  },
  /* computed: {
    SelectedSpecification(data) {
      // 注意： computed 函数中不能访问 this ，只有 data 对象可供访问
      // 这个函数的返回值会被设置到 this.data.sum 字段中
      let arr = [];
      for (let key in data.currentSpecifications) {
        arr.push(data.currentSpecifications[key]);
      }
      return arr;
    },
  }, */
  methods: {
    // 点击全选/取消全选
    allSelectChange() {
      let cart = this.data.cart;
      cart.shoppingcartItemList = cart.shoppingcartItemList.map((i) => {
        i.checked = !this.data.allSelect;
        return i;
      });
      this.setData({
        allSelect: !this.data.allSelect,
        cart,
      });
    },
    // 点击勾选某个商品
    selectThisGoods(e) {
      let cart = this.data.cart;
      if (cart.shoppingcartItemList[e.currentTarget.dataset.index].checked) {
        cart.shoppingcartItemList[
          e.currentTarget.dataset.index
        ].checked = false;
      } else {
        cart.shoppingcartItemList[e.currentTarget.dataset.index].checked = true;
      }
      let allSelect = cart.shoppingcartItemList.every((i) => {
        return i.checked;
      });
      this.setData({
        cart,
        allSelect,
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
    onShow() {
      app
        .ajax({
          path: "/shoppingCart/queryShopCartList",
        })
        .then((res) => {
          console.log("获取到了当前用户的购物车=>", res);
          let productSpecList = res.data.data.shoppingcartItemList.map((i) => {
            let productSpec = i.productSpec;
            let arr = [];
            Object.keys(productSpec).forEach((j) => {
              arr.push(productSpec[j]);
            });
            return arr;
          });
          this.setData({
            cart: res.data.data,
            productSpecList,
          });
        });
    },
    onHide() {},
    onUnload() {},
    onPullDownRefresh() {},
    onReachBottom() {},
    onShareAppMessage() {},
  },
});
