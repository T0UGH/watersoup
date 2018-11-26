var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
Page({

  data: {
    isHeadMaster: 0//[msg|一个是不是班主任的signal]
  },
  onLoad: function (options) {
    console.log(options);
    this.setData({
      isHeadMaster:Number(options.isHeadMaster)//[msg|一个是不是班主任的signal]
    });
    console.log(this.data);
  },
  //[提交表单]
  formSubmit: function (e) {
    //[msg|一上来先进行表单信息的验证]
    var that=this;
    var checkMsg = this.checkForm(e.detail.value);
    console.log(checkMsg);
    //[msg|如果信息填写不完整，弹出Toast来提示用户]  
    if (checkMsg.passCheck == false) {
      wx.showToast({
        title: checkMsg.warn,
        icon: "none"
      })
    } else {
      if (!that.data.isHeadMaster){
        //[msg|若必要信息都填写且不是班主任初始化流程，则不用弹框，且页面可以发送请求并进行跳转]
        this.requestForm({
          course: e.detail.value.course,
          isHeadMaster: 0,
          open_gid: getApp().globalData.open_gid
        });
      }else{
        //[msg|若必要信息都填写且是班主任初始化流程，则将此报文和初始化班级的报文一起发送]
        wx.navigateTo({
          url: '../init_class/init_class?course=' 
          + e.detail.value.course + '&open_gid=' + getApp().globalData.open_gid
          + '&isHeadMaster='+that.data.isHeadMaster,
        })
      }
    }
  },
  //[msg|用于验证表单信息]
  checkForm:function(formData){
    var that = this;
    var warn = "";//[msg|弹框时提示的内容] 
    var passCheck = false;//[msg|判断信息输入是否完整]   
    if (formData.course == "") {
      warn = "请填写您教授的课程";
    }else if (formData.course.length>4||formData.course.length<2) {
      warn = "课程名称请等于两个汉字";
    } else {
      passCheck = true;
    }
    return {
      passCheck:passCheck,
      warn:warn
    };
  },
  //[msg|用于发送请求的方法]
  requestForm:function(formData){
    console.log(formData);
    var that=this;
    qcloud.request({//[msg|将初始化的数据发送给后台]
      url: config.service.init_teacherUrl,
      login: true,
      data:formData,
      success(result) {//[msg|如果发送成功,则打印信息并根据不同的情况进行跳转]
        console.log('request success', result)
        if(result.data.data.code==-1){
          wx.showToast({
            title: '课程名称冲突,请修改',
            icon: "none"
          })
        }else{
          wx.switchTab({
            url: '../homework/homework',
          })
        }
      },
      fail(error) {
        console.log('request fail', error);
      }
    });
  }, 
})