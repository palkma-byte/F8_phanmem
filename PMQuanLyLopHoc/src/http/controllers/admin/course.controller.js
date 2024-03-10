const {
  Course,
  Class,
  CourseModule,
  ModuleDocument,
} = require("../../../models");
var moment = require("moment");
moment.locale("vi");

module.exports = {
  manageCourse: async (req, res) => {
    const user = req.user;
    const { page = 1, keyword = "" } = req.query;

    try {
      const courses = await Course.findAll();
      res.render("admin/course/course", { courses, user, page, keyword });
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  addCourse: (req, res) => {
    try {
      const user = req.user;
      res.render("admin/course/add-new-course", { user });
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  handleAddCourse: async (req, res) => {
    try {
      await Course.create(req.body);
      res.redirect("/admin/course");
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  updateCourse: async (req, res) => {
    const { id } = req.params;
    try {
      const course = await Course.findByPk(id);
      res.render("admin/course/update-course", { course });
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  handleUpdateCourse: async (req, res) => {
    const { id } = req.params;
    try {
      const course = await Course.findByPk(id);
      await course.update(req.body);
      res.redirect("/admin/course");
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  deleteCourse: async (req, res) => {
    const { id } = req.params;
    try {
      const course = await Course.findByPk(id);
      await course.destroy();
      res.redirect("/admin/course");
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  modules: async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    const modules = await CourseModule.findAll({
      where: { courseId: req.params.id },
      include: "documents",
    });
    res.render("admin/course/modules", { course, modules });
  },

  handleAddModule: async (req, res) => {
    try {
      await CourseModule.create({
        name: req.body.moduleName,
        courseId: req.params.id,
      });
      res.redirect("/admin/course/modules/" + req.params.id);
    } catch (error) {
      res.render("error");
    }
  },

  deleteModule: async (req, res) => {
    try {
      await CourseModule.destroy({
        where: { id: req.params.moduleId },
      });
      res.redirect("/admin/course/modules/" + req.params.id);
    } catch (error) {
      res.render("error");
    }
  },
  handleAddDocument: async (req, res) => {
    try {
      await ModuleDocument.create({
        pathName: req.body.documentPath,
        moduleId: req.params.moduleId,
      });
      res.redirect("/admin/course/modules/" + req.params.courseId);
    } catch (error) {
      res.render("error");
    }
  },

  deleteDocument: async (req, res) => {
    try {
      await ModuleDocument.destroy({
        where: { id: req.query.documentId },
      });
      res.redirect("/admin/course/modules/" + req.params.courseId);
    } catch (error) {
      res.render("error");
    }
  },
};
