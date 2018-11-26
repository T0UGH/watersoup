import regeneratorRuntime from '../../utils/regenerator-runtime/runtime-module.js';
var app=getApp()
Page({
  data: {
    progress: 0,
    prompt:'加载中...'
  },
    onLoad:function(options){
      this.doLoad()
    },
  //[msg|用于处理整个流程]
    doLoad:async function(){
      try{
        console.log(app.globalData);
        var user=await app.checkUserInfo();
        console.log("授权过了");
        this.setProgressMax(30);
        await app.login();
        console.log("登陆成功");
        console.log(app.globalData);
        var shareTicket = app.globalData.shareTicket;
        if(!shareTicket){//[msg|如果不是从群来的，则跳到分享页面]
          this.setProgressMax();
          await wx.redirectTo({
            url: '../share/share',
          })//[msg|这里后续怎么处理呢，反正不管怎么处理也是到share.js里去处理了]
        }else{
          await app.getShareInfo(shareTicket);//[msg|获得shareInfo来去后台换取openGid]
          var data=await app.getOpenGid();
          var isnew = data.isnew;//[msg|获得这个群的openGid|并且检测是不是新来的]
          var has_init_group=data.has_init_group;//[msg|一个标识这个群是否初始化过的标志]
          console.log("has_init_group is :", has_init_group);
          if (!has_init_group||isnew){
            await wx.redirectTo({
              url: '../init_role/init_role?has_init_group='+Number(has_init_group),
            });
          }else{
            await wx.switchTab({
              url: '../homework/homework',
            });
          }
        }
      }catch(e){
        if ("watersoup:not checkUserInfo"==e.message){
          console.log("没有授权");
          await wx.redirectTo({
            url: '../get_auth/get_auth',
          });
        } else if ("watersoup:login fail" == e.message){
          console.log("登陆失败");
          this.setPrompt("登陆失败");
        } else if ("watersoup:getShareInfo fail" == e.message){
          console.log("获得shareInfo失败");
          this.setPrompt("获得分享信息失败");
        } else if ("watersoup:getOpenGid fail" == e.message) {
          console.log("获得OpenGid失败");
          this.setPrompt("获得群信息失败");
        }else{
          console.log("未知错误发生")
          this.setPrompt("发生未知错误");
          console.log(e)
        }
      }
    },
    //[msg|增加进度条的值]
    addProgress: function (addent) {
      var oldProgress = Number(this.data.progress);
      var newProgress = oldProgress + Number(addent);
      newProgress = newProgress > 100 ? 100 : newProgress;
      this.setData({
        progress: newProgress
      });
    },
    //[msg|将进度条设置为最大值]
    setProgressMax: function () {
      this.setData({
        progress: 100
      });
    },
    //[msg|设置提示语]
    setPrompt: function (prompt) {
      this.setData({
        prompt: prompt
      });
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