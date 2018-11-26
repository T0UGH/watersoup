const qcloud = require('../qcloud')
const { mysql } = qcloud
//[msg|未批改-1|优0|良1|及格2|差3|未交4]
module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState === 1) {
    try {
      const grades = ctx.request.body.data;
      for(var item of grades){
        const inGrade = await mysql('Grade').where({
          student_id: item.student_id,
          homework_id: item.homework_id
        });
        if (inGrade.length == 0) {
          await mysql('Grade').insert(item);
        } else if (inGrade.length == 1 && !inGrade[0].level) {
          await mysql('Grade').where({
            student_id: item.student_id,
            homework_id: item.homework_id
          }).update({ level: item.level });
        }
      }
      await mysql('Homework').where({ homework_id: grades[0].homework_id }).update({ is_marked: true });
    } catch (e) {
      console.log(e);
      ctx.state.code = -1;
    }
  } else {
    ctx.state.code = -1;
  }
}