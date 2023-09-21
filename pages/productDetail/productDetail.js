const app = getApp(); // 获取应用实例
import { isObjectEqual } from "../../utils/util";
const computedBehavior = require("miniprogram-computed").behavior; //安装npm之后，工具---构建npm，再直接导入
Component({
  // 组件的属性可以用于接收页面的参数
  properties: {
    id: Number,
  },
  behaviors: [computedBehavior],
  data: {
    navBarFullHeight: 0, // 整个导航栏高度
    coupon: [], //当前商品优惠卷
    goodData: {}, //商品的所有数据(文本信息)
    goodSwiper: [], //商品的头部轮播图
    activeIndex: 0, //商品的头部轮播图的激活序号
    productLabel: [], //商品标签
    reductionRules: [], //满减规则

    shoppingAddress: [], //收货地址
    productIntro: [], //商品的下方介绍图
    cartTabbarHeight: 0, //底部"加购/购买"栏的高度

    pageContainerShow: false, //假页面容器显示状态
    pageContainer: "", // 假页面容器展示规格选择还是优惠卷领取
    hiddenTabbarBtn: 0, //是同时展示加购/购买,还是其中一个

    SpecAndSpecValue: [], //商品的所有规格
    SpecAndStock: [], //商品的全部规格的排列组合
    currentSpecifications: {}, // 当前商品点击了哪些选项
    optionPrice: 0, // 当前选择项的价格
    specCombId: -1, // 当前规格的排列组合的id
    stock: -1, //当前规格的剩余库存
    quantity: 1, //商品的要加入购物车的数量
  },
  computed: {
    // 规格值在页面中的展现
    SelectedSpecification(data) {
      //computed函数中不能访问this，只有data对象可访问，该函数的返回值会被设置到this.data.xxx字段中
      let arr = [];
      for (let key in data.currentSpecifications) {
        arr.push(data.currentSpecifications[key]);
      }
      return arr;
    },
  },
  methods: {
    //轮播图变更时,修改右下方序号
    changeActiveIndex(e) {
      console.log("轮播图切换=>", e);
      this.setData({
        activeIndex: e.detail.current,
      });
    },
    // 点击选择规格/加入购物车/立即购买,展示假页面容器
    showPageContainer(e) {
      this.setData({
        pageContainerShow: true,
        pageContainer: e.currentTarget.dataset.content,
        hiddenTabbarBtn: e.currentTarget.dataset.status,
      });
    },
    // 点击隐藏假页面容器
    hiddenPageContainer() {
      this.setData({ pageContainerShow: false });
    },
    // 点击详细规格,展示价格,与切换预览图
    selectThisNorm(e) {
      const A = this.data.currentSpecifications; // 当前商品点击了哪些选项
      this.setData({ quantity: 1 }); //加购数量重置
      if (
        A[e.currentTarget.dataset.optionname] == e.currentTarget.dataset.option
      ) {
        A[e.currentTarget.dataset.optionname] = undefined; //清空赋值
        this.setData({
          stock: -1, //库存
          specCombId: -1,
          optionPrice: 0,
          currentSpecifications: A,
        });
        console.log(
          "取消选择了=>",
          e.currentTarget.dataset.optionname,
          e.currentTarget.dataset.option,
          "=>",
          A
        );
      } else {
        A[e.currentTarget.dataset.optionname] = e.currentTarget.dataset.option; //赋值
        console.log(
          "选择了=>",
          e.currentTarget.dataset.optionname,
          e.currentTarget.dataset.option,
          "=>",
          A,
          "第一项",
          this.data.SpecAndStock[0]
        );
        //打印发现,this.data.SpecAndStock的第一项会在点击后被改变
        this.setData({ currentSpecifications: A });
        //商品的全部规格的排列组合
        this.data.SpecAndStock.forEach((i, index) => {
          // console.log("送检对象", i.productSpecList, A);
          if (isObjectEqual(i.productSpecList, A)) {
            this.setData({
              optionPrice: i.price,
              specCombId: i.id,
              stock: i.stock,
            });
            console.log("选择了组合=>", this.data.specCombId);
          }
        });
      }
    },
    // 加入购物车/添加购物车
    addCart() {
      if (this.data.specCombId != -1 && this.data.stock > 0) {
        wx.showLoading({
          title: "",
          mask: true,
        });
        app
          .ajax({
            path: "/shoppingCart/addGoodsBySpecId",
            method: "POST",
            data: {
              specCombId: this.data.specCombId, //规格id
              productId: this.data.id, //商品id
              quantity: this.data.quantity, //数量
            },
          })
          .then((res) => {
            wx.hideLoading();
            wx.showToast({ title: "添加成功" });
            this.setData({ pageContainerShow: false });
            console.log(
              `将商品${this.data.id}的组合${this.data.specCombId}添加进了购物车`,
              res
            );
          });
      } else {
        wx.showToast({ title: "暂无库存哦", icon: "error" });
      }
    },
    // 修改要加入购物车的数量
    changeQuantity(e) {
      let num = this.data.quantity;
      // 如果是点击加减按钮
      if (e.currentTarget.dataset.calculate) {
        if (e.currentTarget.dataset.calculate == "minus") num -= 1;
        else num += 1;
      }
      // 或者是直接输入
      else {
        num = e.detail.value;
      }
      // 数值限制范围
      if (num >= 1) {
        if (num > this.data.stock) {
          wx.showToast({
            title: "超出库存",
            icon: "error",
          });
          num = this.data.stock;
        }
      } else {
        wx.showToast({
          title: "最少一件",
          icon: "error",
        });
        num = 1;
      }
      this.setData({ quantity: num });
    },
    // 查询该商品可用的优惠卷
    checkCoupon() {
      app.ajax({ path: `/coupon/${this.data.id}` }).then((res) => {
        console.log("当前商品可用优惠卷=>", res);
        this.setData({ coupon: res.data.data });
      });
    },
    // 领取优惠卷
    receive(e) {
      if (!e.currentTarget.dataset.receive) {
        wx.showLoading({
          title: "",
          mask: true,
        });
        app
          .ajax({
            path: `/coupon/${e.currentTarget.dataset.id}`,
            method: "POST",
          })
          .then((res) => {
            console.log("领取成功=>", res);
            wx.hideLoading();
            if (res.data.code == 200) {
              wx.showToast({
                title: "领取成功",
                icon: "success",
              });
              this.checkCoupon();
            } else
              wx.showToast({
                title: "领取失败",
                icon: "error",
              });
          });
      }
    },
    async onLoad(options) {
      this.setData({ navBarFullHeight: app.globalData.navBarFullHeight });
      // 查询底部"加购/购买"栏高度为多少
      let query = wx.createSelectorQuery();
      query
        .select(".cart-tabbar")
        .boundingClientRect((rect) => {
          this.setData({
            cartTabbarHeight: rect.height,
          });
        })
        .exec();
      // 获取商品轮播图
      app
        .ajax({
          path: "/product/queryProductSwiper",
          data: { productId: this.data.id },
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

      // 获取商品规格
      app
        .ajax({
          path: "/product/querySpecAndSpecValue",
          data: {
            productId: this.data.id,
          },
        })
        .then((res) => {
          let SpecAndSpecValue = res.data.data.map((i) => {
            // 商品图片拼接url
            if (i.isShow) {
              i.productSpecificationsValueList = i.productSpecificationsValueList.map(
                (j) => {
                  j.specImage = app.globalData.https + j.specImage;
                  return j;
                }
              );
            }
            return i;
          });
          this.setData({ SpecAndSpecValue });
          console.log("获取到了商品规格=>", this.data.SpecAndSpecValue);
        });
      // 获取商品标签
      app
        .ajax({
          path: "/product/queryProductLabel",
          data: { productId: this.data.id },
        })
        .then((res) => {
          console.log("获取到了商品标签=>", this.data.id, res);
          this.setData({
            productLabel: res.data.data,
          });
        });
      // 获取商品底部介绍图(多图拼凑)
      app
        .ajax({
          path: "/product/queryProductIntro",
          data: { productId: this.data.id },
        })
        .then((res) => {
          console.log("获取到了商品介绍图=>", res);
          this.setData({
            productIntro: res.data.data.map((item) => {
              item.image = app.globalData.https + item.image;
              return item;
            }),
          });
        });
      // 获取商品规格的所有排列组合(包含价格\库存)
      app
        .ajax({
          path: "/product/querySpecAndStock",
          data: {
            productId: this.data.id,
          },
        })
        .then((res) => {
          this.setData({
            SpecAndStock: res.data.data,
            currentSpecifications: res.data.data[0].productSpecList, // 当前商品点击了哪些选项
            optionPrice: res.data.data[0].price, //当前选择项的价格
            specCombId: res.data.data[0].id, //当前规格的排列组合的id
            stock: res.data.data[0].stock, //当前规格的剩余库存
          });
          console.log("获取到了商品规格的排列组合=>", res.data.data);
        });

      // 获取商品数据详情文本
      await app
        .ajax({
          path: "/product/queryProductDetail",
          data: { productId: this.data.id },
        })
        .then((res) => {
          console.log("获取到了商品数据=>", res);
          this.setData({ goodData: res.data.data });
        });
      // 获取商品所有满减信息
      app
        .ajax({ path: `/reductionRule/${this.data.goodData.businessId}` })
        .then((res) => {
          console.log(
            "当前商品适用满减规则=>",
            res,
            this.data.goodData.businessId
          );
          this.setData({ reductionRules: res.data.data });
        });
    },
    onReady() {},
    onShow() {
      console.log("当前查看的是商品=>", this.data.id);
      // 查询收货地址,并展示一个默认地址
      app.ajax({ path: "/address/queryAddress" }).then((res) => {
        console.log("获取到了收货地址=>", res);
        let shoppingAddress = [];
        res.data.data.forEach((i) => {
          if (i.isDefault) {
            shoppingAddress[0] = i.areaName;
            shoppingAddress[1] = i.cityName;
            shoppingAddress[2] = i.provinceName;
          }
        });
        if (shoppingAddress.length == 0) {
          shoppingAddress[0] = res.data.data[0].areaName;
          shoppingAddress[1] = res.data.data[0].cityName;
          shoppingAddress[2] = res.data.data[0].provinceName;
        }
        this.setData({ shoppingAddress });
      });
      this.checkCoupon();
    },
    onHide() {},
    onUnload() {},
    onPullDownRefresh() {},
    onReachBottom() {},
    onShareAppMessage() {},
  },
});
