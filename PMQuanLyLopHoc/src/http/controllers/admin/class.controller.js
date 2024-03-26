const {
  Course,
  Class,
  StudentsClass,
  LearningStatus,
  User,
  StudentsAttendance,
  Type,
  Exercise,
} = require("../../../models");
var moment = require("moment");
const { Op } = require("sequelize");
const xlsx = require("node-xlsx").default;
let data;

module.exports = {
  manageClass: async (req, res) => {
    const { page = 1, pageSize = 5, keyword = "" } = req.query;
    const { id } = req.params;
    try {
      const course = await Course.findByPk(id);
      const offset = (page - 1) * pageSize;
      const { count, rows } = await Class.findAndCountAll({
        where: { courseId: id, name: { [Op.substring]: keyword } },
        order: [["id", "ASC"]],
        offset: offset,
        limit: +pageSize,
      });
      data = rows;
      const totalPage = Math.ceil(count / pageSize);

      res.render("admin/class/class", {
        keyword,
        course,
        rows,
        page,
        totalPage,
        pageSize,
        moment,
      });
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  excel: (req, res) => {
    try {
      const dataExport = [
        [
          "Tên",
          "Số buổi học",
          "Ngày bắt đầu",
          "Ngày kết thúc",
          "Lịch học",
          "Thời gian vào học",
        ],
      ];
      data.forEach((row) => {
        dataExport.push([
          row.name,
          row.quantity,
          row.startDate,
          row.endDate,
          row.schedule,
          row.timeLearn,
        ]);
      });
      var buffer = xlsx.build([{ name: "mySheetName", data: dataExport }]);
      res
        .setHeader(
          "Content-Disposition",
          "attachment; filename=ExportClass.xlsx"
        )
        .send(buffer);
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  addClass: async (req, res) => {
    try {
      const { id } = req.params;
      const course = await Course.findByPk(id);
      res.render("admin/class/add-class", { course });
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  handleAddClass: async (req, res) => {
    // calc ngay ket thuc khoa hoc
    try {
      req.body.endDate = moment(req.body.startDate)
        .add(
          {
            weeks: Math.floor(req.body.quantity / req.body.schedule.length),
            days: Math.round(
              ((req.body.quantity / req.body.schedule.length) % 1) * 7
            ),
          },
          "weeks"
        )
        .format("YYYY-MM-DD");
      // change schedule arr to string
      if (Array.isArray(req.body.schedule)) {
        req.body.schedule = req.body.schedule.join(", ");
      }

      /////
      req.body.courseId = req.params.id;
      await Class.create(req.body);
      res.redirect("/admin/course/manage-class/" + req.params.id);
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  updateClass: async (req, res) => {
    try {
      const { id } = req.params;
      let class1 = await Class.findByPk(id);
      res.render("admin/class/update-class", { class1, moment });
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  handleUpdateClass: async (req, res) => {
    try {
      req.body.endDate = moment(req.body.startDate)
        .add(
          {
            weeks: Math.floor(req.body.quantity / req.body.schedule.length),
            days: Math.round(
              ((req.body.quantity / req.body.schedule.length) % 1) * 7
            ),
          },
          "weeks"
        )
        .format("YYYY-MM-DD");
      // change schedule arr to string
      if (Array.isArray(req.body.schedule)) {
        req.body.schedule = req.body.schedule.join(", ");
      }
      await Class.update(req.body, { where: { id: req.params.id } });
      res.redirect("/admin/class/update/" + req.params.id);
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  deleteClass: async (req, res) => {
    const { id } = req.params;
    try {
      await Class.destroy({ where: { id: id } });
      res.redirect("/admin/manage");
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },

  studentDetail: async (req, res) => {
    try {
      const classId = req.params.id;
      const { page = 1, keyword = "", pageSize = 5 } = req.query;
      const offset = (page - 1) * pageSize;
      const classInfo = await Class.findByPk(classId);
      const { count, rows } = await StudentsClass.findAndCountAll({
        order: [["id", "ASC"]],
        offset: offset,
        limit: +pageSize,
        where: { classId: classId },
        include: [
          { model: User, where: { name: { [Op.substring]: keyword } } },
          LearningStatus,
        ],
      });
      data = rows;
      const totalPage = Math.ceil(count / pageSize);

      res.render("admin/class/student-detail", {
        classInfo,
        pageSize,
        rows,
        moment,
        totalPage,
        keyword,
        page,
      });
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  excelStudentDetail: (req, res) => {
    try {
      const dataExport = [
        [
          "Tên",
          "Tình trạng",
          "Ngày hoàn thành",
          "Ngày bảo lưu",
          "Ngày nhập học trở lại",
        ],
      ];
      data.forEach((row) => {
        dataExport.push([
          row.User.name,
          row.LearningStatus.name,
          row.completedDate
            ? moment(row.completedDate).format("DD/MM/YYYY")
            : "Chưa có",
          row.dropDate ? moment(row.dropDate).format("DD/MM/YYYY") : "Chưa có",
          row.recover ? moment(row.recover).format("DD/MM/YYYY") : "Chưa có",
        ]);
      });
      var buffer = xlsx.build([{ name: "mySheetName", data: dataExport }]);
      res
        .setHeader(
          "Content-Disposition",
          "attachment; filename=ExportStudentDetail.xlsx"
        )
        .send(buffer);
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
      res.render("admin/class/update-student-detail", {
        studentDetail,
        learningStatuses,
        moment,
      });
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  handleUpdateStudentDetail: async (req, res) => {
    const classId = req.params.id;
    console.log(req.body);
    res.redirect("/admin/class/manage-student/" + classId);
  },
  addStudentToClass: async (req, res) => {
    const { keyword = "" } = req.query;
    const classID = req.params.id;
    const studentType = await Type.findOne({ where: { name: "student" } });
    const students = await studentType.getUsers({
      where: {
        name: {
          [Op.substring]: keyword,
        },
      },
    });
    res.render("admin/class/add-student", { students, keyword });
  },
  handleAddStudentToClass: async (req, res) => {
    try {
      const classId = req.params.id;
      const classInfo = await Class.findByPk(classId);
      const user = await User.findByPk(req.body.studentId, { include: Type });
      const studentAlreadyInClass = await classInfo.hasStudent(user);
      if (user.Type.name === "student" && !studentAlreadyInClass) {
        await classInfo.addStudent(req.body.studentId);
      }
      res.redirect("/admin/class/manage-student/" + classId + "/add");
    } catch (error) {
      res.render("error");
    }
  },
  deleteStudentClass: async (req, res) => {
    try {
      const classId = req.params.id;
      const classInfo = await Class.findByPk(classId);
      const user = await User.findByPk(req.query.studentId, { include: Type });
      if (user.Type.name === "student") {
        await classInfo.removeStudent(req.query.studentId);
      }
      res.redirect("/admin/class/manage-student/" + classId);
    } catch (error) {
      res.render("error");
    }
  },

  manageTeacher: async (req, res) => {
    const classId = req.params.id;
    try {
      const class1 = await Class.findByPk(classId);
      const teacherClasses = await class1.getTeacher();
      const teachers = await User.findAll({
        include: {
          model: Type,
          where: { name: "teacher" },
        },
      });
      res.render("admin/class/teacher-class", {
        moment,
        class1,
        teachers,
        teacherClasses,
      });
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  addTeacherClass: async (req, res) => {
    try {
      const classId = req.params.id;
      const classInfo = await Class.findByPk(classId);
      const user = await User.findByPk(req.body.teacherId, { include: Type });
      const isTeacherAlreadyInClass = await classInfo.hasTeacher(user);
      if (user.Type.name === "teacher" && !isTeacherAlreadyInClass) {
        await classInfo.addTeacher(req.body.teacherId);
      }
      res.redirect("/admin/class/manage-teacher/" + classId);
    } catch (error) {
      res.render("error");
    }
  },
  deleteTeacherClass: async (req, res) => {
    try {
      const classId = req.params.id;
      const classInfo = await Class.findByPk(classId);
      const user = await User.findByPk(req.body.teacherId, { include: Type });
      if (user.Type.name === "teacher") {
        await classInfo.removeTeacher(req.body.teacherId);
      }
      res.redirect("/admin/class/manage-teacher/" + classId);
    } catch (error) {
      res.render("error");
    }
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
      res.render("admin/class/attendance", {
        classSchedule,
        moment,
        students,
        today,
        attendedList,
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
      res.redirect("/admin/class/attendance/" + classId);
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
};
