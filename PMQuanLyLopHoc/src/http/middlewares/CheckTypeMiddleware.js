const { User, Type } = require("../../models");
module.exports = async (req, res, next) => {
  try {
    const type = await req.user.getType();
    const pathRequest = req.url.split("/")[1];
    if (type.name !== pathRequest) {
      res.redirect("/" + type.name);
    }
  } catch (error) {
    res.redirect("/auth/login")
  }

  next();
};
