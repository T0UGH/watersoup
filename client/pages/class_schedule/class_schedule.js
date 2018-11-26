var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    isHeadMaster: false,
    deleteState: false,//[msg|判断当前是否为可删除状态]
    editState: false,//[msg|判断当前是否为编辑状态]
    dialogState: false,//[msg|判断当前是否显示对话框状态]
    selectIndex: -1,//[msg|当前选中元素的索引,没有选中就是-1]
    state: 1,
    display: [],
    //uploadlessen
    week_value: 0,
    base_value: 0,
    len_value: 0,
    lesson_index: 0,
    week: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    base: ["第一节", "第二节", "第三节", "第四节", "第五节", "第六节", "第七节", "第八节"],
    len: [1, 2, 3, 4, 5, 6, 7, 8],
    lesson_array: [],
    txtarray: []
  },
  onShareAppMessage: function () {
    
  },
  onLoad:function(){
    this.loadClass_schedule()
    this.loadLesson()
  },
  //选中盒子变色并且改变selectIndex
  on_Chose:function(e){
    if (this.data.editState){
      this.setData({
        selectIndex: e.currentTarget.dataset.index
      })
    }
    
  },
  bindModify:function(){
    if (this.data.selectIndex!=-1){
      this.showDialog();
      this.changeDeleteState(this.data.selectIndex);
      this.load_ChoseView_Value(this.data.selectIndex);
    }
  },
  bindDelete:function(){
    if (this.data.selectIndex != -1&&this.data.display[this.data.selectIndex] != undefined && this.data.display[this.data.selectIndex].course!= ""){
      this.deleteClass_Schedule();
    }
  },
  changeDeleteState:function(t){
    if(this.data.display[t].course!=""){
      this.setData({
        deleteState: true
      })
    }else{
    }

  },
  ////这里要把点击的view的值传过来，把week_value,base_value,setData了
  load_ChoseView_Value:function(t){
    var week_temp = parseInt(t / 8) 
    var base_temp = parseInt(t % 8)
    this.setData({
      week_value: week_temp,
      base_value: base_temp,
    })
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
  //子页面修改提交
  formSubmit: function (e) {
    var that = this;
    var lesson_len = parseInt(this.data.len_value) + 1//lesson_len 没问题
    var data = []
    for (var index = 0; index < lesson_len; index++) {
      console.log(index)
      var schedule_id = parseInt(this.data.week_value) * 8 + parseInt(this.data.base_value) + index
      var open_id = this.data.lesson_array[this.data.lesson_index].open_id
      var open_gid = app.globalData.open_gid
      var temp = new Object
      temp.schedule_id = schedule_id
      temp.open_id = open_id
      temp.open_gid = open_gid
      console.log(temp)
      data[index] = temp
    }
    var requestData = new Object;
    requestData.data = data;
    console.log('qcloud0');
    qcloud.request({
      url: config.service.uploadClassScheduleUrl,
      login: true,
      data: requestData,
      success(result) {
        console.log('request success', result);
        util.showSuccess('提交成功');
        that.hideDialog();
        that.loadClass_schedule();
        that.setData({
          len_value: 0,
          lesson_index: 0,
        })
      },
      fail(error) {
        console.log('request fail', error);
        util.showModel('提交失败', error);
      }
    });
  },

//删除
  deleteClass_Schedule: function () {
    var that = this;
      var temp = new Object
      temp.schedule_id = this.data.selectIndex
      temp.open_gid = app.globalData.open_gid
      console.log(temp)
    var Data = new Object;
    Data.data = temp;
    console.log('qcloud1');
    qcloud.request({
      url: config.service.deleteClassScheduleUrl,
      login: true,
      data: Data,
      success(result) {
        console.log('request success', result);
        util.showSuccess('删除成功');
        that.hideDialog();
        that.loadClass_schedule();
        that.setData({
          len_value: 0,
          lesson_index: 0,
        })
      },
      fail(error) {
        console.log('request fail', error);
        util.showModel('提交失败', error);
      }
    });
  },
//#####################################################################
  //请求课程信息
  loadLesson: function () {
    var that = this;
    //[msg|首先向后台请求课程的数据]
    console.log('qcloud2');
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


  loadClass_schedule: function () {
    var that = this;
    this.setData({
      selectIndex:-1,
    })
    //[msg|首先向后台请求课表的数据]
    console.log('qcloud3');
    qcloud.request({
      url: config.service.classScheduleUrl,
      login: true,
      data: {
        open_gid: app.globalData.open_gid,
      },
      success(result) {
      var n=[]
      var arrive_array = result.data.data.data
      console.log(arrive_array);
      var isheadmaster = result.data.data.is_headmaster
      if (isheadmaster){
        that.setData({
          isHeadMaster: true,
        })
      }
      for (var i=0;i<56;i++) {
      var temp = new Object
      temp.week = parseInt(i/ 8) + 1
      temp.base = parseInt(i% 8) + 1
      temp.len = 1
      temp.course = ""
      n.push(temp)
    }//空课表
      for (var j=0;j<arrive_array.length;j++) {
        n[arrive_array[j].schedule_id].course = arrive_array[j].course//[bug|here]
      }//填数
      that.setData({
        display: n
      })
      console.log(arrive_array);
      },
      fail(error) {
        //[msg|如果失败，就GG]
        // console.log('request fail', error);
      }
    });
  },
  //[msg|编辑按钮的事件监听器]
  bindEditButton: function () {
    if (!this.data.editState) {
      this.changeEditState();//[msg|切换状态]
    } else {
      this.changeEditState();
    }
  },
  //[msg|切换编辑状态,编辑还是不编辑]
  changeEditState: function () {
    this.setData({
      editState: !(this.data.editState)
    })
  },
  //[msg|弹出对话框]
  showDialog: function () {
    this.setData({
      dialogState: true
    })
  },
  //[msg|隐藏对话框]
  hideDialog: function () {
    console.log('调用hide');
    this.setData({
      dialogState: false,
       deleteState: false,
    })
  },
})