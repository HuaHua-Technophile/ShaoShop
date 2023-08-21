const app = getApp(); // 获取应用实例
Page({
  data: {
    navBarFullHeight: 0, // 整个导航栏高度
    swiperList: [], //首页轮播图的数据列表
    Classifieds: [], //首页分类推荐的数据列表
    bulletins: [], //首页公告
    WaterfallRecommendationList: [], // 首页瀑布流推荐
  },
  onLoad() {
    this.setData({ navBarFullHeight: app.globalData.navBarFullHeight });
    // 轮播图数据获取
    app.ajax({ path: "/recommend/querySwiper" }).then((res) => {
      this.setData({
        swiperList: res.data.data.map((item) => {
          item.image = app.globalData.https + item.image;
          return item;
        }),
      });
    });
    // 分类推荐数据获取
    app.ajax({ path: "/recommend/queryRecommendAll" }).then((res) => {
      this.setData({
        Classifieds: res.data.data.map((item) => {
          item.recommendIcon = app.globalData.https + item.recommendIcon;
          return item;
        }),
      });
    });
    // 公告数据获取
    app.ajax({ path: "/notice/queryNotice" }).then((res) => {
      this.setData({
        bulletins: res.data.data,
      });
    });
    // 瀑布流推荐获取
    app.ajax({ path: "/recommend/queryWaterfallsAll" }).then((res) => {
      this.setData({
        WaterfallRecommendationList: res.data.data.map((item) => {
          item.image = app.globalData.https + item.image;
          return item;
        }),
      });
    });
    // console.log(this.data.swiperList, this.data.Classifieds);
  },
});
