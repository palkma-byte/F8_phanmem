const { LoginToken, User } = require("../../models");
module.exports = async (req, res, next) => {
  if (!req.user) {
    res.redirect("/auth/login");
  } 
  next();
};
