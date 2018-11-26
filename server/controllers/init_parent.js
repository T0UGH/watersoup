const qcloud = require('../qcloud')
const { mysql } = qcloud
module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState === 1) {
    try {
      const open_gid = ctx.query.open_gid;
      const relation = ctx.query.relation;
      const student_id = ctx.query.student_id;
      const { 'x-wx-skey': skey } = ctx.req.headers;
      const sessionInfo = await mysql('cSessionInfo').select('*').where({ skey: skey });
      const open_id = sessionInfo[0].open_id;//[msg|为了拿到open_id]
      await mysql('Parent').insert({
        open_id: open_id,
        open_gid: open_gid,
        relation: relation,
        student_id: student_id
      });
    } catch (e) {
      console.log(e);
      ctx.state.code = -1;
    }
  } else {
    ctx.state.code = -1;
  }
}