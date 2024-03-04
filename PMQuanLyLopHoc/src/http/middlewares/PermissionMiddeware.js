const PermissionMiddleware = (permissions) => {
  return (req, res, next) => {
    //Xử lý lấy quyền của user
    if (!req.session.userPermissions.includes(permissions)) {
      req.flash("err", "Không có quyền");
      res.redirect("/");
      return;
    } else {
      next();
    }
  };
};
module.exports = PermissionMiddleware;
