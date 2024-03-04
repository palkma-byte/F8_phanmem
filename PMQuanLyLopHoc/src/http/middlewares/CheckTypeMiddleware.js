const { User, Type } = require("../../models");
const checkTypeMiddleware = async (req, res, next) => {
  try {
    const type = await req.user.getType();
    const pathRequest = req.url.split("/")[1];
    if (type.name !== pathRequest) {
      res.redirect("/" + type.name + "/home");
    }
  } catch (error) {
    console.log(error);
  }

  next();
};

module.exports = checkTypeMiddleware;
