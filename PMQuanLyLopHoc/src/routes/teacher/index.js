var express = require("express");
var router = express.Router();

const ClassController = require("../../http/controllers/teacher/class.controller");
const CourseController = require("../../http/controllers/teacher/course.controller");

/* GET home page. */
router.get("/home", ClassController.home);
router.get("/class", ClassController.class);
router.get("/class/manage-student/:id", ClassController.studentDetail);
router.get(
  "/class/manage-student/:id/update",
  ClassController.updateStudentDetail
);
router.post(
  "/class/manage-student/:id/update",
  ClassController.handleUpdateStudentDetail
);
router.get("/class/attendance/:id", ClassController.checkAttendance);
router.post("/class/attendance/:id", ClassController.saveCheckAttendance);
router.get("/class/exercise/:id", ClassController.class);

// course
router.get("/course", CourseController.course);
router.get("/course/manage-module/:id", ClassController.class);

module.exports = router;
