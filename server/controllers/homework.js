const qcloud = require('../qcloud')
const { mysql } = qcloud
module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState === 1) {
    try {
      var whereClause = ctx.query.whereClause;
      whereClause = JSON.parse(whereClause);
      var whereRaw=generateWhere(whereClause);
      const next_index = ctx.query.next_index;
      const { 'x-wx-skey': skey } = ctx.req.headers;//[msg|从请求头拿到skey]
      const sessionInfo = await mysql('cSessionInfo').select('*').where({ skey: skey });//[msg|根据skey从数据库拿到]
      const open_id = sessionInfo[0].open_id;//[msg|根据skey拿到sessionkey]
      var data = await mysql('Homework')
        .innerJoin('cSessionInfo', 'Homework.publisher_id', '=', 'cSessionInfo.open_id')
        .innerJoin('Teacher', function () {
          this.on('Homework.publisher_id', '=', 'Teacher.open_id').andOn('Homework.open_gid', '=', 'Teacher.open_gid')
        })
        .select('content', 'course', 'homework_id', 'img_url', 'is_marked', 'time', 'user_info')
        .whereRaw(whereRaw)
        .orderBy('time', 'desc')
        .limit(5).offset(Number(next_index));
      //[msg|这里需要判断这个用户的身份，如果用户是老师就怎么怎么样,如果用户是家长就怎么怎么样]
      //[msg|这里写个中间件进行判断正好]
      data.forEach(function (item) {
        var userInfo = JSON.parse(item.user_info);
        item.publisher_name = userInfo.nickName;
        item.avatarUrl = userInfo.avatarUrl;
        item.can_mark = open_id == userInfo.openId;
        item.time = new Date(item.time).toLocaleDateString();
        // delete item.user_info;
      });
      //[msg|用来判断用户身份的中间件|结果放在ctx.state.check_identity中|1老师|0家长|2出现异常情况]
      if (ctx.state.check_identity == 1) {
        for (item of data) {
          var userInfo = JSON.parse(item.user_info);
          item.can_mark = open_id == userInfo.openId;
          var avg_time_set = await mysql('Grade')
            .avg('using_time as avg_time').where('homework_id', item.homework_id);
          item.avg_time = avg_time_set[0].avg_time;
          delete item.user_info;
        }
      } else if (ctx.state.check_identity == 0) {
        //[bug|这里不能用data.foreach,详见https://segmentfault.com/q/1010000009190129]
        for (item of data) {
          var in_grade_time = await mysql('Parent')
            .innerJoin('Student', 'Parent.student_id', '=', 'Student.student_id')
            .innerJoin('Grade', 'Student.student_id', '=', 'Grade.student_id')
            .select('using_time', 'level')
            .where('Grade.homework_id', item.homework_id)
            .andWhere('Parent.open_id', open_id);
          item.can_upload_time = in_grade_time.length == 0 || in_grade_time[0].using_time == undefined;//[check]
          item.level = (in_grade_time.length == 0 || in_grade_time[0].level == undefined || in_grade_time[0].level == null) ? -1 : in_grade_time[0].level;
          delete item.user_info;
        }
      } else {
        data.forEach(function (item) {
          delete item.user_info;
        });
      }
      ctx.state.data = {
        homeworks: data,
        state: ctx.state.check_identity
      };
    } catch (e) {
      console.log(e);
      ctx.state.code = -1;
    }
  } else {
    ctx.state.code = -1;
  }
}
function generateWhere(whereClause){
  var whereRaw = 'Homework.open_gid = "' + whereClause.open_gid +'" ';
  if (whereClause.dateMark!=undefined){
    whereRaw += 'and TO_DAYS(time) = TO_DAYS(DATE_SUB(curdate(),INTERVAL '+whereClause.dateMark+' DAY)) ';
  }
  if(whereClause.teacher_open_id!=undefined){
    whereRaw += 'and publisher_id = "' + whereClause.teacher_open_id + '" ';
  }
  if (whereClause.is_marked!=undefined){
    whereRaw += 'and is_marked = ' + !!(whereClause.is_marked) + ' ';
  }
  return whereRaw;
}