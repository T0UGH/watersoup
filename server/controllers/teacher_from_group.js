const qcloud = require('../qcloud')
const { mysql } = qcloud
module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState === 1) {
    try {
      const open_gid = ctx.query.open_gid;
        var data = await mysql('Teacher')
          .innerJoin('cSessionInfo', 'Teacher.open_id', '=', 'cSessionInfo.open_id')
          .select('user_info', 'course', 'Teacher.open_id')
          .where('Teacher.open_gid', open_gid)
        data.forEach(function (item) {
          var userInfo = JSON.parse(item.user_info);
          item.nickname = userInfo.nickName;
          item.avatarUrl=userInfo.avatarUrl;
          delete item.user_info;
        });
      ctx.state.data = data;
    } catch (e) {
      console.log(e);
      ctx.state.code = -1;
    }
  } else {
    ctx.state.code = -1;
  }
}