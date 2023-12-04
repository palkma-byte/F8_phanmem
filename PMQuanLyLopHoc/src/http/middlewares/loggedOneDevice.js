const { LoginToken, User } = require("../../models");
module.exports = async (req, res, next) => {
  if (req.cookies.lgt) {
    const token = await LoginToken.findOne({
      where: { token: req.cookies.lgt },
    });
    if (token) {
      next();
    } else {
      req.flash("error", "Tai khoan vua duoc dang nhap o noi khac");
      req.logout((err) => {
        if (err) {
          next();
        }
        res.redirect("/auth/login");
      });
    }
  }
};
