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
    goodData: {}, //商品的所有文本信息
    goodSwiper: [], //商品的头部轮播图
    activeIndex: 0, //商品的头部轮播图的激活序号
    productLabel: [], //商品标签
    productIntro: [], //商品的下方介绍图
    cartTabbarHeight: 0, //底部"加购/购买"栏的高度
    pageContainerShow: false, //假页面容器显示状态
    hiddenTabbarBtn: 0, //是同时展示加购/购买,还是其中一个
    optionPrice: 0, // 当前选择项的价格
    SpecAndSpecValue: [], //商品的所有规格
    SpecAndStock: [], //商品的全部规格的排列组合
    currentSpecifications: {}, // 当前商品点击了哪些选项
  },
  computed: {
    sum(data) {
      // 注意： computed 函数中不能访问 this ，只有 data 对象可供访问
      // 这个函数的返回值会被设置到 this.data.sum 字段中
      return JSON.stringify(data.currentSpecifications);
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
    // 点击选择规格,并加入购物车/立即购买
    showPageContainer(e) {
      this.setData({
        pageContainerShow: true,
        hiddenTabbarBtn: e.currentTarget.dataset.status,
      });
      console.log("点击显示规格弹窗", e, this.data.hiddenTabbarBtn);
    },
    // 点击详细规格,展示价格,与切换预览图
    selectThisNorm(e) {
      let currentSpecifications = this.data.currentSpecifications;
      if (
        currentSpecifications[e.currentTarget.dataset.optionname] ==
        e.currentTarget.dataset.option
      ) {
        currentSpecifications[e.currentTarget.dataset.optionname] = undefined;
        this.setData({
          optionPrice: 0,
          currentSpecifications: currentSpecifications,
        });
      } else {
        currentSpecifications[e.currentTarget.dataset.optionname] =
          e.currentTarget.dataset.option;
        this.setData({ currentSpecifications });
        this.data.SpecAndStock.forEach((i) => {
          if (
            isObjectEqual(i.productSpecList, this.data.currentSpecifications)
          ) {
            console.log("匹配到了=>", i);
            this.setData({ optionPrice: i.price });
          }
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
      // 获取商品详情文本
      app
        .ajax({
          path: "/product/queryProductDetail",
          data: { productId: this.data.id },
        })
        .then((res) => {
          console.log("获取到了商品数据=>", res);
          this.setData({
            goodData: res.data.data.productDetails,
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
          this.setData({
            SpecAndSpecValue: res.data.data,
          });
          console.log("获取到了商品规格=>", res);
        });
      // 获取商品标签
      app
        .ajax({
          path: "/product/queryProductLabel",
          data: { productId: this.data.id },
        })
        .then((res) => {
          console.log("获取到了商品标签=>", res);
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
      await app
        .ajax({
          path: "/product/querySpecAndStock",
          data: {
            productId: this.data.id,
          },
        })
        .then((res) => {
          this.setData({
            SpecAndStock: res.data.data,
          });
          console.log("获取到了商品规格的排列组合=>", res);
        });
      // 设置默认选择规格
      console.log("设置默认选择规格", this.data.SpecAndStock);
      this.setData({
        currentSpecifications: this.data.SpecAndStock[0].productSpecList,
        optionPrice: this.data.SpecAndStock[0].price,
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
