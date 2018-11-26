const qcloud = require('../qcloud')
const { mysql } = qcloud
module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState === 1) {
    try{
      const data = ctx.query;//[msg|获得http请求中携带的query字段]
      const { 'x-wx-skey': skey } = ctx.req.headers;//[msg|从请求头拿到skey]
      const sessionInfo = await mysql('cSessionInfo').select('*').where({ skey: skey });//[msg|根据skey从数据库拿到]
      data.publisher_id = sessionInfo[0].open_id;//[msg|根据skey拿到open_id,用户的身份标识符]
      data.time=new Date(data.time);//[msg|将时间进行类型转换以入库,否则报错,不得不改]
      delete data.is_homework;//[msg|通过delete的方式将这个没用的标记删掉]
      await mysql('Homework').insert(data);
    }catch(e){
      console.log(e)
      ctx.state.code = -1;
    }
  } else {
    ctx.state.code = -1;
  }
}