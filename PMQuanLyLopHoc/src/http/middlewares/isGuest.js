module.exports = (req, res, next) => {
  if (!req.user) {
    res.clearCookie("lgt");
    res.redirect("/auth/login");
  }
  next();
};
