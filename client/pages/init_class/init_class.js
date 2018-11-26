var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var app=getApp();
Page({
  data: {
    emptyArray:[0,],
    add_button: '../../resources/add.png',
    subtract_button: '../../resources/subtract.png',
    headMasterInfo:{}
  },

  onLoad: function (options) {
    console.log("IMPORTANCE")
    console.log(options)
    this.setData({
      headMasterInfo:options
    });
  },
   
  onShareAppMessage: function () {
  
  },
  subStudent: function () {
    var emptyArray = this.data.emptyArray;
    var maxIndex = emptyArray.length - 1;
    delete emptyArray[maxIndex];
    console.log(this.data.emptyArray);
    this.setData({
      emptyArray: emptyArray
    });
    console.log(this.data.emptyArray)
  },
  addStudent: function () {
    var emptyArray = this.data.emptyArray;
    var nextIndex = emptyArray.length;
    emptyArray[nextIndex] = nextIndex;
    this.setData({
      emptyArray: emptyArray
    });
    console.log(this.data.emptyArray);
  },
  formSubmit: function (e) {
    console.log(e.detail.value);
    var that=this;
    var form=e.detail.value;
    var subarr=[];
    var arrindex=0;
    for(let i=0;i<this.data.emptyArray.length;i++){
      if(form[i+'.id']&&form[i+".name"]){
        if (!(/^[0-9]*$/.test(form[i + '.id']))){
          console.log('学号格式不对!')              
          wx.showToast({
            title: '学号格式不对!',
            icon: "none"
          });
          break;  
        }else{
          subarr[arrindex] = {
            student_id: form[i + '.id'],
            nickname: form[i + '.name'],
            sex: form[i + '.sex']
          };
          arrindex++;
        }
      } else if (!form[i + '.id'] && form[i + '.name'] || !form[i + '.name'] && form[i + '.id']){
        console.log('请输入完整的信息!')
        wx.showToast({
          title: '请输入完整的信息!',
          icon: "none"
        })
        break;
      }
    }
    if(this.checkRepeat(subarr)){
      wx.showToast({
        title: '学号重复!',
        icon: "none"
      })
    }else{
      console.log(subarr);
      //[msg|只有通过了前面所有的验证才会与服务器通信]
      qcloud.request({
        url: config.service.init_classUrl,
        login:true,
        method:'POST',
        data:{
          students:subarr,
          open_gid: app.globalData.open_gid
        },
        success(result){
          qcloud.request({//[msg|将初始化的数据发送给后台]
            url: config.service.init_teacherUrl,
            login: true,
            data: that.data.headMasterInfo,
            success(result) {//[msg|如果发送成功,则打印信息并根据不同的情况进行跳转]
              console.log('request success', result)
              //[msg|直接跳到主页]
              wx.switchTab({url: '../homework/homework',})
            },
            fail(error) {
              console.log('request fail', error);
            }
          });
        },
        fail(error){
          console.log('request fail', error);
        }
      });
    }   
  },
  //[msg|验证学号是否重复]
  checkRepeat:function(subarr){
    var check = []
    for (var index in subarr) {
      if (check[subarr[index].student_id]) {
        return true;
      } else {
        check[subarr[index].student_id] = 1;
      }
    }
    return false;
  },
})