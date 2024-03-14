const { Course, CourseModule, ModuleDocument } = require("../../../models");

module.exports = {
  course: async (req, res) => {
    const user = req.user;
    const { page = 1, keyword = "" } = req.query;

    try {
      const courses = await Course.findAll();
      res.render("teacher/course/course", {
        courses,
        user,
        page,
        keyword,
        layout: "layout/teacher.layout.ejs",
      });
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
    res.render("teacher/course/modules", { course, modules });
  },

  handleAddModule: async (req, res) => {
    try {
      await CourseModule.create({
        name: req.body.moduleName,
        courseId: req.params.id,
      });
      res.redirect("/teacher/course/modules/" + req.params.id);
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
      res.redirect("/teacher/course/modules/" + req.params.courseId);
    } catch (error) {
      res.render("error");
    }
  },
};
