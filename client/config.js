/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://336423237.watersoup.club';

var config = {

  // 下面的地址配合云端 Demo 工作
  service: {
    host,

    // 登录地址，用于建立会话
    loginUrl: `${host}/weapp/login`,

    // 测试的请求地址，用于测试会话
    requestUrl: `${host}/weapp/user`,

    // 上传图片接口
    uploadUrl: `${host}/weapp/upload`,

    groupUrl: `${host}/weapp/group`,

    init_classUrl: `${host}/weapp/init_class`,

    init_teacherUrl: `${host}/weapp/init_teacher`,

    publish_homework: `${host}/weapp/publish_homework`,

    homeworkUrl: `${host}/weapp/homework`,

    studentsUrl: `${host}/weapp/students`,

    uploadGradeUrl: `${host}/weapp/upload_grade`,

    initParentUrl: `${host}/weapp/init_parent`,

    uploadTimeUrl: `${host}/weapp/upload_time`,

    my_infoUrl: `${host}/weapp/my_info`,

    allGroupUrl: `${host}/weapp/all_group`,

    uploadClassScheduleUrl: `${host}/weapp/upload_class_schedule`,

    teacherFromGroupUrl: `${host}/weapp/teacher_from_group`,

    timetableUrl: `${host}/weapp/timetable`,

    uploadTimetableUrl: `${host}/weapp/uploadTimetable`,

    classScheduleUrl: `${host}/weapp/class_schedule`,

    deleteClassScheduleUrl: `${host}/weapp/delete_class_schedule`,

    modify_studentUrl: `${host}/weapp/modify_student`
  }
};

module.exports = config;
