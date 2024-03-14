const { Class } = require("../../models");

module.exports = async (req, res, next) => {
  //Xử lý lấy quyền của user
  try {
    const classInfo = await Class.findByPk(req.params.id);
    const student = await classInfo.hasStudent(req.user.id);
    if (student) {
      next();
    } else {
      res.redirect("/student/class");
    }
  } catch (error) {
    res.render("error", { layout: "layout/student.layout.ejs" });
  }
};
