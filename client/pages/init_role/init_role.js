const app=getApp();
Page({
  data: {
    has_init_group:false
  },
  onLoad: function (options) {
    console.log(options);
    console.log(app.globalData);
    this.setData({
      has_init_group:!!Number(options.has_init_group)
    });
    console.log(this.data);
  },
  onShareAppMessage: function () {
  
  },
  doHeadMaster:function(){
    wx.navigateTo({
      url: '../init_teacher/init_teacher?isHeadMaster=1',
    })
  },
  doTeacher:function(){  
    wx.navigateTo({
      url: '../init_teacher/init_teacher?isHeadMaster=0',
    })
  },
  doParent:function(){
    wx.navigateTo({
      url: '../init_parent/init_parent',
    })
  }
})