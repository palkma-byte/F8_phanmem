const { User } = require("../../../models");
module.exports = {
  index: async (req, res) => {
    const user = req.user;
    console.log();
    res.render("admin/index", { user });
  },
};
