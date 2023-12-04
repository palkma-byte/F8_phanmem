const { LoginToken } = require("../../models");
module.exports = async (req, res, next) => {
  if (req.user && req.cookies.lgt) {
    res.redirect("/");
  }
  next();
};
