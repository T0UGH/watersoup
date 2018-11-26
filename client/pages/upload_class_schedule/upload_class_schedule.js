var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    week_value:0,
    base_value:0,
    len_value:0,
    lesson_index:0,
    week: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    base: ["第一节", "第二节", "第三节", "第四节", "第五节", "第六节", "第七节", "第八节"],
    len:[1,2,3,4,5,6,7,8],
     lesson_array: [],
     txtarray:[]
  },
  onLoad: function (options) {
    this.loadLesson();
  },
  bindWeekPickerChange: function (e) {
    this.setData({
      week_value: e.detail.value
    })
    console.log(this.data.week_value)
  },
  bindBasePickerChange: function (e) {
    this.setData({
      base_value: e.detail.value
    })
    console.log(this.data.base_value)
  },
  bindLenPickerChange: function (e) {
    this.setData({
      len_value: e.detail.value
    })
    console.log(this.data.len_value)
  },
  bindLessonPickerChange: function (e) {
    this.setData({
      lesson_index: e.detail.value
    })
    console.log(this.lesson_index)
  },
  loadLesson: function () {
    var that = this;
    //[msg|首先向后台请求my的数据]
    qcloud.request({
      url: config.service.teacherFromGroupUrl,
      login: true,
      data: {
        open_gid: app.globalData.open_gid,
      },
      success(result) {
        that.setData({
          lesson_array: result.data.data
        });
        console.log(that.data.lesson_array);
        var s = that.data.lesson_array
        var n = []
        for (var i in s) {
          if (s[i] != null) {
            var temp = new String
            temp = s[i].nickname + "     " + s[i].course
            n.push(temp)
          }
          // console.log(n);
        }
        that.setData({
          txtarray: n,
        })
      },
      fail(error) {
        //[msg|如果失败，就GG]
        // console.log('request fail', error);
      }
    });
  },
  formSubmit: function (e) {
    var lesson_len = parseInt(this.data.len_value)+1//lesson_len 没问题
    var data=[]
    for (var index = 0; index < lesson_len; index++) {
      console.log(index)
      var schedule_id = parseInt(this.data.week_value) * 8 + parseInt(this.data.base_value) +index
      var open_id = this.data.lesson_array[this.data.lesson_index].open_id
      var open_gid = app.globalData.open_gid
      var temp = new Object
      temp.schedule_id = schedule_id
      temp.open_id = open_id
      temp.open_gid = open_gid
      console.log(temp)
      data[index] = temp
    }
    var requestData= new Object;
    requestData.data=data;
    qcloud.request({
      url: config.service.uploadClassScheduleUrl,
      login: true,
      data: requestData,
      success(result) {
        console.log('request success', result);
        util.showSuccess('提交成功');
        wx.switchTab({
          url: '../homework/homework',
        })
      },
      fail(error) {
        console.log('request fail', error);
        util.showModel('提交失败', error);
      }
    });
  }
})