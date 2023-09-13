const app = getApp(); // 获取应用实例
Component({
  data: {
    navBarFullHeight: 0, // 整个导航栏高度
    addressList: [], //地址的数量
    isDelete: false, //是否处于多选状态
    btn1Text: "批量删除",
    btn2Text: "新建地址",
  },
  methods: {
    // 跳转新建地址路由,或确认删除
    addOrRemove() {
      if (this.data.isDelete) {
        let arr = [];
        this.data.addressList.forEach((i) => {
          if (i.checked) arr.push(i.id);
        });
        if (arr.length > 0) {
          app
            .ajax({
              path: `/address/batchDeleteAddress/${arr}`,
              method: "DELETE",
            })
            .then((res) => {
              console.log("删除地址成功=>", res);
              // 重载当前页面
              this.onShow();
              this.deleteOrCancel();
            });
        } else
          wx.showToast({
            title: "未勾选地址",
            icon: "error",
          });
      } else
        wx.navigateTo({
          url: "/pages/newAddress/newAddress",
        });
    },
    // 点击切换删除状态
    deleteOrCancel() {
      if (this.data.isDelete) {
        this.setData({
          isDelete: false,
          btn1Text: "批量删除",
          btn2Text: "新建地址",
        });
      } else {
        this.setData({
          isDelete: true,
          btn1Text: "取消",
          btn2Text: "确认删除",
        });
      }
    },
    // 点击勾选/取消勾选
    selectThis(e) {
      if (this.data.isDelete) {
        let addressList = this.data.addressList;
        addressList[e.currentTarget.dataset.index].checked = !addressList[
          e.currentTarget.dataset.index
        ].checked;
        this.setData({ addressList });
      }
    },
    // 点击编辑地址
    editThis(e) {
      let i = e.currentTarget.dataset.index;
      let arr = this.data.addressList;
      wx.navigateTo({
        url: `/pages/newAddress/newAddress?id=${arr[i].id}&editName=${arr[i].name}&editMobile=${arr[i].mobile}&editAreaName=${arr[i].areaName}&editCityName=${arr[i].cityName}&editProvinceName=${arr[i].provinceName}&editStreet=${arr[i].street}&editAddress=${arr[i].address}`,
      });
    },
    onLoad(options) {
      this.setData({ navBarFullHeight: app.globalData.navBarFullHeight });
    },
    onReady() {},
    onShow() {
      app
        .ajax({
          path: "/address/queryAddress",
        })
        .then((res) => {
          console.log("获取到了收货地址=>", res);
          this.setData({ addressList: res.data.data });
        });
    },
    onHide() {},
    onUnload() {},
    onPullDownRefresh() {},
    onReachBottom() {},
    onShareAppMessage() {},
  },
});
