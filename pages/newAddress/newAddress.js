const app = getApp(); // 获取应用实例
Component({
  // 组件的属性可以用于接收页面的参数
  properties: {
    id: Number, //若为二次编辑的地址
    editName: String,
    editMobile: String,
    editAreaName: String,
    editCityName: String,
    editProvinceName: String,
    editStreet: String,
    editAddress: String,
  },
  data: {
    navBarFullHeight: 0, // 整个导航栏高度
    name: null, //收获姓名
    mobile: null, //手机号
    areaName: "省",
    cityName: "市",
    provinceName: "区",
    street: "街道",
    address: null, //二级详细地址
    default: true, //是否是默认收货地址
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
    changemobile(e) {
      console.log(`输入了手机号=>"${e.detail.value}"`);
      if (/1(3|4|5|7|8)\d{9}/.test(e.detail.value))
        this.setData({ mobile: e.detail.value });
      else {
        wx.showToast({
          title: "不符合规范",
          icon: "error",
        });
        this.setData({ mobile: null });
      }
    },
    // 点击修改1级粗略地址省\市\区\街道的回调函数
    changeRegion(e) {
      this.setData({
        areaName: e.detail.value[0],
        cityName: e.detail.value[1],
        provinceName: e.detail.value[2],
        street: e.detail.value[3],
      });
      console.log(
        "选择了区域=>",
        this.data.areaName,
        this.data.cityName,
        this.data.provinceName,
        this.data.street
      );
    },
    // 点击修改2级详细地址
    changeAddress(e) {
      console.log(`输入了详细地址"${e.detail.value}"`);
      if (/\s/.test(e.detail.value)) {
        wx.showToast({
          title: "禁止空字符",
          icon: "error",
        });
        this.setData({ address: null });
      } else this.setData({ address: e.detail.value });
    },
    // 点击勾选/取消勾选 设为默认地址
    changeDefault() {
      this.setData({ default: !this.data.default });
    },
    // 点击保存地址
    submit() {
      if (
        this.data.name == null ||
        this.data.mobile == null ||
        this.data.areaName == "省" ||
        this.data.address == null
      ) {
        wx.showToast({
          title: "还有未填字段",
          icon: "error",
        });
      } else {
        app
          .ajax({
            path: "/address/updateAddress",
            data: {
              id: this.data.id, //若为二次编辑的地址,则传入非空值表示修改/更新该id所代表的地址
              name: this.data.name, //字符串:收件人姓名
              mobile: this.data.editMobile, //字符串:手机号
              areaName: this.data.areaName,
              cityName: this.data.cityName,
              provinceName: this.data.provinceName,
              street: this.data.street,
              address: this.data.address, //字符串:二级详细地址
              isDefault: this.data.default, //是否将该地址替换为默认收货地址
            },
            method: "POST",
          })
          .then((res) => {
            console.log("保存/修改了地址=>", res);
            if (res.data.code == 200) wx.navigateBack();
          });
      }
    },
    onLoad() {
      this.setData({ navBarFullHeight: app.globalData.navBarFullHeight });
      if (this.data.id) {
        this.setData({
          name: this.data.editName,
          mobile: this.data.editMobile,
          areaName: this.data.editAreaName,
          cityName: this.data.editCityName,
          provinceName: this.data.editProvinceName,
          street: this.data.editStreet,
          address: this.data.editAddress,
        });
      }
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
