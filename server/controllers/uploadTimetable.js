const qcloud = require('../qcloud')
const { mysql } = qcloud
module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState === 1) {
    try {
      const timetable = JSON.stringify(ctx.request.body.timetable);
      const open_gid = ctx.request.body.open_gid;
      await mysql('Wxgroup').where('open_gid', open_gid).update('timetable',timetable);
      ctx.state.code = 0;
    } catch (e) {
      console.log(e);
      ctx.state.code = -1;
    }
  } else {
    ctx.state.code = -1;
  }
}