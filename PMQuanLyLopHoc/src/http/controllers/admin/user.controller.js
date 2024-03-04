const { User, Type, Role, Permission } = require("../../../models");
const { Op } = require("sequelize");
const xlsx = require("node-xlsx").default;
var generator = require("generate-password");
const Event = require("../../../core/Event");
const SendMail = require("../../../jobs/SendMail");
var moment = require("moment");
let data;

module.exports = {
  index: async (req, res) => {
    try {
      res.render("admin/index", { layout: false });
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  chartApi: async (req, res) => {
    // Assuming you have fetched the list of users and stored it in the 'users' variable
    const users = await User.findAll();

    // Get the current date
    const currentDate = moment();

    // Calculate the four nearest months before the current date
    const nearestMonths = [];
    for (let i = 6; i >= 0; i--) {
      const month = currentDate.clone().subtract(i, "months");
      nearestMonths.push(month);
    }

    // Group users by month and count the number of users in each month
    const groupedData = users.reduce((acc, user) => {
      const monthYear = moment(user.createdAt).format("MM/YYYY");
      acc[monthYear] = (acc[monthYear] || 0) + 1;
      return acc;
    }, {});

    // Extract the counts for the nearest months
    const result = nearestMonths.map((month) => {
      const monthYear = month.format("MM/YYYY");
      return {
        month: monthYear,
        count: groupedData[monthYear] || 0,
      };
    });

    // Separate arrays for months and counts
    const months = result.map((entry) => entry.month);
    const counts = result.map((entry) => entry.count);

    res.json({ month: months, count: counts });
  },
  manager: async (req, res) => {
    try {
      const user = req.user;
      const { page = 1, keyword = "", pageSize = 5 } = req.query;

      const offset = (page - 1) * pageSize;

      const option = {
        attributes: [
          "id",
          "name",
          "email",
          "phone",
          "address",
          "typeId",
          "firstLogin",
        ],
        order: [["id", "ASC"]],
        offset: offset,
        limit: +pageSize,
        where: {
          [Op.or]: [
            { name: { [Op.substring]: keyword } },
            { email: { [Op.substring]: keyword } },
            { phone: { [Op.substring]: keyword } },
            { address: { [Op.substring]: keyword } },
          ],
        },

        include: Type,
      };
      const { count, rows } = await User.findAndCountAll(option);
      data = rows;
      const totalPage = Math.ceil(count / pageSize);

      res.render("admin/user/user-manager", {
        user,
        rows,
        count,
        page,
        totalPage,
        keyword,
        pageSize,
      });
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  excel: (req, res) => {
    try {
      const dataExport = [];
      data.forEach((row) => {
        dataExport.push([
          row.id,
          row.name,
          row.email,
          row.phone,
          row.address,
          row.Type.name,
          row.firstLogin === 1 ? "Verified" : "Unverified",
        ]);
      });
      var buffer = xlsx.build([{ name: "mySheetName", data: dataExport }]);
      res
        .setHeader(
          "Content-Disposition",
          "attachment; filename=ExportUser.xlsx"
        )
        .send(buffer);
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  deleteUser: async (req, res) => {
    const { id } = req.params;
    try {
      await User.destroy({ where: { id: id } });
      res.redirect("/admin/manage");
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  updateUser: async (req, res) => {
    try {
      const user = req.user;
      const { id } = req.params;
      const userInfo = await User.findByPk(id, {
        attributes: [
          "id",
          "name",
          "email",
          "phone",
          "address",
          "typeId",
          "firstLogin",
        ],
      });

      res.render("admin/user/update-user", { user, userInfo });
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  handleUpdateUser: async (req, res) => {
    const { id } = req.params;
    const { name, phone, address } = req.body;
    try {
      await User.update(
        { name: name, phone: phone, address: address },
        { where: { id: id } }
      );
      res.redirect("/admin/manage");
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  resetPassword: (req, res) => {
    // Implement the resetPassword logic here
  },
  addNewUser: async (req, res) => {
    try {
      const user = req.user;
      const type = await Type.findAll();
      res.render("admin/user/add-new-user", { user, type });
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  handleAddUser: async (req, res) => {
    const { email } = req.body;
    try {
      const checkUser = await User.findOne({ where: { email: email } });
      if (checkUser) {
        return res.redirect("/admin/manage");
      }

      const passwordGen = generator.generate({
        length: 10,
        numbers: true,
      });

      new Event(
        new SendMail({
          email: email,
          subject: "Mật khẩu tại F8 phần mềm",
          content: `Bạn đã được thiết lập tài khoản mới tại F8 Edu! Vui lòng sử dụng email ${email} và mật khẩu ${passwordGen} để đăng nhập.`,
        })
      );
      req.body.password = passwordGen;
      req.body.firstLogin = 1;
      await User.create(req.body);
      res.redirect("/admin/manage");
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  permission: async (req, res) => {
    try {
      const roles = await Role.findAll();
      const permissions = await Permission.findAll();
      const user = await User.findByPk(req.params.id, {
        include: [Permission, Role],
      });
      res.render("admin/user/permission", { roles, permissions, user });
    } catch (error) {
      res.render("error");
    }
  },
  handleAddRole: async (req, res) => {
    const user = await User.findByPk(req.params.id);
    await user.addRoles(req.body.selectRole);
    res.redirect("/admin/manage/permission/" + req.params.id);
  },
  handleDeleteRole: async (req, res) => {
    const user = await User.findByPk(req.params.id);
    await user.removeRole(req.query.roleId);
    res.redirect("/admin/manage/permission/" + req.params.id);
  },
  handleUpdatePermission: async (req, res) => {
    const user = await User.findByPk(req.params.id);
    await user.setPermissions(req.body.permissions);
    res.redirect("/admin/manage/permission/" + req.params.id);
  },
};
