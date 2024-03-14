const { Course, Class, User } = require("../../../models");
module.exports = {
  home: async (req, res) => {
    const courses = await Course.findAll();
    res.render("student/home", {
      courses,
      layout: "layout/student.layout.ejs",
    });
  },
  classJoined: async (req, res) => {
    const user = await User.findByPk(req.user.id);
    console.log(user);
    const classes = await user.getClassStudent();
    res.render("student/class-participated", {
      classes,
      layout: "layout/student.layout.ejs",
    });
  },
  classDetail: async (req, res) => {
    const classInfo = await Class.findByPk(req.params.id);
    res.render(req.params);
  },
};
