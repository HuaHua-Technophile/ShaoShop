const app = getApp(); // 获取应用实例
Page({
  data: {
    navBarFullHeight: 0, // 整个导航栏高度
    AllCategories: [], //全部分类
    level1: 0, //一级分类选中项
    Classification2: [], //二级分类
    level2: 0, //二级分类选中项
    good: [], //分类的商品列表
  },
  // 点击选择一级菜单
  SelectCategorization1(e) {
    this.setData({
      level1: e.currentTarget.dataset.index,
      level2: 0,
      Classification2: this.data.AllCategories[e.currentTarget.dataset.index]
        .childrenList,
    });
    this.queryByPcn();
  },
  // 点击选择二级菜单
  SelectCategorization2(e) {
    this.setData({
      level2: e.currentTarget.dataset.index,
    });
    this.queryByPcn();
  },
  // 封装商品查询
  async queryByPcn() {
    await app
      .ajax({
        path: "/product/queryByPcn",
        data: {
          productClassificationNumber: this.data.Classification2[
            this.data.level2
          ].id,
        },
      })
      .then((res) => {
        this.setData({
          good: res.data.data.map((item) => {
            item.proPic = app.globalData.https + item.proPic;
            return item;
          }),
        });
      });
  },
  async onLoad(options) {
    this.setData({ navBarFullHeight: app.globalData.navBarFullHeight });
    // 一级分类菜单及二级分类菜单获取
    await app.ajax({ path: "/classification/queryAllMenu" }).then((res) => {
      this.setData({
        AllCategories: res.data.data.map((item) => {
          item.childrenList.unshift({
            classificationName: "全部",
            id: item.id,
          });
          return item;
        }),
      });
      this.setData({
        Classification2: this.data.AllCategories[0].childrenList,
      }); //只能分两行,否则同步无法获取
    });
    // 商品获取
    this.queryByPcn();
  },
  onReady() {},
  onShow() {},
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {},
});
