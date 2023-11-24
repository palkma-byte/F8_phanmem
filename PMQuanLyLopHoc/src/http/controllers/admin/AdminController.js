const { User } = require("../../../models");
module.exports = {
  index: async (req, res) => {
    const user = await User.findAll();
    res.json(user);
  },
};
