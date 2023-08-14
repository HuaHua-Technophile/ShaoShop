// 获取应用实例
const app = getApp();
Page({
  data: {
    navBarFullHeight: 0, // 整个导航栏高度
    swiperList: [],
  },
  async onLoad() {
    this.setData({ navBarFullHeight: app.globalData.navBarFullHeight });
    await app.ajax("/product/querySwiper").then((res) => {
      this.setData({
        swiperList: res.data.data.map((item) => {
          item.swiper_image = app.https + item.swiper_image;
          return item;
        }),
      });
      console.log(this.data.swiperList);
    });
  },
});
