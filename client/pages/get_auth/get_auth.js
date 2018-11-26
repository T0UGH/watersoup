var app=getApp();
Page({
  data: {
    imgurl: '../../resources/logo.jpg'
  },
  onLoad: function (options) {
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
  bindGetUserInfo:function (e) {
    wx.redirectTo({
      url: '../start/start',
    })
  },
})