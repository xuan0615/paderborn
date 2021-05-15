var util = require('../../../util/util.js')    //database的路径在第三层 应该用../../../util/util.js
var app = getApp()

Page({
  data: {
    allParams: [{
        text: '径向力',
        value: 'force'
      },
      {
        text: '第一相电流',
        value: 'phase_current_1'
      },
      {
        text: '第二相电流',
        value: 'phase_current_2'
      },
      {
        text: '旋转速率',
        value: 'speed'
      },
      {
        text: '负荷扭矩',
        value: 'torque'
      },
      {
        text: '振动信号',
        value: 'vibration_1'
      }
    ],
    time: '',
    //fjnum: ['fan1', 'fan2'],
    array: ['1号轴承', '2号轴承','3号轴承','4号轴承','5号轴承','6号轴承','7号轴承','8号轴承','9号轴承','10号轴承','11号轴承','12号轴承'],
    devicename:'',       //由实时监控页面传输过来的设备号
    username:[1,2,3,4,5,6,7,8,9,10,11,12],
    allConditionName: ['径向力', '第一相电流', '第二相电流', '旋转速率', '负荷扭矩', '振动信号'],
    index: 0,              
    labels: [],
    result: [],
    series: [],
    i: 0,
    timer: '',
  },
  onLoad: function (options) {
    this.setData({index:options.index})
    this.setData({devicename:options.id})
    this.getAllParamsDatas(this.data.devicename)
    this.setData({
      time: util.formatTime(new Date()),
    })
  },
  //获取单个工况原始数据
  getSingParamData: function (fanId, attr, callback) {
    var that = this
    wx.request({
      url: 'https://phmlearn.com/component/data/paderborn',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        access_token: app.globalData.access_token,
        device_id: fanId,
        attribute: attr
      },
      success: function (res) {
        callback(res)
      }
    })
  },

  //获取所有工况数据
  getAllParamsDatas: function (fanId) {
    const allParamsName = this.data.allParams;
    let promises = []
    for (let i = 0; i < allParamsName.length; i++) {
      let paramsKey = allParamsName[i].value
      if(i === 0){

        promises.push(this.getSingParamData(fanId, paramsKey, res => {
          const data = res.data.data.force
          this.setData({
            [`result[${i}]`]: {
              key: allParamsName[i].text,
              max: util.getMaxValue(data),
              min: util.getMinValue(data),
              arr: util.getDataArray(data)       //result数组初始化数组为空数组
            }
          })
        }))
      }
      else if(i===1){
        promises.push(this.getSingParamData(fanId, paramsKey, res => {
          const data = res.data.data.phase_current_1
          this.setData({
            [`result[${i}]`]: {
              key: allParamsName[i].text,
              max: util.getMaxValue(data),
              min: util.getMinValue(data),
              arr: util.getDataArray(data)       //result数组初始化数组为空数组
            }
          })
        }))  
      }
      else if(i===2){
        promises.push(this.getSingParamData(fanId, paramsKey, res => {
          const data = res.data.data.phase_current_2
          this.setData({
            [`result[${i}]`]: {
              key: allParamsName[i].text,
              max: util.getMaxValue(data),
              min: util.getMinValue(data),
              arr: util.getDataArray(data)       //result数组初始化数组为空数组
            }
          })
        }))  
      }
      else if(i===3){
        promises.push(this.getSingParamData(fanId, paramsKey, res => {
          const data = res.data.data.speed
          this.setData({
            [`result[${i}]`]: {
              key: allParamsName[i].text,
              max: util.getMaxValue(data),
              min: util.getMinValue(data),
              arr: util.getDataArray(data)       //result数组初始化数组为空数组
            }
          })
        }))  
      }
      else if(i===4){
        promises.push(this.getSingParamData(fanId, paramsKey, res => {
          const data = res.data.data.torque
          this.setData({
            [`result[${i}]`]: {
              key: allParamsName[i].text,
              max: util.getMaxValue(data),
              min: util.getMinValue(data),
              arr: util.getDataArray(data)       //result数组初始化数组为空数组
            }
          })
        }))  
      }
      else if(i===5){
        promises.push(this.getSingParamData(fanId, paramsKey, res => {
          const data = res.data.data.vibration_1
          this.setData({
            [`result[${i}]`]: {
              key: allParamsName[i].text,
              max: util.getMaxValue(data),
              min: util.getMinValue(data),
              arr: util.getDataArray(data)       //result数组初始化数组为空数组
            }
          })
        }))  
      }
    }
    Promise.all(promises).then(res => {
      this.startTimer();
      this.setDate()
    })
  },
 

  //开启刷新时间定时器
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
  //关闭定时器
  closeTimer: function (time) {
    clearInterval(time)
  },
  //切换设备picker
  bindPickerChange: function (e) {
  let arr = ['1_M01_F10','2_M01_F10','3_M01_F10','4_M01_F10',
              '5_M07_F04','6_M07_F04','7_M07_F04','8_M07_F04',
              '9_M07_F10','10_M07_F10','11_M07_F10','12_M07_F10']                                    
    this.closeTimer(this.data.timer)
    this.closeTimer(this.data.timer2)    //因为getAllparamsDatas会开启时钟，所以切换时暂时关闭时钟
    this.setData({
      index:e.detail.value
    })
    let j = this.data.index
    this.getAllParamsDatas(arr[j])
  },

 
  //页面卸载时清空定时器
  onUnload: function () {
    if (this.data.timer) {
      this.closeTimer(this.data.timer)
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
})