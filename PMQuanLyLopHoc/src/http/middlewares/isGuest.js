module.exports = async (req, res, next) => {
  if (!req.user) {
    res.clearCookie("lgt");
    res.redirect("/auth/login");
  }
  next();
};
