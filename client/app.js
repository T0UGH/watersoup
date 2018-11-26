import regeneratorRuntime from './utils/regenerator-runtime/runtime-module.js';
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
var util = require('./utils/util.js')

App({
    onLaunch: function (ops) {
      var that=this
        qcloud.setLoginUrl(config.service.loginUrl)
        if (ops.scene == 1044) {
          that.globalData.shareTicket=ops.shareTicket;
        }
    },
    getShareInfo:function(shareTicket){
      var that=this;
      return new Promise((resolve, reject) => {
        wx.getShareInfo({
          shareTicket: shareTicket,
          success:res=>{
            that.globalData.gEncryptedData=res.encryptedData;
            that.globalData.gIv=res.iv;
            console.log(that.globalData);
            resolve()
          },
          fail:()=>reject(new Error("watersoup:getShareInfo fail"))
        })  
      })
    },
    //[msg|异步的用户信息获取验证]
    checkUserInfo: function () {//[fail|这里直接使用async失败了，所以退而求其次]
      return new Promise((resolve, reject) => {
        wx.getUserInfo({
          success: (res) =>{
            console.log(res);
            resolve();
          } ,
          fail: () => reject(new Error("watersoup:not checkUserInfo"))//[msg|注意这里必须返回一个Error对象]
          // [msg|而不是直接打印字符串，如果直接打印字符串返回的就是个字符串]
        })
      })
    },
    //[msg|异步的登陆方法]
    login:function(){
      return new Promise((resolve, reject)=>{
        qcloud.login({
          success:result=>{
            if(result){
              resolve();
            }else{
              qcloud.request({
                url: config.service.requestUrl,
                login: true,
                success:()=>{
                  // util.showSuccess('登录成功');
                  resolve()
                },
                fail:e => {
                  // util.showModel('请求失败', e);
                  console.log('request fail', e);
                  reject(new Error('watersoup:login fail'));
                }
              });
            }
          },
          fail:e=>{
            // util.showModel('请求失败', e);
            console.log('request fail', e);
            reject(new Error('watersoup:login fail'));
          }
        })
      })
    },
    getOpenGid: function () {
      var that = this;
      // util.showBusy('发送群信息中...');
      return new Promise((resolve,reject)=>{
        qcloud.request({
          url: config.service.groupUrl,
          login: false,
          data: {
            encrytedData: that.globalData.gEncryptedData,
            iv: that.globalData.gIv
          },
          success:result=>{
            // util.showSuccess('请求成功完成');
            console.log('request success', result);
            that.globalData.open_gid = result.data.data.openGId;
            console.log(that.globalData.open_gid);
            resolve(result.data.data);
          },
          fail:error=>{
            // util.showModel('请求失败', error);
            console.log('request fail', error);
            reject(new Error('watersoup:getOpenGid fail'));
          }
        });
      });
    },
    //[msg|上传图片的异步方法]
    uploadImg:function(){
      return new Promise((resolve, reject) => {
        wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          success: function (res) {
            // util.showBusy('正在上传')
            var filePath = res.tempFilePaths[0]

            // 上传图片
            wx.uploadFile({
              url: config.service.uploadUrl,//[msg|uploadUrl: `${host}/weapp/upload`]
              filePath: filePath,
              name: 'file',

              success: function (res) {
                // util.showSuccess('上传图片成功')
                console.log(res)
                res = JSON.parse(res.data)
                console.log(res)
                resolve(res.data.imgUrl);
              },

              fail: function (e) {
                // util.showModel('上传图片失败')
                reject(e);
              }
            })

          },
          fail: function (e) {
            console.error(e)
            reject(e)
          }
        })  
    })},
    //[msg|加载班级名单的方法]
    loadStudents: function () {
      var that=this;
      return new Promise((resolve, reject) => {
        qcloud.request({
          url: config.service.studentsUrl,
          login: true,
          data: {
            open_gid: that.globalData.open_gid,
          },
          success(result) {
            console.log(result);
            resolve(result.data.data);
          },
          fail(error) {
            console.log(error);
            reject(error);
          }
        });
      })
    },
    globalData:{},
})