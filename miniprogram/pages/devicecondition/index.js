var util = require('../../util/util.js')
import * as echarts from '../../ec-canvas/echarts';
var initChart = null
var app = getApp()

function setOption(chart, ylist) {
  var options = {
    title: {
      left: 'center'
    },
    color: ["#37A2DA"],
    grid: {
      top: 20,
      right: 20,
      bottom: 30
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['6s前', '5s前', '4s前', '3s前', '2s前', '1s前']
    },
    yAxis: {
      x: 'center',
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [{
      type: 'line',
      areaStyle: {},
      data: ylist
    }]
  }
  chart.setOption(options);
}



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
    allConditionName: ['径向力', '第一相电流', '第二相电流', '旋转速率', '负荷扭矩', '振动信号'],
    index: 0,              //设备编号的初始值
    index2: 0,
    labels: [],
    result: [],
    series: [],
    i: 0,
    timer: '',
    timer2: '',
    chartTimer: '',
    ec: {
      lazyLoad: true
    }
  },
  onLoad: function () {
    this.getAllParamsDatas('1_M01_F10')
    this.getLabel('1_M01_F10')
    wx.cloud.callFunction({
      name:'getvalue',
      data:{
        fanId:'1_M01_F10',
        attr :'force'
    },success:function(res){
      console.log(res.result.res1)
    },
    fail:console.error
  }
    )
    //this.startTimer()
    this.setData({
      time: util.formatTime(new Date()),
    })
    this.oneComponent = this.selectComponent('#mychart-dom-line');
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

        this.getSingParamData(fanId,paramsKey,res=>{
          this.getChartdata(res.data.data.force)
        })
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
  //获取折线图数据
  getChartdata: function (array) {
    wx.showLoading({
      title: '折线图加载中',
    })
    if (this.data.chartTimer) {
      this.closeTimer(this.data.chartTimer)
    }
    let index = 0
    this.setData({
      chartTimer: setInterval(() => {
        if (index <= 3000) {
          this.setData({
            ylist: array.slice(index, index + 6)
          })
          index++
        } else {
          this.closeTimer(this.data.chartTimer)
          this.setData({
            ylist: array.slice(array.length - 7, array.length - 1)
          })
        }
        this.oneComponent.init((canvas, width, height) => {
          const chart = echarts.init(canvas, null, {
            width: width,
            height: height
          });
          setOption(chart, this.data.ylist) //赋值给echart图表
          this.chart = chart;
          wx.hideLoading()
          return chart;
        });
      }, 2000)
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
    let arr = ['1_M01_F10','2_M01_F10','3_M01_F10','4_M01_F10','5_M07_F04','6_M07_F04','7_M07_F04','8_M07_F04','9_M07_F10',
    '10_M07_F10',
    '11_M07_F10',
    '12_M07_F10']                                    
    this.closeTimer(this.data.timer)
    this.closeTimer(this.data.timer2)    //因为getAllparamsDatas会开启时钟，所以切换时暂时关闭时钟
    this.setData({
      index:e.detail.value
    })
    let j = this.data.index
    this.getLabel(arr[j])
    this.getAllParamsDatas(arr[j])
  },
  //切换工况picker
  bindPickerChange2: function (e) {
    this.setData({
      index2: e.detail.value
    })
    let index = e.detail.value
    let arr = this.data.result[index].arr
    this.getChartdata(arr)
  },
  //通过phm平台的api算出预测的数据
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
        app.globalData.output_fileName = res.data.data.file_name;
      }
    })
    
    wx.request({
      url: 'https://phmlearn.com/component/upload/ML/model/145/335',
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          access_token: app.globalData.access_token,
          file_name: app.globalData.output_fileName //这里app.globalData.output_fileName要设初始值，onload会报错
        },
        success: (res) => {
          that.setData({
            labels:res.data.data.predict
          })
          console.log(that.data.labels)
        }
      })

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