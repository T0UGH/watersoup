const qcloud = require('../qcloud')
const { mysql } = qcloud
//[msg|用来判断用户身份的中间件|结果放在ctx.state.check_identity中|1老师|0家长|2出现异常情况]
//[warn|若想要使用这个中间件必须在query中携带群id并且携带登陆状态]
module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState === 1) {
    try {
      const data = {};
      data.open_gid = ctx.query.open_gid;
      const { 'x-wx-skey': skey } = ctx.req.headers;//[msg|从请求头拿到skey]
      const sessionInfo = await mysql('cSessionInfo').select('*').where({ skey: skey });//[msg|根据skey从数据库拿到]   
      data.open_id = sessionInfo[0].open_id;
      const [inTeacher, inParent] = await Promise.all([
        mysql('Teacher').select('*').where(data),
        mysql('Parent').select('*').where(data)
      ])
      if(inTeacher.length!=0){
        ctx.state.check_identity=1;
      }else if(inParent.length!=0){
        ctx.state.check_identity=0;
      }else{
        ctx.state.check_identity=2;
      }
      await next();
    } catch (e) {
      console.log(e);
      ctx.state.code = -1;
    }
  } else {
    ctx.state.code = -1;
  }
}