var express = require("express");
var router = express.Router();

const UserController = require("../../http/controllers/admin/user.controller");
const CourseController = require("../../http/controllers/admin/course.controller");

/* GET home page. */
router.get("/", UserController.index);
//user manager
router.get("/manage", UserController.manager);
router.get("/manage/update/:id", UserController.updateUser);
router.post("/manage/update/:id", UserController.handleUpdateUser);
router.post("/manage/delete/:id", UserController.deleteUser);
router.get("/manage/export-excel", UserController.excel);
router.get("/manage/add", UserController.addNewUser);
router.post("/manage/add", UserController.handleAddUser);
//course manager
router.get("/course", CourseController.manageCourse);
router.get("/course/add", CourseController.addCourse);
router.post("/course/add", CourseController.handleAddCourse);
router.get("/course/update/:id", CourseController.manageCourse);
router.get("/course/delete/:id", CourseController.manageCourse);
router.get("/course/manage-class/:id", CourseController.manageCourse);

module.exports = router;
