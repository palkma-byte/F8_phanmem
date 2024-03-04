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

//Middlewares
const PermissionMiddleware = require("../../http/middlewares/PermissionMiddeware");

/* GET home page. */
router.get("/home", UserController.index);
//user manager
router.get("/manage", UserController.manager);
router.get("/manage/update/:id", UserController.updateUser);
router.post("/manage/update/:id", UserController.handleUpdateUser);
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
  UserController.handleDeleteRole
);
router.post(
  "/manage/permission/:id/update-permissions",
  UserController.handleUpdatePermission
);
//chart
router.get("/api/chart", UserController.chartApi);
//course manager
router.get("/course", CourseController.manageCourse);
router.get("/course/add", CourseController.addCourse);
router.post("/course/add", CourseController.handleAddCourse);
router.get("/course/update/:id", CourseController.updateCourse);
router.post("/course/update/:id", CourseController.handleUpdateCourse);
router.post("/course/delete/:id", CourseController.deleteCourse);
router.get("/course/manage-modules/:id", CourseController.updateCourse);

//class manage
router.get("/course/manage-class/:id", ClassController.manageClass);
router.get("/course/manage-class/add/:id", ClassController.addClass);
router.post("/course/manage-class/add/:id", ClassController.handleAddClass);

router.get("/class/update/:id", ClassController.updateClass);
router.post("/class/update/:id", ClassController.handleUpdateClass);

router.post("/class/delete/:id", ClassController.deleteClass);

router.get("/class/manage-student/:id", ClassController.manageStudent);
// router.get("/class/manage-student/update/:id", ClassController);
router.get(
  "/class/manage-student/student-detail/:id",
  ClassController.studentDetail
);
router.get("/class/manage-teacher/:id", ClassController.manageTeacher);
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

// test schedule
router.get("/schedule", ScheduleController.index);
router.get("/api/schedule", ScheduleController.startDate);

//phan quyen
router.get("/role/manage", RoleController.manageRole);
router.get("/role/manage/update/:id", RoleController.update);
router.post("/role/manage/update/:id", RoleController.handleUpdate);
router.post("/role/manage/delete/:id", RoleController.delete);
router.get("/role/manage/add", RoleController.add);
router.post("/role/manage/add", RoleController.handlAdd);

module.exports = router;
