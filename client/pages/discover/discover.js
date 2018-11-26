Page({
  data: {
    scheduleImg: '../../resources/classSchedule.jpg',
    calendarImg: '../../resources/calendar.jpg',
    studentListImg: '../../resources/studentList.jpg',
  },
  onLoad: function (options) {

  },
  bindClassSchedule:function(){
    wx.navigateTo({
      url: '../class_schedule/class_schedule',
    })
  },
  bindClassList:function(){
    wx.navigateTo({
      url: '../handle_class/handle_class',
    })
  },
  bindTimeTable:function(){
    wx.navigateTo({
      url: '../timetable/timetable',
    })
  }
})