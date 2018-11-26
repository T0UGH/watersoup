const qcloud = require('../qcloud')
const { mysql } = qcloud
module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState === 1) { 
    try {
      const tel = ctx.query.tel;
      const open_gid = ctx.query.open_gid;
      const course = ctx.query.course;
      const isHeadMaster = !!(Number(ctx.query.isHeadMaster));
      const { 'x-wx-skey': skey } = ctx.req.headers;
      const sessionInfo = await mysql('cSessionInfo').select('*').where({ skey: skey });
      const open_id = sessionInfo[0].open_id;//[msg|为了拿到open_id]
      var hasExistCourse=await mysql('Teacher').where({
        open_gid:open_gid,
        course:course
      })
      if(hasExistCourse.length!=0){
        //[msg|表示已经存在了,前端应该提醒用户换个名字]
        ctx.state.data={
          code:-1
        }
      }else{
        await mysql('Teacher').insert({
          open_id: open_id,
          open_gid: open_gid,
          course: course,
          is_headmaster: isHeadMaster
        });
        ctx.state.data = {
          code: 0
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