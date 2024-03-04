const { User, Role, Permission } = require("../../models");

const getUserPermission = async (req, res, next) => {
  if (!req.session.userPermissions && req.user) {
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Role, include: Permission }, { model: Permission }],
    });
    let perm = [];
    user.Roles.forEach((role) => {
      role.Permissions.forEach((rolePerm) => {
        perm.push(rolePerm.values);
      });
    });
    user.Permissions.forEach((permission) => {
      perm.push(permission.values);
    });
    req.session.userPermissions = perm;
    res.locals.userPermissions = perm;

    next();
  } else {
    next();
  }
};
module.exports = getUserPermission;
