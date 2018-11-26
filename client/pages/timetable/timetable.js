var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var app = getApp();
Page({
  data: {
    isHeadMaster:false,
    editState: false,//[msg|判断当前是否为编辑状态]
    dialogState: false,//[msg|判断当前是否显示对话框状态]
    timeList: [],
    selectIndex: -1,//[msg|当前选中元素的索引,没有选中就是-1]
    activity_name: '',
    start_time: "08:00",
    end_time: "08:00",
  },
  onLoad: function (options) {
    this.loadTimeTable();
  },
  onShareAppMessage: function () {

  },
  uploadTimetable:function(){
    var that = this;
    console.log('uploadTimetable');
    qcloud.request({
      url: config.service.uploadTimetableUrl,
      login: true,
      method: 'POST',
      data: {
        open_gid: app.globalData.open_gid,
        timetable: that.data.timeList
      },
      success: function (res) {
        console.log(res);
        that.loadTimeTable();//[如果ok就刷新一下]
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  loadTimeTable:function(){
    var that=this;
    console.log('loadTimeTable');
    qcloud.request({
      url: config.service.timetableUrl,
      login: true,
      method:'GET',
      data: {
        open_gid: app.globalData.open_gid,
      },
      success:function(res){
        var timeList=res.data.data.timetable==null?[]:res.data.data.timetable;//[msg|如果为null则GG]
        that.setData({
          timeList:timeList,
          isHeadMaster: !!(res.data.data.is_headmaster)
        })
      },
      fail:function(err){
        console.log(err)
      }
    })
  },
  //[msg|编辑按钮的事件监听器]
  bindEditButton: function () {
    if (!this.data.editState){
      this.changeEditState();//[msg|切换状态]
      this.initSelectIndex();//[msg|]
    }else{
      this.changeEditState();
      this.initSelectIndex();
      this.uploadTimetable();
    }
  },
  //[msg|选择盒子用的]
  bindSelectItem: function (e) {
    if (this.data.editState) {
      var selectIndex = e.currentTarget.dataset.selectindex;
      if (selectIndex == this.data.selectIndex) {
        this.setData({
          selectIndex: -1
        })
      }
      else {
        this.setData({
          selectIndex: selectIndex
        })
      }
    }
  },
  //[msg|点击插入按钮,只是单纯的显示对话框]
  bindInsert: function () {
    this.init_dialogContent();
    this.showDialog();
  },
  init_dialogContent: function () {
    this.setData({
      activity_name: '',
      start_time: "08:00",
      end_time: "08:00",
    })
  },
  //[msg|点击更改按钮,做点事情]
  bindModify: function () {
    var timeList = this.data.timeList;
    var selectIndex = this.data.selectIndex;
    if (selectIndex != -1) {
      var activity_name = timeList[selectIndex].activity;
      var start_time = timeList[selectIndex].timePeriod.split('-')[0];
      var end_time = timeList[selectIndex].timePeriod.split('-')[1];
      timeList.splice(selectIndex, 1);//删除一个
      selectIndex--;
      this.setData({
        activity_name: activity_name,
        start_time: start_time,
        end_time: end_time,
        timeList: timeList,
        selectIndex: selectIndex
      });
      this.showDialog();
    }
  },
  //[msg|点击上移按钮]
  bindUp: function () {
    var selectIndex = this.data.selectIndex;
    if (selectIndex > 0) {
      var timeList = this.data.timeList;
      timeList[selectIndex - 1] = timeList.splice(selectIndex, 1, timeList[selectIndex - 1])[0];
      this.setData({
        timeList: timeList,
        selectIndex: this.data.selectIndex - 1
      })
    }
  },
  //[msg|点击下移按钮]
  bindDown: function () {
    var selectIndex = this.data.selectIndex;
    var timeList = this.data.timeList;
    if (selectIndex != -1 && selectIndex < timeList.length - 1) {
      timeList[selectIndex + 1] = timeList.splice(selectIndex, 1, timeList[selectIndex + 1])[0];
      this.setData({
        timeList: timeList,
        selectIndex: this.data.selectIndex + 1
      })
    }
  },
  //[msg|点击删除按钮,删除当前选中的盒子，并且去除选择状态]
  bindDelete: function () {
    var selectIndex = this.data.selectIndex;
    var timeList = this.data.timeList;
    if (selectIndex > -1 && selectIndex < timeList.length) {
      timeList.splice(selectIndex, 1);
      this.setData({
        timeList: timeList,
        selectIndex: -1
      })
    }
  },
  //[msg|切换编辑状态,编辑还是不编辑]
  changeEditState: function () {
    this.setData({
      editState: !(this.data.editState)
    })
  },
  //[msg|将选中的元素置为-1]
  initSelectIndex: function () {
    this.setData({
      selectIndex: -1
    })
  },
  //[msg|用来处理对话框上的完成按钮]
  bindDialog: function (e) {
    var timeList = this.data.timeList;
    var selectIndex = this.data.selectIndex;
    var checkItem = {};
    checkItem.activity = e.detail.value.activity_name;
    checkItem.start_time = this.data.start_time;
    checkItem.end_time = this.data.end_time;
    if (this.checkDialog(checkItem)) {
      var newItem = {
        activity: checkItem.activity,
        timePeriod: checkItem.start_time + '-' + checkItem.end_time
      }
      timeList.splice(selectIndex + 1, 0, newItem);
      this.setData({
        timeList: timeList,
        selectIndex: this.data.selectIndex + 1
      })
      this.hideDialog();
    }
  },
  //[msg|对于对话框的信息进行验证工作]
  checkDialog: function (timeItem) {
    if (timeItem.activity == '') {
      wx.showToast({
        title: '请填写活动名称',
        icon: 'none'
      })
      return false;
    }
    if (!this.compareTimeStr(timeItem.start_time, timeItem.end_time)) {
      wx.showToast({
        title: '活动时间不正确',
        icon: 'none'
      })
      return false;
    }
    return true;
  },
  //[msg|比较开始时间和结束时间]
  compareTimeStr: function (time1, time2) {
    time1 = 60 * Number(time1.split(':')[0]) + Number(time1.split(':')[1]);
    time2 = 60 * Number(time2.split(':')[0]) + Number(time2.split(':')[1]);
    return time1 < time2
  },
  bindStartTimeChange: function (e) {
    this.setData({
      start_time: e.detail.value
    })
  },
  bindEndTimeChange: function (e) {
    this.setData({
      end_time: e.detail.value
    })
  },
  showDialog: function () {
    this.setData({
      dialogState: true
    })
  },
  hideDialog: function () {
    this.setData({
      dialogState: false
    })
  },
})