const qcloud = require('../qcloud')
const { mysql } = qcloud
module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState === 1) {
    try {
      const open_gid = ctx.query.open_gid;
      const temp = ctx.state.check_identity;
      const { 'x-wx-skey': skey } = ctx.req.headers;//[msg|从请求头拿到skey]
      const sessionInfo = await mysql('cSessionInfo').select('*').where({ skey: skey });//[msg|根据skey从数据库拿到]
      const open_id = sessionInfo[0].open_id;//[msg|根据skey拿到sessionkey]
      if(temp==1){
        var data = await mysql('Teacher')
          .innerJoin('cSessionInfo', 'Teacher.open_id', '=', 'cSessionInfo.open_id')
          .select('course', 'user_info')
          .where('Teacher.open_gid', open_gid)
          .andWhere('Teacher.open_id', open_id)
        data.forEach(function (item) {
          var userInfo = JSON.parse(item.user_info);
          item.nickname = userInfo.nickName;
          item.avatarUrl = userInfo.avatarUrl;
          // delete item.user_info;
          delete item.user_info;
        });
      } else if (temp == 0){
        var data = await mysql('Parent')
          .innerJoin('cSessionInfo', 'Parent.open_id', '=', 'cSessionInfo.open_id')
          .innerJoin('Student', 'Parent.student_id', '=', 'Student.student_id')
          .select('nickname','Parent.student_id','relation', 'user_info')
          .where('Parent.open_gid', open_gid)
          .andWhere('Parent.open_id',open_id)
        data.forEach(function (item) {
          var userInfo = JSON.parse(item.user_info);
          item.child_nickname = item.nickname;//查询获得的nickname是孩子的
          item.nickname = userInfo.nickName;
          item.avatarUrl = userInfo.avatarUrl;
          // delete item.user_info;
          delete item.user_info;
        });
      }else{
      }
      ctx.state.data = data;
    } catch (e) {
      console.log(e);
      ctx.state.code = -1;
    }
  } else {
    ctx.state.code = -1;
  }
}