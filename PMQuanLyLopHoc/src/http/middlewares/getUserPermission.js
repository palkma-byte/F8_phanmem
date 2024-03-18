const { User, Role, Permission } = require("../../models");

const getUserPermission = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Role, include: Permission }, { model: Permission }],
    });
    const perm = [];
    user.Roles.forEach((role) => {
      role.Permissions.forEach((rolePerm) => {
        perm.push(rolePerm.values);
      });
    });
    user.Permissions.forEach((permission) => {
      perm.push(permission.values);
    });
    req.session.userPermissions = perm;
    res.locals.userPerm = perm;
  } catch (error) {
    console.log(error);
  }

  next();
};
module.exports = getUserPermission;
