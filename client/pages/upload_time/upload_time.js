var app = getApp();
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
Page({

  data: {
    level: [
      { name: "多", value: "0" },
      { name: "中", value: "1" },
      { name: "少", value: "2" }
    ],
    using_time: "00:15",
    homework_id:-1
  },
  onLoad(options) {
    console.log(options);
    this.setData({
      homework_id: options.homework_id
    });
    console.log(this.data);
  },
  onLoad: function (options) {
    console.log(options);
    this.setData({
      homework_id: options.homework_id
    });
    console.log(this.data);
  },
  bindTimeChange: function (e) {
    this.setData({
      using_time: e.detail.value
    })
  },
  formSubmit: function (e) {   
    var warn = "";//[msg|弹框时提示的内容] 
    var flag = true;//[msg|判断信息输入是否完整] 
    if(!e.detail.value.comment){
      warn="请选择作业评价"
    }else{
      flag =false;
    }
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var data=e.detail.value;
    data.open_gid=app.globalData.open_gid;
    data.homework_id=this.data.homework_id;
    //[msg|如果信息填写不完整，弹出Toast来提示用户]  
    if (flag == true) {
      wx.showToast({
        title: warn,
        icon: "none"
      })
    }else{
      qcloud.request({
        url: config.service.uploadTimeUrl,
        login: true,
        data: data,
        success(result) {
          console.log('request success', result);
          util.showSuccess('提交成功');
          setTimeout(() => wx.switchTab({
            url: '../homework/homework',
          }), 1000)
        },
        fail(error) {
          console.log('request fail', error);
          util.showModel('提交失败', error);
        }
      });
    }
    //[wait|后台的提交逻辑神马的在这里加]
  },
})