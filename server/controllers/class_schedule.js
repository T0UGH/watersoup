const qcloud = require('../qcloud')
const { mysql } = qcloud
module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState === 1) {
    try {
      const open_gid = ctx.query.open_gid;
      const { 'x-wx-skey': skey } = ctx.req.headers;//[msg|从请求头拿到skey]
      const sessionInfo = await mysql('cSessionInfo').select('*').where({ skey: skey });//[msg|根据skey从数据库拿到]
      const open_id = sessionInfo[0].open_id;//[msg|根据skey拿到sessionkey]
      var data = await mysql('class_schedule')
        .innerJoin('Teacher', function () {
          this.on('Teacher.open_id', '=', 'class_schedule.open_id').andOn('Teacher.open_gid', '=', 'class_schedule.open_gid')
        })
        .select('schedule_id', 'course', 'Teacher.open_id')
        .where('Teacher.open_gid', open_gid)
      ctx.state.data = {
        data : data,
        is_headmaster: ctx.state.check_headmaster,
      };
    } catch (e) {
      console.log(e);
      ctx.state.code = -1;
    }
  } else {
    ctx.state.code = -1;
  }
}