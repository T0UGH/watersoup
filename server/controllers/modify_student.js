const qcloud = require('../qcloud')
const { mysql } = qcloud
module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState === 1) {
    try {
      const student = ctx.request.body.students[0];
      const inStudent = await mysql('Student').where({
          student_id: student.student_id,
        });
      if (inStudent.length == 0) {
        await mysql('Student').insert(student);
      } else {
        await mysql('Student').where({
            student_id: student.student_id,
          }).update({ nickname: student.nickname,sex:student.sex });
        }
    } catch (e) {
      console.log(e);
      ctx.state.code = -1;
    }
  } else {
    ctx.state.code = -1;
  }
}