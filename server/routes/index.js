/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口
router.get('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态）
router.get('/user', validationMiddleware, controllers.user)

// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中
router.post('/upload', controllers.upload)
//查看群组信息
router.get('/group', validationMiddleware,controllers.group)//[msg|这里填写路由,和转发给谁进行处理]
router.post('/init_class',validationMiddleware,controllers.init_class)//[msg|用来处理初始化班级的信息]
router.get('/init_teacher', validationMiddleware, controllers.init_teacher)//[msg|用来处理初始化班级的信息]
router.get('/publish_homework', validationMiddleware, controllers.publish_homework)//[msg|用来处理发布作业]
router.get('/homework', validationMiddleware, controllers.check_identity,controllers.homework)//[msg|用来处理查看作业请求]//[msg|使用了检测用户身份的中间件]
router.get('/students', validationMiddleware, controllers.check_headmaster,controllers.students)//[msg|用于处理查看班级名单]
router.post('/upload_grade', validationMiddleware, controllers.upload_grade)
router.get('/init_parent', validationMiddleware, controllers.init_parent)
router.get('/upload_time', validationMiddleware, controllers.upload_time)
router.get('/my_info', validationMiddleware, controllers.check_identity, controllers.my_info)
router.get('/all_group', validationMiddleware,  controllers.all_group)
router.get('/teacher_from_group', validationMiddleware, controllers.teacher_from_group)
router.get('/upload_class_schedule', validationMiddleware, controllers.upload_class_schedule)
router.get('/timetable', validationMiddleware, controllers.check_headmaster, controllers.timetable)
router.post('/uploadTimetable', validationMiddleware,controllers.uploadTimetable)
router.get('/class_schedule', validationMiddleware, controllers.check_headmaster, controllers.class_schedule)
router.get('/delete_class_schedule', validationMiddleware,controllers.delete_class_schedule)
router.post('/modify_student', validationMiddleware, controllers.modify_student)
module.exports = router