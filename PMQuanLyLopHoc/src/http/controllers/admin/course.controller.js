const { Course } = require("../../../models");

module.exports = {
  manageCourse: async (req, res) => {
    const user = req.user;
    const { page = 1, keyword = "" } = req.query;
    console.log(req.user);
    const courses = await Course.findAll();
    res.render("admin/course", { courses, user, page, keyword });
  },
  addCourse: (req, res) => {
    const user = req.user;
    res.render("admin/add-new-course", { user });
  },
  handleAddCourse: async (req,res) => {
    await Course.create(req.body);
    res.redirect("/admin/course")
  }
};
