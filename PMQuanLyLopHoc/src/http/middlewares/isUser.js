const { LoginToken } = require("../../models");
module.exports = async (req, res, next) => {
  if (req.user && req.cookies.lgt) {
    const token = await LoginToken.findOne({
      where: { token: req.cookies.lgt },
    });
    if (token) {
      res.redirect("/home");
    } else {
      res.clearCookie("lgt");
      req.logout((err) => {
        if (err) {
          next();
        }
        res.redirect("/auth/login");
      });
    }
  }

  next();
};
