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
      cart.shoppingCartItemList = cart.shoppingCartItemList.map((i) => {
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
      let shoppingCartItemList = this.data.cart.shoppingCartItemList;
      if (shoppingCartItemList[e.currentTarget.dataset.index].checked) {
        shoppingCartItemList[e.currentTarget.dataset.index].checked = false;
      } else {
        shoppingCartItemList[e.currentTarget.dataset.index].checked = true;
      }
      let allSelect = shoppingCartItemList.every((i) => {
        return i.checked;
      });
      this.setData({
        "cart.shoppingCartItemList": shoppingCartItemList,
        allSelect,
      });
    },
    // 购物车修改商品数量
    changeGoodsNum(e) {
      let shoppingCartItemList = this.data.cart.shoppingCartItemList;
      let initialValue =
        shoppingCartItemList[e.currentTarget.dataset.index].quantity; //初始值
      console.log(
        "对该商品进行加购/减购=>",
        shoppingCartItemList[e.currentTarget.dataset.index]
      );
      // 如果是点击加减按钮
      if (e.currentTarget.dataset.calculate) {
        if (e.currentTarget.dataset.calculate == "minus")
          shoppingCartItemList[e.currentTarget.dataset.index].quantity -= 1;
        else shoppingCartItemList[e.currentTarget.dataset.index].quantity += 1;
      }
      // 或者是直接输入
      else {
        shoppingCartItemList[e.currentTarget.dataset.index].quantity =
          e.detail.value;
      }
      let num = Number(
        shoppingCartItemList[e.currentTarget.dataset.index].quantity
      );
      if (num >= 1) {
        if (num > 999) {
          wx.showToast({
            title: "最多加购999件",
            icon: "error",
          });
          num = 999;
        }
      } else {
        wx.showToast({
          title: "取值1~999",
          icon: "error",
        });
        num = 1;
      }
      shoppingCartItemList[e.currentTarget.dataset.index].quantity = num;
      app
        .ajax({
          path: "/shoppingCart/updateGoodsNum",
          data: {
            specCombId:
              shoppingCartItemList[e.currentTarget.dataset.index]
                .specificationsCombId, //规格的排列组合的id
            quantity: num, //要更新为多少个
          },
          method: "POST",
        })
        .then((res) => {
          console.log("购物车数量更新成功=>", res);
          if (res.data.code == 500) {
            if (res.data.msg == "超过商品最大库存")
              wx.showToast({
                title: "剩余库存不足",
                icon: "error",
              });
            shoppingCartItemList[
              e.currentTarget.dataset.index
            ].quantity = initialValue;
            this.setData({ "cart.shoppingCartItemList": shoppingCartItemList });
          } else if (res.data.code == 200) {
            this.setData({ "cart.shoppingCartItemList": shoppingCartItemList });
          }
        });
    },
    // 删除商品
    deleteGoods() {
      let shoppingCartItemList = this.data.cart.shoppingCartItemList;
      // 判断当前勾选了多少商品
      if (this.data.allSelect) {
        console.log("全选了,全部清空");
        app
          .ajax({
            path: "/shoppingCart/delAllGoods",
            method: "POST",
          })
          .then((res) => {
            console.log("删除成功=>", res);
            if (res.data.code == 200) {
              this.onShow();
            }
          });
      } else {
        let specCombIds = [];
        shoppingCartItemList.forEach((i) => {
          if (i.checked) specCombIds.push(i.specificationsCombId);
        });
        if (specCombIds.length > 0) {
          console.log("勾选了这些规格组合=>", specCombIds);
          app
            .ajax({
              path: "/shoppingCart/delGoods",
              data: {
                specCombIds: specCombIds,
              },
              method: "POST",
            })
            .then((res) => {
              console.log("删除成功=>", res);
              if (res.data.code == 200) {
                this.onShow();
              }
            });
        } else {
          wx.showToast({
            title: "您未勾选商品",
            icon: "error",
          });
        }
      }
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
          let cart = res.data.data;
          console.log("获取到了当前用户的购物车=>", cart);
          if (
            cart.shoppingCartItemList &&
            cart.shoppingCartItemList.length > 0
          ) {
            cart.shoppingCartItemList = cart.shoppingCartItemList.map((i) => {
              i.specImages = app.globalData.https + i.specImages;
              i.productSpec = Object.keys(i.productSpec).map((j) => {
                return i.productSpec[j];
              });
              return i;
            });
          }
          this.setData({
            cart,
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
