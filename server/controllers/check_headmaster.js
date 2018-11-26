const qcloud = require('../qcloud')
const { mysql } = qcloud
//[msg|用来判断用户身份的中间件|结果放在ctx.state.check_headmaster中|1是|0不是]
//[warn|若想要使用这个中间件必须在query中携带群id并且携带登陆状态]
module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState === 1) {
    try {
      const data = {};
      data.open_gid = ctx.query.open_gid;
      const { 'x-wx-skey': skey } = ctx.req.headers;//[msg|从请求头拿到skey]
      const sessionInfo = await mysql('cSessionInfo').select('*').where({ skey: skey });//[msg|根据skey从数据库拿到]   
      data.open_id = sessionInfo[0].open_id;
      const inTeacher = await mysql('Teacher').select('*').where(data)
      if (inTeacher.length == 0) {
        ctx.state.check_headmaster = 0;
      } else {
        if(inTeacher[0].is_headmaster==1){
          ctx.state.check_headmaster = 1;
        }else{
          ctx.state.check_headmaster = 0;
        }
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