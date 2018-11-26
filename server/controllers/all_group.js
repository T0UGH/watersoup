const qcloud = require('../qcloud')
const { mysql } = qcloud
module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState === 1) {
    try {
      const { 'x-wx-skey': skey } = ctx.req.headers;//[msg|从请求头拿到skey]
      const sessionInfo = await mysql('cSessionInfo').select('*').where({ skey: skey });//[msg|根据skey从数据库拿到]
      const open_id = sessionInfo[0].open_id;//[msg|根据skey拿到sessionkey]
      var open_gid_teacher=await mysql('Teacher').select('open_gid').where({open_id:open_id});
      var open_gid_parent = await mysql('Parent').select('open_gid').where({ open_id: open_id });
      open_gid_teacher.forEach(function (item) {
        item.identity='老师'
      })
      open_gid_parent.forEach(function (item) {
        item.identity = '家长'
      })
      var open_gids = open_gid_parent.concat(open_gid_teacher);
      ctx.state.data=open_gids;
    } catch (e) {
      console.log(e);
      ctx.state.code = -1;
    }
  } else {
    ctx.state.code = -1;
  }
}