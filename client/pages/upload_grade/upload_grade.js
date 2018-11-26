var app=getApp();
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
Page({
  data: {
    students: []
  },
  //[msg|0优|1良|2及格|3差|4未交]
  onLoad(options){
    console.log(options);
    var that=this;
    //[msg|在这里调用app中的方法加载班级名单]
    app.loadStudents().then(res => {
      that.setData({
        students: res.students
      });}).catch(e=>console.log(e));
    //[msg|在这里设置对于哪个作业进行上传成绩]
    this.setData({
      homework_id:options.homework_id
    });
    console.log(this.data);
  },
  formSubmit: function (e) {
    console.log(e.detail.value);
    var s = e.detail.value;
    var data = new Array();
    for (var i in s) {
      if (s.hasOwnProperty(i) && typeof s[i] != "function") {
        var temp = new Object();
        temp.student_id = i;
        temp.level = s[i];
        temp.homework_id=this.data.homework_id;
        data.push(temp);
      }
    }
    console.log("对象属性: ", data);
    qcloud.request({
      url: config.service.uploadGradeUrl,
      login: true,
      method:'POST',
      data: {
        data: data
      },
      success(result) {
        console.log('request success', result);
        util.showSuccess('提交成功');
        setTimeout(()=>wx.switchTab({
          url: '../homework/homework',
        }),1000)
      },
      fail(error) {
        console.log('request fail', error);
        util.showModel('提交失败',error);
      }
    });
  },
})