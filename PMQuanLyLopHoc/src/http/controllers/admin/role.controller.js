const { User, Role, Permission } = require("../../../models");
const { Op } = require("sequelize");
module.exports = {
  manageRole: async (req, res) => {
    try {
      const roles = await Role.findAll({ include: Permission });
      const permissions = await Permission.findAll();
      res.render("admin/role/manage", { roles, permissions });
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },

  update: async (req, res) => {
    try {
      const roleId = req.params.id;
      const role = await Role.findByPk(roleId, { include: Permission });
      const permissions = await Permission.findAll();
      res.render("admin/role/update", { role, permissions });
    } catch (error) {
      res.render("error");
    }
  },

  handleUpdate: async (req, res) => {
    try {
      const permissions = await Permission.findAll({
        where: { [Op.or]: { id: req.body.permissions } },
      });
      const role = await Role.findByPk(req.params.id);
      await role.update({ name: req.body.roleName });
      await role.setPermissions(permissions);
      res.redirect("/admin/role/manage/update/" + req.params.id);
    } catch (error) {
      res.render("error");
    }
  },

  add: async (req, res) => {
    try {
      const permissions = await Permission.findAll();
      res.render("admin/role/add", { permissions });
    } catch (error) {
      res.render("error");
    }
  },
  handlAdd: async (req, res) => {
    try {
      const [role, created] = await Role.findOrCreate({
        where: { name: req.body.roleName },
        defaults: {
          name: req.body.roleName,
        },
      });
      if (!created) {
        res.redirect("/admin/role/manage");
      } else {
        role.setPermissions(req.body.permissions);
        res.redirect("/admin/role/manage");
      }
    } catch (error) {
      res.render("error");
    }
  },
  delete: async (req, res) => {
    try {
      await Role.destroy({ where: { id: req.body.id } });
      res.redirect("/admin/role/manage");
    } catch (error) {
      res.render("error");
    }
  },
};
