const { Class } = require("../../../models");
module.exports = {
  index: async (req, res) => {
    res.render("admin/calendar/calendar", { layout: false });
  },
  startDate: async (req, res) => {
    const classInfo = await Class.findAll();
    res.json(classInfo);
  },
};
