const app = getApp(); // 获取应用实例
const computedBehavior = require("miniprogram-computed").behavior; //安装npm之后，工具---构建npm，再直接导入
Component({
  behaviors: [computedBehavior],
  data: {
    navBarFullHeight: 0, // 整个导航栏高度
    cart: {}, //购物车列表
    goodsNum: 0, //一共有多少商品
    specCombIds: [], //已勾选的组合id
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
      // 加载框,防止快速点击情况下,数据请求延迟造成体验割裂
      wx.showLoading({
        title: "",
        mask: true,
      });
      if (
        this.data.cart.businessAndItemsList &&
        this.data.cart.businessAndItemsList.length > 0
      ) {
        // 遍历以全部checked/取消
        let businessAndItemsList = this.data.cart.businessAndItemsList.map(
          (i) => {
            i.shoppingCartItemInfoDTOList = i.shoppingCartItemInfoDTOList.map(
              (j) => {
                j.checked = !this.data.allSelect;
                return j;
              }
            );
            return i;
          }
        );
        let specCombIds = [];
        if (!this.data.allSelect)
          businessAndItemsList.forEach((i) => {
            i.shoppingCartItemInfoDTOList.forEach((j) => {
              specCombIds.push(j.specificationsCombId);
            });
          });
        this.setData({
          allSelect: !this.data.allSelect,
          "cart.businessAndItemsList": businessAndItemsList,
          specCombIds: specCombIds,
        });
        this.changeAllPrice();
      }
    },
    // 点击勾选某个商品
    selectThisGoods(e) {
      // 加载框,防止快速点击情况下,数据请求延迟造成体验割裂
      wx.showLoading({
        title: "",
        mask: true,
      });
      let businessAndItemsList = this.data.cart.businessAndItemsList;
      //勾选/取消勾选功能的实现
      if (
        businessAndItemsList[e.currentTarget.dataset.out]
          .shoppingCartItemInfoDTOList[e.currentTarget.dataset.index].checked
      ) {
        businessAndItemsList[
          e.currentTarget.dataset.out
        ].shoppingCartItemInfoDTOList[
          e.currentTarget.dataset.index
        ].checked = false;
      } else {
        businessAndItemsList[
          e.currentTarget.dataset.out
        ].shoppingCartItemInfoDTOList[
          e.currentTarget.dataset.index
        ].checked = true;
      }
      //维护"当前已勾选"规格ID数组
      let specCombIds = [];
      businessAndItemsList.forEach((i) => {
        i.shoppingCartItemInfoDTOList.forEach((j) => {
          if (j.checked) specCombIds.push(j.specificationsCombId);
        });
      });
      //是否全选的判断
      let allSelect = null;
      if (specCombIds.length == this.data.goodsNum) allSelect = true;
      else allSelect = false;
      this.setData({
        "cart.businessAndItemsList": businessAndItemsList,
        allSelect,
        specCombIds,
      });
      this.changeAllPrice();
    },
    // 点击跳转商品详情
    toProductDetail(e) {
      wx.navigateTo({
        url: `/pages/productDetail/productDetail?id=${e.currentTarget.dataset.id}`,
      });
    },
    // 修改商品总价
    changeAllPrice() {
      app
        .ajax({
          path: "/shoppingCart/computeGoodsAndPrice",
          data: { specCombIds: this.data.specCombIds },
          method: "POST",
        })
        .then((res) => {
          console.log("购物车总价和总数", res);
          this.setData({
            allPrice: res.data.data,
          });
          wx.hideLoading();
        });
    },
    // 购物车修改商品数量,维护一个已勾选的数组，需要发送请求计算价格，并为“删除”做准备
    changeGoodsNum(e) {
      let businessAndItemsList = this.data.cart.businessAndItemsList;
      let initialValue =
        businessAndItemsList[e.currentTarget.dataset.index].quantity; //初始值
      console.log(
        "对该商品进行加购/减购=>",
        businessAndItemsList[e.currentTarget.dataset.index]
      );
      // 如果是点击加减按钮
      if (e.currentTarget.dataset.calculate) {
        if (e.currentTarget.dataset.calculate == "minus")
          businessAndItemsList[e.currentTarget.dataset.index].quantity -= 1;
        else businessAndItemsList[e.currentTarget.dataset.index].quantity += 1;
      }
      // 或者是直接输入
      else {
        businessAndItemsList[e.currentTarget.dataset.index].quantity =
          e.detail.value;
      }
      let num = Number(
        businessAndItemsList[e.currentTarget.dataset.index].quantity
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
      businessAndItemsList[e.currentTarget.dataset.index].quantity = num;
      app
        .ajax({
          path: "/shoppingCart/updateGoodsNum",
          data: {
            specCombId:
              businessAndItemsList[e.currentTarget.dataset.index]
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
            businessAndItemsList[
              e.currentTarget.dataset.index
            ].quantity = initialValue;
            this.setData({ "cart.businessAndItemsList": businessAndItemsList });
          } else if (res.data.code == 200) {
            this.setData({ "cart.businessAndItemsList": businessAndItemsList });
          }
        });
    },
    // 删除商品
    deleteGoods() {
      // 判断当前勾选了多少商品
      if (this.data.allSelect) {
        console.log("全选了,全部清空");
        app
          .ajax({
            path: "/shoppingCart/delAllGoods",
            method: "DELETE",
          })
          .then((res) => {
            console.log("删除成功=>", res);
            if (res.data.code == 200) {
              this.onShow();
              this.setData({ allSelect: false });
            }
          });
      } else {
        if (this.data.specCombIds.length > 0) {
          console.log("勾选了这些规格组合=>", this.data.specCombIds);
          app
            .ajax({
              path: "/shoppingCart/delGoods",
              data: {
                specCombIds: this.data.specCombIds,
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
    // 点击结算
    toSettlement() {
      if (this.data.specCombIds.length > 0) {
        let productId = [];
        this.data.cart.businessAndItemsList.forEach((i) => {
          if (i.checked) productId.push(i.id);
        });
        console.log("准备结算=>", productId, this.data.specCombIds);
        app
          .ajax({
            path: "/shoppingCart/getSettlement",
            data: { productId: productId, specCombIds: this.data.specCombIds },
          })
          .then((res) => {
            console.log("点击进入结算=>", res);
          });
      } else {
        wx.showToast({
          title: "您未勾选商品",
          icon: "error",
        });
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
            cart.businessAndItemsList &&
            cart.businessAndItemsList.length > 0
          ) {
            let goodsNum = 0;
            cart.businessAndItemsList.forEach((i) => {
              goodsNum += i.shoppingCartItemInfoDTOList.length;
            });
            this.setData({ goodsNum });
            cart.businessAndItemsList = cart.businessAndItemsList.map((i) => {
              i.shoppingCartItemInfoDTOList = i.shoppingCartItemInfoDTOList.map(
                (j) => {
                  j.productSpec = Object.keys(j.productSpec).map((k) => {
                    return j.productSpec[k];
                  }); //规格对象转换为数组
                  j.specImages = app.globalData.https + j.specImages; //图像地址拼接
                  return j;
                }
              );
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
