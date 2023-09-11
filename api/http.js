export const https = "http://192.168.1.11:8080";
export const ajax = ({ path, data, method = "GET" }) => {
  let app = getApp(); // 获取应用实例
  let header;
  if (method == "GET")
    header = {
      authentication: app.globalData.userInfo.token,
    };
  else
    header = {
      authentication: app.globalData.userInfo.token,
      // "Content-Type": "application/x-www-form-urlencoded",
      "Content-Type": "application/json",
    };
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${https}${path}`, //请求地址
      data: data, //请求体
      method: method, //请求方法
      header: header, //请求头
      success: (ret) => {
        resolve(ret);
      }, //成功回调
      fail: (err) => {
        reject(err);
      }, //失败回调
    });
  });
};
//网络请求,e=请求方式,r[0]=api地址 r[1]=向后台发送的数据
//callback=回调函数
/* export const Ajax = (e, r, callback) => {
  let method = `GET`; //默认请求方式
  if (typeof e === `string`) method = e;
  else {
    callback = r;
    r = e;
  }
  //要请求的服务器地址，Host是你的服务器地址，是你的 api 地址 r[0]
  let url = Host + r[0];
  let a = wx.request({
    url: url,
    method: method,
    data: r[1],
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    success: (res) => {
      if (Array.isArray(callback)) callback[0](res.data);
      else callback(res.data);
    },
    fail: (res) => {
      if (callback[1]) callback[1](res);
      else {
        wx.showToast({
          title: `服务器开了小差`,
          icon: `none`,
          duration: 3000,
        });
      }
    },
  });
}; */
//promise 发送ajax
