const qcloud = require('../qcloud')
const { mysql } = qcloud
module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState === 1) {
    try {
      var data = JSON.parse(ctx.query.data);
      for (item of data) {
        var hasExistSchedule = await mysql('class_schedule')
          .where({
            open_gid: item.open_gid,
            schedule_id: item.schedule_id
          });
        if (hasExistSchedule.length != 0) {//[msg|判断这门课是否已经存在,存在就update，不存在就insert]
          await mysql('class_schedule')
            .update('open_id', item.open_id)
            .where({
              open_gid: item.open_gid,
              schedule_id: item.schedule_id
            });
        } else {
          await mysql('class_schedule').insert(item);
        }
      }
    } catch (e) {
      console.log(e);
      ctx.state.code = -1;
    }
  } else {
    ctx.state.code = -1;
  }
}