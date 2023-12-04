const { User, Type } = require("../../models");
module.exports = async (req, res, next) => {
  const type = await req.user.getType();
  console.log(type.name);
  const pathRequest = req.url.split("/")[1];
  if (type.name !== pathRequest) {
    res.redirect("/" + type.name);
  }
  next();
};
