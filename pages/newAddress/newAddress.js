const app = getApp(); // 获取应用实例
Component({
  data: {
    navBarFullHeight: 0, // 整个导航栏高度
    name: null, //收获姓名
    phone: null, //手机号
    region: null, //一级粗略地址
    regionText: "省、市、区、街道", //一级粗略地址的展示文本
    address: null, //二级详细地址
    default: false, //是否是默认收货地址
  },
  methods: {
    // 输入收获姓名
    changeName(e) {
      console.log(`输入了收获姓名=>"${e.detail.value}"`);
      if (/\s/.test(e.detail.value)) {
        wx.showToast({
          title: "禁止空字符",
          icon: "error",
        });
        this.setData({ name: null });
      } else this.setData({ name: e.detail.value });
    },
    // 输入手机号
    changePhone(e) {
      console.log(`输入了手机号=>"${e.detail.value}"`);
      if (/1(3|4|5|7|8)\d{9}/.test(e.detail.value))
        this.setData({ phone: e.detail.value });
      else {
        wx.showToast({
          title: "不符合规范",
          icon: "error",
        });
        this.setData({ phone: null });
      }
    },
    // 点击修改4级省\市\区\街道的回调函数
    changeRegion(e) {
      this.setData({
        regionText:
          e.detail.value[0] +
          " " +
          e.detail.value[1] +
          " " +
          e.detail.value[2] +
          " " +
          e.detail.value[3],
        region: e.detail,
      });
      console.log("选择了区域=>", this.data.regionText);
    },
    // 点击修改2级详细地址
    changeAddress(e) {
      console.log(`输入了详细地址"${e.detail.value}"`);
      this.setData({ address: e.detail.value });
    },
    // 点击勾选/取消勾选 设为默认地址
    changeDefault() {
      this.setData({ default: !this.data.default });
    },
    // 点击保存地址
    submit() {
      if (
        this.data.name == null ||
        this.data.phone == null ||
        this.data.region == null ||
        this.data.address == null
      ) {
        wx.showToast({
          title: "还有未填字段",
          icon: "error",
        });
      }
    },
    onLoad(options) {
      this.setData({ navBarFullHeight: app.globalData.navBarFullHeight });
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
