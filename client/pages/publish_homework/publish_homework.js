import regeneratorRuntime from '../../utils/regenerator-runtime/runtime-module.js';
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var app=getApp();
Page({
  data: {
    homeworkValue:'',
    imgUrl: '',
    submit_button_locker:false,
  },
  //[msg|对提交按钮加锁的函数]
  lockSubmit:function(){
    this.setData({
      submit_button_locker: true
    })
  },
    //[msg|对提交按钮解锁的函数]
  unlockSubmit: function () {
    this.setData({
      submit_button_locker: false
    })
  },
  onShow:function(){
    this.unlockSubmit();
  },
  //[msg|提交表单]
  submit:function(e){
    var that=this;
    var data=e.detail.value,//[msg|后面对data进行了各种操作，目的是为了构建一个传给后台的对象]
        imgUrl=this.data.imgUrl;
    data.time=new Date().getTime();//[msg|这里得到一个代表时间的num]
    data.open_gid = app.globalData.open_gid;//[msg|把这个群的open_gid拿上]
    if(imgUrl!='')//[这里判断用户是否上传了图片]
      data.img_url=imgUrl
    if(data.content||data.img_url){//[图片和文字必须有一个有有效内容]
      that.lockSubmit();//[对按钮加锁，防止重复发送]
      qcloud.request({
        url: config.service.publish_homework,
        login: true,
        data: data,
        success(result) {//[msg|发送成功的回调函数：只是简单的告诉用户发送成功了]
          console.log('request success', result);
          util.showSuccess("发布成功!")
          setTimeout(() => {
            that.setData({
              imgUrl: '',
              homeworkValue: ''
            });
            wx.switchTab({
              url: '../homework/homework',
            });
          }, 1000)
        },
        fail(error) {//[msg|发送失败的回调函数：只是简单的告诉用户发送失败了]
          console.log('request fail', error);
          util.showSuccess("发布失败!")
        }
      });
    }else{
      wx.showToast({
        title: '请填写有效内容',
        icon:'none'
      })
    }
  },
  //[msg|分享的触发器]
  onShareAppMessage: function () {
    return {
      title: '一碗汤家校通',
      path: '/pages/start/start',
      success(res) {
        console.log(res.shareTickets[0])
        wx.showToast({
          title: '转发成功',
          icon: 'success'
        })
      }
    }
  },
  //[msg|上传图片，是一个异步函数]
  doUpload:async function () {
    try{
      var imgUrl = await app.uploadImg();
      this.setData({
        imgUrl:imgUrl
      })
    }catch(e){
      console.log(e);
    }
  },
})