const { User, Type } = require("../../../models");
const { Op } = require("sequelize");
module.exports = {
  studentList: async (req, res) => {
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
  
        include: { model: Type, where: { name: "student" } },
      };
      const { count, rows } = await User.findAndCountAll(option);
      data = rows;
      const totalPage = Math.ceil(count / pageSize);
  
      res.render("admin/student/manage-student", {
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
      res.render("error")
    }
   
  },
};
