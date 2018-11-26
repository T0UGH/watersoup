var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var app = getApp();
Page({
  data: {
    state: -1,//[msg|0家长&&1老师]
    info: {},
  },
  onLoad: function (options) {
    this.setData({
      state:app.globalData.state
    })
    this.loadInfo();
    console.log('success');
  },
  loadInfo: function () {
    var that = this;
    //[msg|首先向后台请求homework的数据]
    qcloud.request({
      url: config.service.my_infoUrl,
      login: true,
      data: {
        open_gid: app.globalData.open_gid,
      },
      success(result) {
        console.log('request success', result);
        that.setData({
          info : result.data.data[0]
        });
      },
      fail(error) {
        //[msg|如果失败，就GG]
        console.log('request fail', error);
      }
    });
  },
  doLogoff:function(){
    wx.redirectTo({
      url:'../share/share',
    })
  },
  bindSendBug:function(){
    wx.showToast({
      title: '还未开放',
      icon:'none'
    })
  },
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
})