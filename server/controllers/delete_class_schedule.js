const qcloud = require('../qcloud')
const { mysql } = qcloud
module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState === 1) {
    try {
      var data = JSON.parse(ctx.query.data);
          await mysql('class_schedule')
          .where({
            open_gid: data.open_gid,
            schedule_id: data.schedule_id
          })
          .del();
    } catch (e) {
      console.log(e);
      ctx.state.code = -1;
    }
  } else {
    ctx.state.code = -1;
  }
}