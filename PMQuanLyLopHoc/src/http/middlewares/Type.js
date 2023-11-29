const { Type } = require("../../models");
module.exports = {
  get: async (req, res, next) => {
    if (req.user) {
      const type = await Type.findByPk(req.user.typeId);
      console.log(type.name);
    }

    next();
  },
};
