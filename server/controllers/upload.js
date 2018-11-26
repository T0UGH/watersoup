const { uploader } = require('../qcloud')
const qcloud = require('../qcloud')
const { mysql } = qcloud
module.exports = async ctx => {
    try{
      const data = await uploader(ctx.req);//[msg|这里直接调用qcloud的uploadr接口 完成图片的上传并返回了data]
      const dt = data;
      ctx.state.data = data
    }catch(e){
      console.log(e);
      ctx.state.code = -1;
    }
}

