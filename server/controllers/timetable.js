const qcloud = require('../qcloud')
const { mysql } = qcloud
module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState === 1) {
    try {
      const open_gid = ctx.query.open_gid;
      var data=await mysql('Wxgroup').where('open_gid',open_gid).select('timetable');
      var timetable=data[0].timetable;
      if(timetable!=''){
        timetable=JSON.parse(timetable);
      }else{
        timetable=[];
      }
      ctx.state.data={
        timetable:timetable,
        is_headmaster: ctx.state.check_headmaster
      }
    } catch (e) {
      console.log(e);
      ctx.state.code = -1;
    }
  } else {
    ctx.state.code = -1;
  }
}