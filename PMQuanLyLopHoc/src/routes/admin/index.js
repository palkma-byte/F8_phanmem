var express = require("express");
var router = express.Router();
const multer = require("multer");
const upload = multer();

const UserController = require("../../http/controllers/admin/user.controller");
const CourseController = require("../../http/controllers/admin/course.controller");
const ClassController = require("../../http/controllers/admin/class.controller");
const CommentController = require("../../http/controllers/admin/comment.controller");
const StudentController = require("../../http/controllers/admin/student.controller");
const ScheduleController = require("../../http/controllers/admin/schedule.controller");
const RoleController = require("../../http/controllers/admin/role.controller");

const { Setting } = require("../../models");

//Middlewares
const PermissionMiddleware = require("../../http/middlewares/PermissionMiddeware");

/* GET home page. */
router.get("/home", UserController.index);
//user manager
router.get("/manage", UserController.manager);
router.get(
  "/manage/update/:id",
  PermissionMiddleware("update"),
  UserController.updateUser
);
router.post(
  "/manage/update/:id",
  PermissionMiddleware("update"),
  UserController.handleUpdateUser
);
router.post(
  "/manage/delete/:id",
  PermissionMiddleware("delete"),
  UserController.deleteUser
);
router.get("/manage/export-excel", UserController.excel);
router.get("/manage/add", UserController.addNewUser);
router.post("/manage/add", UserController.handleAddUser);
router.get("/manage/permission/:id", UserController.permission);
router.post("/manage/permission/:id/add-role", UserController.handleAddRole);
router.post(
  "/manage/permission/:id/delete-role",
  PermissionMiddleware("delete"),
  UserController.handleDeleteRole
);
router.post(
  "/manage/permission/:id/update-permissions",
  PermissionMiddleware("update"),
  UserController.handleUpdatePermission
);
//chart
router.get("/api/chart", UserController.chartApi);
//course manager
router.get("/course", CourseController.manageCourse);
router.get(
  "/course/add",
  PermissionMiddleware("create"),
  CourseController.addCourse
);
router.post(
  "/course/add",
  PermissionMiddleware("create"),
  CourseController.handleAddCourse
);
router.get(
  "/course/update/:id",
  PermissionMiddleware("update"),
  CourseController.updateCourse
);
router.post(
  "/course/update/:id",
  PermissionMiddleware("update"),
  CourseController.handleUpdateCourse
);
router.post(
  "/course/delete/:id",
  PermissionMiddleware("delete"),
  CourseController.deleteCourse
);
router.get("/course/modules/:id", CourseController.modules);
router.post(
  "/course/modules/:id/add-module",
  PermissionMiddleware("create"),
  CourseController.handleAddModule
);

router.post(
  "/course/modules/:id/delete-module/:moduleId",
  PermissionMiddleware("delete"),
  CourseController.deleteModule
);
router.post(
  "/course/modules/:courseId/add-document/:moduleId",
  PermissionMiddleware("create"),
  CourseController.handleAddDocument
);
router.post(
  "/course/modules/:courseId/delete-document",
  PermissionMiddleware("delete"),
  CourseController.deleteDocument
);
router.post(
  "/course/modules/:courseId/update-module/:moduleId",
  PermissionMiddleware("update"),
  CourseController.handleUpdateModule
);
router.post(
  "/course/modules/:courseId/update-document/:documentId",
  PermissionMiddleware("update"),
  CourseController.handleUpdateDocument
);

//class manage
router.get("/course/manage-class/:id", ClassController.manageClass);
router.get(
  "/course/manage-class/add/:id",
  PermissionMiddleware("create"),
  ClassController.addClass
);
router.post(
  "/course/manage-class/add/:id",
  PermissionMiddleware("create"),
  ClassController.handleAddClass
);

router.get(
  "/class/update/:id",
  PermissionMiddleware("update"),
  ClassController.updateClass
);
router.post(
  "/class/update/:id",
  PermissionMiddleware("update"),
  ClassController.handleUpdateClass
);

router.post(
  "/class/delete/:id",
  PermissionMiddleware("delete"),
  ClassController.deleteClass
);

router.get("/class/manage-student/:id", ClassController.studentDetail);
router.get(
  "/class/manage-student/:id/update",
  PermissionMiddleware("update"),
  ClassController.updateStudentDetail
);
router.get(
  "/class/manage-student/:id/add",
  PermissionMiddleware("create"),
  ClassController.addStudentToClass
);
router.post(
  "/class/manage-student/:id/add",
  PermissionMiddleware("create"),
  ClassController.handleAddStudentToClass
);
router.post(
  "/class/manage-student/:id/update",
  PermissionMiddleware("update"),
  ClassController.handleUpdateStudentDetail
);
router.post(
  "/class/manage-student/:id/delete",
  PermissionMiddleware("delete"),
  ClassController.deleteStudentClass
);
router.get("/class/manage-teacher/:id", ClassController.manageTeacher);
router.post(
  "/class/manage-teacher/:id/add",
  PermissionMiddleware("create"),
  ClassController.addTeacherClass
);
router.post(
  "/class/manage-teacher/:id/delete",
  PermissionMiddleware("delete"),
  ClassController.deleteTeacherClass
);

//class attendance
router.get("/class/attendance/:id", ClassController.checkAttendance);
router.post("/class/attendance/:id", ClassController.saveCheckAttendance);

//student manage
router.get("/student/manage", StudentController.studentList);

//test comment markdown
router.get("/comment", CommentController.index);
router.post(
  "/comment",
  upload.single("fileInput"),
  CommentController.handlePost
);
router.post("/reply", CommentController.handlePostReply);
router.post("/comment/delete", CommentController.handleDelete);
router.post("/comment/update", CommentController.handleUpdate);

// test schedule
router.get("/schedule", ScheduleController.index);
router.get("/api/schedule", ScheduleController.startDate);

//phan quyen
router.get("/role/manage", RoleController.manageRole);
router.get(
  "/role/manage/update/:id",
  PermissionMiddleware("update"),
  RoleController.update
);
router.post(
  "/role/manage/update/:id",
  PermissionMiddleware("update"),
  RoleController.handleUpdate
);
router.post(
  "/role/manage/delete/:id",
  PermissionMiddleware("delete"),
  RoleController.delete
);
router.get(
  "/role/manage/add",
  PermissionMiddleware("create"),
  RoleController.add
);
router.post(
  "/role/manage/add",
  PermissionMiddleware("create"),
  RoleController.handlAdd
);

// setting page
router.get("/settings", async (req, res) => {
  const settings = await Setting.findAll();
  const value = new Object();
  settings.forEach((setting) => {
    value[setting.optKey] = setting.optValue;
  });
  console.log(value);
  res.render("admin/setting/index", { value });
});
router.post("/settings", async (req, res) => {
  const data = req.body;
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      await Setting.update({ optValue: data[key] }, { where: { optKey: key } });
    }
  }

  res.redirect("/admin/settings");
});

module.exports = router;
