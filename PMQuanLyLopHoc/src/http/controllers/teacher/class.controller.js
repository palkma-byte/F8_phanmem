const {
  Class,
  User,
  LearningStatus,
  StudentsClass,
  StudentsAttendance,
} = require("../../../models");
var moment = require("moment");
module.exports = {
  home: (req, res) => {
    res.render("teacher/home", { layout: "layout/teacher.layout.ejs" });
  },
  class: async (req, res) => {
    const user = await User.findByPk(req.user.id);
    const classes = await user.getClasses();
    res.render("teacher/class/class", {
      classes,
      moment,
      layout: "layout/teacher.layout.ejs",
    });
  },
  studentDetail: async (req, res) => {
    try {
      const classId = req.params.id;
      const classInfo = await Class.findByPk(classId);
      const studentDetail = await StudentsClass.findAll({
        where: { classId: classId },
        include: [User, LearningStatus],
      });

      res.render("teacher/class/student-detail", {
        classInfo,
        studentDetail,
        moment,
        layout: "layout/teacher.layout.ejs",
      });
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  updateStudentDetail: async (req, res) => {
    try {
      const studentId = req.query.studentId;
      const classId = req.params.id;
      const studentDetail = await StudentsClass.findOne({
        where: { studentId: studentId, classId: classId },
        include: [User, LearningStatus],
      });
      const learningStatuses = await LearningStatus.findAll();
      res.render("teacher/class/update-student-detail", {
        studentDetail,
        learningStatuses,
        moment,
        layout: "layout/teacher.layout.ejs",
      });
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  handleUpdateStudentDetail: async (req, res) => {
    const classId = req.params.id;
    const user = await User.findOne({ where: { name: req.body.studentName } });
    const { learningStatus, completedDate, dropDate, recoverDate } = req.body;
    const validateAndFormatDate = (dateString) => {
      return !isNaN(new Date(dateString).getTime()) ? dateString : null;
    };

    const formattedCompletedDate = validateAndFormatDate(completedDate);
    const formattedDropDate = validateAndFormatDate(dropDate);
    const formattedRecoverDate = validateAndFormatDate(recoverDate);
    await StudentsClass.update(
      {
        statusId: learningStatus,
        completedDate: formattedCompletedDate,
        dropDate: formattedDropDate,
        recover: formattedRecoverDate,
      },
      {
        where: { studentId: user.id, classId: classId },
      }
    );
    console.log(req.body);
    res.redirect("/teacher/class/manage-student/" + classId);
  },
  checkAttendance: async (req, res) => {
    let classSchedule = [];
    const classId = req.params.id;
    try {
      const attendedList = await StudentsAttendance.findAll({
        where: { classId: classId, status: 1 },
      });
      const classValue = await Class.findByPk(classId);
      const students = await classValue.getStudent();
      classValue.schedule.split(", ").forEach((weekdays) => {
        function getWeekdaysInRange(startDate, endDate, dayOfWeek) {
          var weekdays = [];
          var currentDate = new Date(startDate);
          var startDate = new Date(startDate);
          var endDate = new Date(endDate);

          // Convert weekday to JavaScript's day numbering (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
          var targetWeekday; // Adjusting to match JavaScript's day numbering
          switch (dayOfWeek) {
            case "Sunday":
              targetWeekday = 0;
              break;
            case "Monday":
              targetWeekday = 1;
              break;
            case "Tuesday":
              targetWeekday = 2;
              break;
            case "Wednesday":
              targetWeekday = 3;
              break;
            case "Thursday":
              targetWeekday = 4;
              break;
            case "Friday":
              targetWeekday = 5;
              break;
            case "Saturday":
              targetWeekday = 6;
              break;
          }

          // Iterate through each day within the range
          while (currentDate <= endDate) {
            // Check if the current day matches the target weekday
            if (currentDate.getDay() === targetWeekday) {
              // If it's the target weekday, add it to the array
              weekdays.push(new Date(currentDate));
            }
            // Move to the next day
            currentDate.setDate(currentDate.getDate() + 1);
          }
          return weekdays;
        }

        classSchedule.push(
          ...getWeekdaysInRange(
            classValue.startDate,
            classValue.endDate,
            weekdays
          )
        );
      });
      const today = new Date();
      classSchedule.sort((date1, date2) => date1 - date2);
      console.log(attendedList);
      res.render("teacher/class/attendance", {
        classSchedule,
        moment,
        students,
        today,
        attendedList,
        layout: "layout/teacher.layout.ejs",
      });
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  saveCheckAttendance: async (req, res) => {
    try {
      const classId = req.params.id;
      Object.keys(req.body).forEach(async (data) => {
        const [attendance, created] = await StudentsAttendance.findOrCreate({
          where: {
            dateLearning: JSON.parse(data).date,
            studentId: JSON.parse(data).studentId,
            classId: classId,
          },
          defaults: {
            dateLearning: JSON.parse(data).date,
            studentId: JSON.parse(data).studentId,
            classId: classId,
            status: 1,
          },
        });
      });
      res.redirect("/teacher/class/attendance/" + classId);
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
};
