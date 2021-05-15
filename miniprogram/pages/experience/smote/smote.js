// pages/datapre/datapre.js
var util = require('../../../util/util.js');
var app=getApp();
Page({
  data: {
  },
  onLoad: function (options) {
  },
  formsubmit(e){
    util.reqFunc('https://phmlearn.com/component/pre/smote',
    {
      "access_token": app.globalData.access_token,
      "file_name": app.globalData.input_fileName,
      "ratio": e.detail.value.inputValue1,
    },"datapre",function(res){
      app.globalData.output_fileName = res.data.data.file_name;
    })
  }
  ,
  
})