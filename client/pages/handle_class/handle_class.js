// pages/handle_class/handle_class.js
var app = getApp();
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_headmaster:false,
    editState: false,//[msg|判断当前是否为编辑状态]
    dialogState: false,//[msg|判断当前是否显示对话框状态]
    students:[],
    selectIndex: -1,//[msg|当前选中元素的索引,没有选中就是-1]
    student_id: '',
    student_name: '',
    student_sex: '',
    insertState: false,//[msg|当前是否为插入状态,控制学号是否可编辑]
  },

  onShow() {
    this.init_Students();
    this.load_Students();
  },
  init_Students:function(){
    this.setData({
      students:[]
    })
  },
      //[msg|在这里调用app中的方法加载班级名单]
  load_Students:function(){
    var that = this;
    app.loadStudents().then(res => {
      that.setData({
        students: res.students,
        is_headmaster: res.check_headmaster
      });
      console.log(that.data.students);
    }).catch(e => console.log(e));
  },

  //[msg|编辑按钮的事件监听器]
  bindEditButton: function () {
    this.changeEditState();//[msg|切换状态]
    this.initSelectIndex();//[msg|]
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
    this.setData({
      student_id: '',
      student_name: '',
      student_sex: '',
      insertState: true,
    })
    this.showDialog();
  },

  //[msg|用来处理对话框上的完成按钮]
  bindDialog: function (e) {
    var that=this;
    this.init_Students();
    console.log(e);
    var selectIndex = this.data.selectIndex;
    var checkItem = {};
    checkItem.sex = e.detail.value.student_sex;
    checkItem.student_id = e.detail.value.student_id;
    checkItem.nickname = e.detail.value.student_name;
    console.log(checkItem);
    if (this.checkDialog(checkItem)) {
      var newItem = {
        nickname: checkItem.nickname,
        student_id: checkItem.student_id,
        sex: checkItem.sex,
      }
      var subarr = [];
      subarr[0] = { student_id: checkItem.student_id, nickname: checkItem.nickname, sex: checkItem.sex, open_gid: app.globalData.open_gid};
      qcloud.request({
        url: config.service.modify_studentUrl,
        login: true,
        method: 'POST',
        data: {
          students: subarr,
          open_gid: app.globalData.open_gid
        },
        success:function(res){
          that.load_Students();
        },
        fail:function(err){
          console.log(err);
        }
      }),
      this.setData({
        selectIndex: -1,
        student_id: '',
        student_name: '',
        student_sex: '',
      })
      this.hideDialog();
    }
  },

  //[msg|对于对话框的信息进行验证工作]
  checkDialog: function (checkItem) {
    if (!this.checkRepeat(checkItem)){
      return true;
    }
    return false;
  },

  //[msg|验证学号是否重复]
  checkRepeat: function (checkItem) {
    var old_students=[];
    old_students=this.data.students;
    console.log(this.data.student_id);
    for(var i=0;i<old_students.length;i++){
      if (old_students[i].student_id == checkItem.student_id) {
        wx.showToast({
          title: '学号重复!',
          icon: "none"
        })
        return true;
      }
    }
    return false;
  },
  

  //[msg|点击修改按钮,做点事情]
  bindModify: function () {
    var students = this.data.students;
    var selectIndex = this.data.selectIndex;
    if (selectIndex != -1) {
      var student_id = students[selectIndex].student_id;
      var sex = students[selectIndex].sex;
      var nickname = students[selectIndex].nickname;
      this.setData({
        student_id: student_id,
        student_name: nickname,
        student_sex: sex,
        insertState: false,
      });
      this.showDialog();
    }
  },
  //[msg|显示对话框]
  showDialog: function () {
    this.setData({
      dialogState: true
    })
  },
 //[msg|隐藏对话框]
  hideDialog: function () {
    this.setData({
      dialogState: false
    })
  },
})