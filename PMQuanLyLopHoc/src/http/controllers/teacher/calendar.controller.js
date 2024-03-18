const { Class, User } = require("../../../models");
module.exports = {
  index: async (req, res) => {
    res.render("teacher/calendar/calendar", { layout: false });
  },
  startDate: async (req, res) => {
    const teacher = await User.findByPk(req.user.id);
    const classInfo = await teacher.getClasses();
    res.json(classInfo);
  },
};
