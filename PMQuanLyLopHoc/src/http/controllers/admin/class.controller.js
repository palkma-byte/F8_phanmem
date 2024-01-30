const {
  Course,
  Class,
  StudentsClass,
  LearningStatus,
  User,
} = require("../../../models");
var moment = require("moment");

module.exports = {
  manageClass: async (req, res) => {
    const { page = 1, pageSize = 5 } = req.query;
    const { id } = req.params;
    try {
      const course = await Course.findByPk(id);
      const offset = (page - 1) * pageSize;
      const { count, rows } = await Class.findAndCountAll({
        where: { courseId: id },
        order: [["id", "ASC"]],
        offset: offset,
        limit: +pageSize,
      });
      data = rows;
      const totalPage = Math.ceil(count / pageSize);

      res.render("admin/class/class", {
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
  manageStudent: async (req, res) => {
    const classId = req.params.id;
    try {
      const class1 = await Class.findByPk(classId);
      const students = await class1.getStudent();
      res.render("admin/class/student-class", { moment, class1, students });
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  studentDetail: async (req, res) => {
    try {
      const studentId = req.params.id;
      const student = await User.findByPk(studentId);
      const studentDetail = await StudentsClass.findAll(
        {
          include: [
            { model: User, where: { id: studentId } },
            { model: LearningStatus },
            { model: Class },
          ],
        }
      );
    
      res.render("admin/class/student-detail", {
        student,
        studentDetail,
        moment,
      });
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  updateStudentDetail: async (req, res) => {
    try {
      const studentId = req.params.id;
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  manageTeacher: async (req, res) => {
    const classId = req.params.id;
    try {
      const class1 = await Class.findByPk(classId);
      const teachers = await class1.getTeacher();
      res.render("admin/class/teacher-class", { moment, class1, teachers });
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
};
