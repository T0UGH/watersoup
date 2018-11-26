const qcloud = require('../qcloud')
const { mysql } = qcloud
module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState === 1) {
    const students = ctx.request.body.students;
    const open_gid = ctx.request.body.open_gid;
    for(let i=0;i<students.length;i++){
      students[i].open_gid=open_gid;
    }
    try{
      await mysql('Student').insert(students);
      await mysql('Wxgroup').where({ open_gid: open_gid }).update({has_init: true});
    }catch(e){
      console.log(e);
      ctx.state.code = -1;  
    }
  }else{
    ctx.state.code = -1;
  }
}