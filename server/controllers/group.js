var WXBizDataCrypt = require('./WXBizDataCrypt');
const qcloud = require('../qcloud');
const { mysql } = qcloud;
module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState === 1) {
    // loginState 为 1，登录态校验成功
    try{
      const appInfo = await mysql('cAppinfo').select('*');//[msg|从数据库取得appInfo对象]
      const appId=appInfo[0].appid;//[msg|从appInfo上拿到appId的值]
      const { 'x-wx-skey': skey } = ctx.req.headers;//[msg|从请求头拿到skey]
      const sessionInfo = await mysql('cSessionInfo').select('*').where({ skey: skey });//[msg|根据skey从数据库拿到]
      const sessionKey = sessionInfo[0].session_key;//[msg|根据skey拿到sessionkey]
      const encryptedData = ctx.query.encrytedData;//[msg|从query中拿到encryedData]
      const iv = ctx.query.iv;//[msg|从query中拿到iv]
      const pc = new WXBizDataCrypt(appId, sessionKey);//[msg|初始化并调用解码器来解码]
      const data = pc.decryptData(encryptedData, iv);
      const groupObj = { open_gid: data.openGId};
      const inWxGroup=await mysql('Wxgroup').select('*').where(groupObj);//[msg|看看openGid是否存在]//[msg|结果是空数组]
      const hasIn=inWxGroup.length!=0;//[msg|用来判断这个群是否已经存在在wxGroup表中]
      var has_init_group=hasIn?!!(inWxGroup[0].has_init):false;//[msg|用来判断这个群是否初始化过]
      var isnew=true;//[msg|是否是新人的标志]
      if(!hasIn){//[msg|此时需要将在wxgroup]
        await mysql('Wxgroup').insert(groupObj);
      } else {//[msg|此时需要判断]
        groupObj.open_id = sessionInfo[0].open_id;
        const [inTeacher, inParent] = await Promise.all([
          mysql('Teacher').select('*').where(groupObj),
          mysql('Parent').select('*').where(groupObj)
        ])
        isnew =inTeacher.length==0&&inParent.length==0;//[msg|如果是新人则在两张表中都找不到]
        //[think|这里已经可以得出用户的身份了,需不需要告诉用户一声???]
      }
      data.isnew=isnew;//[msg|将是不是新人的结果放到数组中][msg|如果已经在群里面并且初始化了身份,那么就不是新的了]
      data.has_init_group = has_init_group;//[msg|将群是否初始化的信息发送给前端]
      ctx.state.data = data;//[msg|将得到的数据放到请求体中用于发给前端]
    }catch(e){
      ctx.state.code = -1;
    }
  } else {
    ctx.state.code = -1;
  }
}