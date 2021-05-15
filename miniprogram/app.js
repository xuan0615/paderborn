//app.js
App({
  onLaunch: function () {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
         env: 'hfx-186-1gyvq3mp647fc136',
        traceUser: true,
      })
    }

    this.globalData = {
      input_fileName: "data_14453601446516499.csv",
      access_token: "e287441a00d249e19cdfc536e6cfe64a.1d8334992423a76205d49a8013a72f06",
      output_fileName: '',
      resultArray: []
    }
  }

})