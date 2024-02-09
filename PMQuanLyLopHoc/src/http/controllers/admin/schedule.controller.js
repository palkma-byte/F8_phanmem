const { Class } = require("../../../models");
module.exports = {
  index: async (req, res) => {
    const ad = await Class.findByPk(6);
    console.log(new Date(ad.startDate) + new Date(ad.timeLearn));
    res.render("admin/calendar/calendar", { layout: false });
  },
  startDate: async (req, res) => {
    const ad = await Class.findAll();
    res.json(ad);
  },
};
