const qcloud = require('../qcloud')
const { mysql } = qcloud
function convertTime(str) {
  var strs = str.split(':')
  var time = Number(strs[0] * 60) + Number(strs[1])
  return time;
}
module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState === 1) {
    try {
      const using_time=convertTime(ctx.query.using_time);
      const open_gid=ctx.query.open_gid;
      const homework_id = ctx.query.homework_id
      const { 'x-wx-skey': skey } = ctx.req.headers;//[msg|从请求头拿到skey]
      const sessionInfo = await mysql('cSessionInfo').select('*').where({ skey: skey });//[msg|根据skey从数据库拿到]
      const open_id = sessionInfo[0].open_id;//[msg|根据skey拿到open_id,用户的身份标识符]
      const student=await mysql('Parent').select('student_id').where('open_id',open_id);
      const student_id=student[0].student_id;
      const inGrade=await mysql('Grade').where({
        student_id:student_id,
        homework_id:homework_id
      });
      if(inGrade.length==0){
        await mysql('Grade').insert({
          student_id: student_id,
          homework_id: homework_id,
          using_time:using_time
        });
      }else if(inGrade.length==1&&!inGrade[0].using_time){
        await mysql('Grade').where({
          student_id: student_id,
          homework_id: homework_id
        }).update({ using_time: using_time });
      } 
    } catch (e) {
      console.log(e);
      ctx.state.code = -1;
    }
  } else {
    ctx.state.code = -1;
  }
}