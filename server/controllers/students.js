const qcloud = require('../qcloud')
const { mysql } = qcloud
module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState === 1) {
    try {
      const open_gid = ctx.query.open_gid;
      var data = await mysql('Student').select('student_id', 'nickname','sex').where('open_gid', open_gid)
      ctx.state.data = {
        students:data,
        check_headmaster:ctx.state.check_headmaster
      }
    } catch (e) {
      console.log(e);
      ctx.state.code = -1;
    }
  } else {
    ctx.state.code = -1;
  }
}