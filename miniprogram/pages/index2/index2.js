import * as echarts from '../../ec-canvas/echarts';
var util = require('../../util/util.js')
var app = getApp();

let chart = null;

Page({

  data: {
    time: '',
    array: ['1号轴承', '2号轴承','3号轴承','4号轴承','5号轴承','6号轴承','7号轴承','8号轴承','9号轴承','10号轴承','11号轴承','12号轴承'],
    allConditionName: ['径向力', '第一相电流', '第二相电流', '旋转速率', '负荷扭矩', '振动信号'],
    index: 0,              //设备编号的初始值
    index2: 0,
    labels: [],
    labels1:[],labels2: [],labels3: [],labels4:[],labels5: [],labels6: [],
    labels7: [],labels8: [],labels9: [],labels10: [],labels11: [],labels12: [],
    result: [],
    series: [],
    i: 0,
    k:0,
    hidden:false,
    timer: '',
    dtimer: '',
    timer2: '',
    chartTimer: '',
    ec: {
      lazyLoad: true
    }
  },

  onLoad: function() {
    this.getdatas()
    this.timerdata()
    this.startTimer()
    this.setDate()
  },


  setDate: function () {
    this.setData({
      timer2: setInterval(() => {
        this.setData({
          time: util.formatTime(new Date())
        })
      }, 1000)
    })
  },
  //开启刷新数据定时器
  startTimer: function () {
    var that= this
    that.setData({
      i: 0
    })
    that.setData({
      timer: setInterval(() => {
        if (that.data.i <= 50) {
          that.setData({
            i: that.data.i + 1
          })
        } else {
          that.setData({
            i: 0
          })
        }
      }, 1000)
    })
  },

  timerdata: function () {          
    var that= this
    that.setData({
      k: 0
    })
    that.setData({
      dtimer: setInterval(() => {
        if (that.data.k <49) {
          that.setData({
            k: that.data.k + 1
          })
        } else {
          that.setData({
            k: 0
          })
        }
        // if()
      }, 500)
    })
  },

  //关闭定时器
  closeTimer: function (time) {
    clearInterval(time)
  },

  getdatas:function(){
    var that = this
    that.getLabel('1_M01_F10')
    that.getLabel('2_M01_F10')
    that.getLabel('3_M01_F10')
    that.getLabel('4_M01_F10')
    that.getLabel('5_M07_F04')
    that.getLabel('6_M07_F04')
    that.getLabel('7_M07_F04')
    that.getLabel('8_M07_F04')
    that.getLabel('9_M07_F10')
    that.getLabel('10_M07_F10')
    that.getLabel('11_M07_F10')
    that.getLabel('12_M07_F10')
  },

  //wx.request为异步请求,后续操作必须封装在success返回函数里面
  getLabel: function (fanId) {
    var that =this
    wx.request({
    url: 'https://phmlearn.com/component/upload/2/344',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        access_token: app.globalData.access_token,
        file_name: fanId+'_test.csv'
      },
      success: function (res) {
        app.globalData.output_fileName2 = res.data.data.file_name;
        wx.request({
          url: 'https://phmlearn.com/component/upload/ML/model/145/335',
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              access_token: app.globalData.access_token,
              file_name: app.globalData.output_fileName2 
            },
            success: (res) => {
                if (fanId=='1_M01_F10') {that.setData({labels1:res.data.data.predict})}
                if (fanId=='2_M01_F10') {that.setData({labels2:res.data.data.predict})}
                if (fanId=='3_M01_F10') {that.setData({labels3:res.data.data.predict})}
                if (fanId=='4_M01_F10') {that.setData({labels4:res.data.data.predict})}
                if (fanId=='5_M07_F04') {that.setData({labels5:res.data.data.predict})}
                if (fanId=='6_M07_F04') {that.setData({labels6:res.data.data.predict})}
                if (fanId=='7_M07_F04') {that.setData({labels7:res.data.data.predict})}
                if (fanId=='8_M07_F04') {that.setData({labels8:res.data.data.predict})}
                if (fanId=='9_M07_F10') {that.setData({labels9:res.data.data.predict})}
                if (fanId=='10_M07_F10') {that.setData({labels10:res.data.data.predict})}
                if (fanId=='11_M07_F10') {that.setData({labels11:res.data.data.predict})}
                if (fanId=='12_M07_F10') {that.setData({labels12:res.data.data.predict})
                console.log(that.data.labels12)}

            }    //这是success返回函数的反括号s
          })
      }
    })

  },
  
  btn1(){
    wx.navigateTo({
      url: '/pages/index2/database/database?id=1_M01_F10&index=0'
    })
  },
  btn2(){
    wx.navigateTo({
      url: '/pages/index2/database/database?id=2_M01_F10&index=1'
    })
  },
  btn3(){
    wx.navigateTo({
      url: '/pages/index2/database/database?id=3_M01_F10&index=2'
    })
  },
  btn4(){
    wx.navigateTo({
      url: '/pages/index2/database/database?id=4_M01_F10&index=3'
    })
  },
  btn5(){
    wx.navigateTo({
      url: '/pages/index2/database/database?id=5_M07_F04&index=4'
    })
  },
  btn6(){
    wx.navigateTo({
      url: '/pages/index2/database/database?id=6_M07_F04&index=5'
    })
  },
  btn7(){
    wx.navigateTo({
      url: '/pages/index2/database/database?id=7_M07_F04&index=6'
    })
  },
  btn8(){
    wx.navigateTo({
      url: '/pages/index2/database/database?id=8_M07_F04&index=7'
    })
  },
  btn9(){
    wx.navigateTo({
      url: '/pages/index2/database/database?id=9_M07_F10&index=8'
    })
  },
  btn10(){
    wx.navigateTo({
      url: '/pages/index2/database/database?id=10_M07_F10&index=9'
    })
  },
  btn11(){
    wx.navigateTo({
      url: '/pages/index2/database/database?id=11_M07_F10&index=10'
    })
  },
  btn12(){
    wx.navigateTo({
      url: '/pages/index2/database/database?id=12_M07_F10&index=11'
    })
  },

  onUnload: function () {
    if (this.data.timer) {
      this.closeTimer(this.data.timer)
    }
    if (this.data.dtimer) {
      this.closeTimer(this.data.dtimer)
    }
    if (this.data.timer2) {
      this.closeTimer(this.data.timer2)
    }
    if (this.data.chartTimer) {
      this.closeTimer(this.data.chartTimer)
    }
  },

  onShareAppMessage: function() {
  },

  onRead: function (options) {
  }
})