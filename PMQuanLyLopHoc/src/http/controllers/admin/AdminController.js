const { User, Type } = require("../../../models");
const { ROW_PER_PAGE } = process.env;
const { Op } = require("sequelize");
const xlsx = require("node-xlsx").default;
const Event = require("../../../core/Event");
const SendMail = require("../../../jobs/SendMail");
let data;
module.exports = {
  index: async (req, res) => {
    const user = req.user;

    res.render("admin/index", { user });
  },
  manager: async (req, res) => {
    const user = req.user;
    const { page = 1, keyword = "" } = req.query;

    const offset = (page - 1) * ROW_PER_PAGE;

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
      order: [["id", "DESC"]],
      offset: offset,
      limit: +ROW_PER_PAGE,
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
    const totalPage = Math.ceil(count / ROW_PER_PAGE);

    res.render("admin/user-manager", {
      user,
      rows,
      count,
      page,
      totalPage,
      keyword,
    });
  },
  excel: (req, res) => {
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
      .setHeader("Content-Disposition", "attachment; filename=ExportUser.xlsx")
      .send(buffer);
  },
  deleteUser: async (req, res) => {
    const { id } = req.params;
    try {
      await User.destroy({ where: { id: id } });
    } catch (error) {
      console.log(error);
    }
    res.redirect("/admin/manage");
  },
  updateUser: async (req, res) => {
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

    res.render("admin/update-user", { user, userInfo });
  },
  handleUpdateUser: async (req, res) => {
    const { id } = req.params;
    const { name, phone, address } = req.body;

    await User.update(
      { name: name, phone: phone, address: address },
      { where: { id: id } }
    );

    res.redirect("/admin/manage");
  },
  resetPassword: (req, res) => {},
  addNewUser: async (req, res) => {
    const user = req.user;
    res.render("admin/add-new-user", { user });
  },
  handleAddUser: async (req, res) => {
    console.log(req.body);
    res.redirect("/admin/manage");
  },
};
