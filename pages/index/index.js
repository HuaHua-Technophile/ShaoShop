// 获取应用实例
const app = getApp();
Page({
  data: {
    navBarFullHeight: 0, // 整个导航栏高度
    swiperList: [], //首页轮播图的数据列表
    Classifieds: [], //首页分类推荐的数据列表
    bulletins: [], //首页公告
    WaterfallRecommendationList: [], // 首页瀑布流推荐
  },
  async onLoad() {
    this.setData({ navBarFullHeight: app.globalData.navBarFullHeight });
    await app.ajax("/product/querySwiper").then((res) => {
      this.setData({
        swiperList: res.data.data.map((item) => {
          item.getSwiperPic = app.https + item.getSwiperPic;
          return item;
        }),
      });
    });
    await app.ajax("/recommend/queryRecommendAll").then((res) => {
      this.setData({
        Classifieds: res.data.data.map((item) => {
          item.recommendIcon = app.https + item.recommendIcon;
          return item;
        }),
      });
    });
    await app.ajax("/notice/queryNotice").then((res) => {
      this.setData({
        bulletins: res.data.data,
      });
    });
    await app.ajax("/recommend/queryWaterfallsAll").then((res) => {
      this.setData({
        WaterfallRecommendationList: res.data.data.map(item=>{
          item.image = app.https + item.image;
          return item;
        }),
      });
    });
    // console.log(this.data.swiperList, this.data.Classifieds);
  },
});
