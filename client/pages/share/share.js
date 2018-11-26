import regeneratorRuntime from '../../utils/regenerator-runtime/runtime-module.js';
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var app=getApp();
Page({
  data: {
    imgurl: '../../resources/logo.jpg',
    groups:[]
  },
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true//[msg|要求小程序返回分享目标信息]
    })
    this.loadAllGroup();
  },
  loadAllGroup:function(){
    var that=this;
    qcloud.request({
      url: config.service.allGroupUrl,
      login: true,
      success(result) {
        console.log('request success', result)
        var groups=result.data.data;
        that.setData({
          groups:groups
        });
      },
      fail(error) {
        console.log('request fail', error);
      }
    });
  },
  //[msg|明天在此处添加分页操作,明天分页]
  doEnterGroup: function (e){
    app.globalData.open_gid = e.currentTarget.dataset.opengid;
    console.log(e.currentTarget.dataset);
    console.log(app.globalData);
    wx.switchTab({
      url: '../homework/homework',
    })
  },
  onShareAppMessage: function () {
      var that=this;
      console.log("shareMessage")
      return{
        title:'一碗汤家校通',
        path: '/pages/start/start',
        success:function(res) {
          if (res.shareTickets&&res.shareTickets[0]){
            app.globalData.shareTicket = res.shareTickets[0];
            wx.showModal({
              title: '提示',
              content: '是否直接进入此群的家校通?',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定');
                  wx.redirectTo({
                    url: '../start/start',
                  });
                } else if (res.cancel) {
                  console.log('用户点击取消');
                }
              }
            })
          }else{
            wx.showToast({
              title: '请转发至群聊',
            })
          }
        },
        fail:function(err){
          console.log(err);
        },
        complete:function(err){
          console.log(err)
        }
      };
  },
})