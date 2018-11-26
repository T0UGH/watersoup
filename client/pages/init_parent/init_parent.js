var app=getApp();
var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var util = require('../../utils/util.js');
Page({

  data: {
    sex: [
      { name: "男", value: "0" },
      { name: "女", value: "1" },
      { name: "其他", value: "2" }
    ],
    txtarray: [],
    student_array: [],
    relationarray: ['父亲', '妈妈', '爷爷', '奶奶', '外公', '外婆', '其他'],
    relation:"父亲",
    student_index:0
  },
  onLoad: function (options) {
    var that=this;
    //[msg|在这里调用app中的方法加载班级名单]
    app.loadStudents().then(res => {
      that.setData({
        student_array: res.students,
      });
      this.init_txtarray();
      console.log(this.data.txtarray);
    }).catch(e => console.log(e));
  },
  init_txtarray:function(){
    var s = this.data.student_array
    var n = []
    for (var i in s) {
      if (s[i] != null) {
        var temp = new String
        temp = s[i].nickname + "     " + s[i].student_id
        n.push(temp)
      }
    }
    this.setData({
      txtarray: n,
    })
  },
  bindRelationPickerChange: function (e) {
    this.setData({
      relation: this.data.relationarray[e.detail.value]
    })
  },
  bindStudentPickerChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      student_index: e.detail.value
    })
  },
  formSubmit: function (e) {
    var data=e.detail.value;
    var warn='';
    var flag=false;
    if(data.sex==''){
      warn="请选择性别"
    }else{
      flag=true;
    } 
    console.log(flag);
    console.log(warn);
    if(flag){
      data.student_id = this.data.student_array[this.data.student_index].student_id;//[msg|不用传这么多东西啊]
      data.relation = this.data.relation;
      data.open_gid=app.globalData.open_gid;
      console.log(data);
      qcloud.request({
        url: config.service.initParentUrl,
        login: true,
        data:data,
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
    }else{
      wx.showToast({
        title: warn,
        icon:"none"
      })
    }
  }
})