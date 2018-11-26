var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var app=getApp();
Page({
  data: {
    selectorState: false,//[msg|控制mask的出现和隐藏]
    state:-1,//[msg|0家长&&1老师]
    homework: [],
    next_index:0,
    can_reach:true,
    down_img: '../../resources/homework_select_down.png',
    up_img: '../../resources/homework_select_up.png',   
    listIndex: -1,//[msg|-1:false|0:markStateList|1:teacherStateList|2:dateStateList]
    markStateList: [{
      mark_id: 0,
      mark_name: '全部状态'
    }, {
      mark_id: 1,
      mark_name: '尚未批改'
    }, {
      mark_id: 2,
      mark_name: '已经批改'
    },],
    markStateIndex: 0,
    teacherStateList: [{
      teacher_id: 0,
      teacher_name: '全部教师'
    }],
    teacherStateIndex: 0,
    dateStateList: [{
      date_id: 0,
      date_name: '全部日期'
    }, {
      date_id: 1,
      date_name: '只看今天'
    }, {
      date_id: 2,
      date_name: '只看昨天'
    }],
    dateStateIndex: 0, 
  },
  onPullDownRefresh:function(){
    this.initHomework();
    this.loadHomework();
  },
  onLoad:function(){
    this.loadTeacherStateList()
  },
  //[msg|为了实现实时性]
  onShow: function () {
    console.log("onLoad调用了:", this.data);
    this.loadHomework();
  },
  //[msg|销毁所有homework]
  //[think|这种实现不太好]
  onHide:function(){
    console.log("onHide调用了:",this.data);
    this.initHomework();
  },
  initHomework:function(){
    this.setData({
      homework: [],
      next_index: 0,
      can_reach: true
    });
  },
  //[msg|下拉到头以加载更多]
  onReachBottom: function () {
    this.loadHomework();
  },
  //[msg|根据几个标记来生成查询条件体]
  generateWhereClause:function(){
    var whereClause={};
    whereClause.open_gid = app.globalData.open_gid;
    if (this.data.dateStateIndex!=0){
      whereClause.dateMark = this.data.dateStateIndex-1
    }
    if(this.data.markStateIndex!=0){
      whereClause.is_marked = this.data.markStateIndex-1//[msg|未批改为0，已批改为1]
    }
    if(this.data.teacherStateIndex!=0){
      whereClause.teacher_open_id = this.data.teacherStateList[this.data.teacherStateIndex].open_id
    }
    return whereClause;
  },
  //[msg|加载作业的函数:每次请求5条作业]
  loadHomework:function(){
    var that = this;
    if(!this.data.can_reach){//[msg|如果已经标记为不可达则不会继续请求]
      return;
    }
    var whereClause = this.generateWhereClause();
    qcloud.request({
      url: config.service.homeworkUrl,
      login: true,
      data: {
        whereClause:whereClause,
        open_gid: app.globalData.open_gid,//[msg|这个是中间件用的]
        next_index: this.data.next_index
      },
      success(result) {
        //[msg|如果请求成功的话，就将请求得到的数据拼接到homework数组的后面]
        console.log('request success', result);
        var homework = that.data.homework;
        var newDataLength = result.data.data.homeworks.length;//[msg|判断新来的数据长度是几]
        homework = homework.concat(result.data.data.homeworks);//[msg|数组拼接操作]
        var can_reach=newDataLength==5//[msg|判断是否可以继续刷新]
        if(that.data.state==-1){
          app.globalData.state = result.data.data.state;
          that.setData({
            state: result.data.data.state
          });
        }
        that.setData({
          next_index: that.data.next_index + newDataLength,
          homework: homework,
          can_reach:can_reach,
          state:result.data.data.state
        });
      },
      fail(error) {
        //[msg|如果失败，就GG]
        console.log('request fail', error);
      }
    });
  },
  loadTeacherStateList:function(){
    var that=this;
    qcloud.request({
      url: config.service.teacherFromGroupUrl,
      login: true,
      data: {
        open_gid: app.globalData.open_gid,//[msg|这个是中间件用的]
      },
      success(result) {
        console.log(result);
        that.generateTeacherStateList(result.data.data);
      },
      fail(error) {
        console.log(err);
      }
    });
  },
  generateTeacherStateList:function(data){
    var teacherStateList=this.data.teacherStateList;
    data.forEach(function(item,index){
      item.teacher_name="只看"+item.course;
      item.teacher_id =index+1;
      teacherStateList.splice(teacherStateList.length, 0, item);
    })
    this.setData({
      teacherStateList: teacherStateList
    });
  },
  //[msg|老师点击加号时触发,跳转到发布作业页面]
  doAddButton:function(e){
    wx.navigateTo({
      url: '../publish_homework/publish_homework',
    });
  },
  //[msg|老师点击上传成绩时触发,跳转到上传成绩页面]
  doUploadGrade:function(e){
    var homework_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../upload_grade/upload_grade?homework_id='+homework_id,
    })
  },
  //[msg|家长点击上传时间时触发,跳转到上传时间页面]
  doUploadTime: function (e) {
    var homework_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../upload_time/upload_time?homework_id=' + homework_id,
    })
  },
  //[msg|点击图片触发预览图片]
  previewImage: function (e) {
    var current = e.target.dataset.src;
    var temp = [];
    temp.push(e.target.dataset.src),
      wx.previewImage({
        current: current, // 当前显示图片的http链接
        urls: temp
        // 需要预览的图片http链接列表  
      })
  },
  //[msg|点击上端的三个按钮中的一个时触发]
  bindSelectItem: function (e) {
    console.log(e)
    if (this.data.listIndex == -1) {
      this.switch_listIndex(e.currentTarget.dataset.listindex);
    } else {
      this.switch_listIndex();
    }
    this.switch_selector();
  },
  //[msg|点击以选择对应的mark]
  doSelectMark: function (e) {
    this.setData({
      markStateIndex: e.currentTarget.dataset.id,
    })
    this.switch_listIndex();
    this.switch_selector();
    this.initHomework();
    this.loadHomework();
  },
  //[msg|点击以选择对应的teacher]
  doSelectTeacher: function (e) {
    this.setData({
      teacherStateIndex: e.currentTarget.dataset.id,
    })
    this.switch_listIndex();
    this.switch_selector();
    this.initHomework();
    this.loadHomework();
  },
  //[msg|点击以选择对应的date]
  doSelectDate: function (e) {
    this.setData({
      dateStateIndex: e.currentTarget.dataset.id,
    })
    this.switch_listIndex();
    this.switch_selector();
    this.initHomework();
    this.loadHomework();
  },
  //[msg|切换当前选中的list的状态]
  switch_listIndex: function (index) {
    index = index || -1
    this.setData({
      listIndex: index
    })
  },
  //[msg|切换是否显示mask]
  switch_selector: function () {
    this.setData({
      selectorState: !(this.data.selectorState),
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