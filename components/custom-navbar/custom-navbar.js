const app = getApp();
Component({
  properties: {
    ShowSearch: {
      type: Boolean,
      value: true,
    },
    ShowBackBtn: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    theme: "", //暗色/亮色
    navBarFullHeight: 0, // 整个导航栏高度
    navBarTop: 0, //navbar内容区域顶边距
    navBarHeight: 0, //navbar内容区域高度
    navBarWidth: 0, // 胶囊遮挡的不可用区域宽度,用作右外边距/右内边距
  },
  lifetimes: {
    attached() {
      this.setData({
        navBarFullHeight: app.globalData.navBarFullHeight,
        navBarTop: app.globalData.navBarTop,
        navBarHeight: app.globalData.navBarHeight,
        navBarWidth: app.globalData.navBarWidth,
      });
    },
  },
  methods: {
    toSearch() {
      console.log("跳转至搜索");
    },
    goBack() {
      wx.navigateBack();
    },
  },
});
