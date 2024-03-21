const {
  Course,
  Class,
  CourseModule,
  ModuleDocument,
} = require("../../../models");
var moment = require("moment");
moment.locale("vi");
const { Op } = require("sequelize");
const xlsx = require("node-xlsx").default;
let data;
module.exports = {
  manageCourse: async (req, res) => {
    try {
      const { page = 1, keyword = "", pageSize = 5 } = req.query;
      const offset = (page - 1) * pageSize;
      const option = {
        attributes: ["id", "name", "price", "tryLearn"],
        order: [["id", "ASC"]],
        offset: offset,
        limit: +pageSize,
        where: { name: { [Op.substring]: keyword } },
      };
      const { count, rows } = await Course.findAndCountAll(option);
      data = rows;
      const totalPage = Math.ceil(count / pageSize);
      res.render("admin/course/course", {
        totalPage,
        pageSize,
        rows,
        page,
        keyword,
      });
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  excel: (req, res) => {
    try {
      const dataExport = [["Tên", "Giá", "Tình trạng học thử"]];
      data.forEach((row) => {
        dataExport.push([
          row.name,
          row.price,
          row.tryLearn === 1 ? "Có thể học thử" : "Cần đăng ký",
        ]);
      });
      var buffer = xlsx.build([{ name: "mySheetName", data: dataExport }]);
      res
        .setHeader(
          "Content-Disposition",
          "attachment; filename=ExportCourse.xlsx"
        )
        .send(buffer);
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  addCourse: (req, res) => {
    try {
      const user = req.user;
      res.render("admin/course/add-new-course", { user });
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  handleAddCourse: async (req, res) => {
    try {
      await Course.create(req.body);
      res.redirect("/admin/course");
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  updateCourse: async (req, res) => {
    const { id } = req.params;
    try {
      const course = await Course.findByPk(id);
      res.render("admin/course/update-course", { course });
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  handleUpdateCourse: async (req, res) => {
    const { id } = req.params;
    try {
      const course = await Course.findByPk(id);
      await course.update(req.body);
      res.redirect("/admin/course");
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  deleteCourse: async (req, res) => {
    const { id } = req.params;
    try {
      const course = await Course.findByPk(id);
      await course.destroy();
      res.redirect("/admin/course");
    } catch (error) {
      console.log(error);
      res.render("error");
    }
  },
  modules: async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    const modules = await CourseModule.findAll({
      where: { courseId: req.params.id },
      include: "documents",
    });
    res.render("admin/course/modules", { course, modules });
  },

  handleAddModule: async (req, res) => {
    try {
      await CourseModule.create({
        name: req.body.moduleName,
        courseId: req.params.id,
      });
      res.redirect("/admin/course/modules/" + req.params.id);
    } catch (error) {
      res.render("error");
    }
  },

  deleteModule: async (req, res) => {
    try {
      await CourseModule.destroy({
        where: { id: req.params.moduleId },
      });
      res.redirect("/admin/course/modules/" + req.params.id);
    } catch (error) {
      res.render("error");
    }
  },
  handleAddDocument: async (req, res) => {
    try {
      await ModuleDocument.create({
        pathName: req.body.documentPath,
        moduleId: req.params.moduleId,
      });
      res.redirect("/admin/course/modules/" + req.params.courseId);
    } catch (error) {
      res.render("error");
    }
  },

  deleteDocument: async (req, res) => {
    try {
      await ModuleDocument.destroy({
        where: { id: req.query.documentId },
      });
      res.redirect("/admin/course/modules/" + req.params.courseId);
    } catch (error) {
      res.render("error");
    }
  },
  handleUpdateModule: async (req, res) => {
    try {
      await CourseModule.update(
        { name: req.body.updatedModuleName },
        {
          where: { id: req.params.moduleId },
        }
      );
      res.redirect("/admin/course/modules/" + req.params.courseId);
    } catch (error) {
      res.render("error");
    }
  },
  handleUpdateDocument: async (req, res) => {
    try {
      await ModuleDocument.update(
        { pathName: req.body.updatedDocumentPath },
        {
          where: { id: req.params.documentId },
        }
      );
      res.redirect("/admin/course/modules/" + req.params.courseId);
    } catch (error) {
      res.render("error");
    }
  },
};
