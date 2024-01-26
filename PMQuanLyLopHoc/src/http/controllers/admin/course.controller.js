const { Course, Class } = require("../../../models");
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
  manageModules: async (req,res) => {
    res.send("modules")
  }
};
