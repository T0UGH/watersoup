// 登录授权接口
const qcloud = require('../qcloud')
const { mysql } = qcloud
module.exports = async (ctx, next) => {
    // 通过 Koa 中间件进行登录之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
    if (ctx.state.$wxInfo.loginState) {
        ctx.state.data = ctx.state.$wxInfo.userinfo
        // var theOpenId = ctx.state.$wxInfo.userinfo.userinfo.openId
        // var theNickName = ctx.state.$wxInfo.userinfo.userinfo.nickName
        // console.log(theOpenId)
        // console.log(theNickName)
        // var user = {
        //   openId: theOpenId,
        //   nickName: theNickName,
        // }
        // var res = await mysql('user').where({openId:user.openId})
        // try{
        //   await mysql('user').insert(user)
        // }catch(e){
        //   console.log(e)
        // }
        // ctx.state.data=user
        ctx.state.data['time'] = Math.floor(Date.now() / 1000)
    }
}
