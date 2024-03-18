var express = require("express");
var router = express.Router();
const multer = require("multer");
const upload = multer();

const ClassController = require("../../http/controllers/teacher/class.controller");
const CourseController = require("../../http/controllers/teacher/course.controller");
const CalendarController = require("../../http/controllers/teacher/calendar.controller");

/* GET home page. */
router.get("/home", ClassController.home);

// class
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
router.get("/class/exercise/:classId", ClassController.exercise);
router.post(
  "/class/exercise/:classId/create",
  ClassController.handleCreateExercise
);
router.post(
  "/class/exercise/:classId/update/:exerciseId",
  ClassController.handleUpdateExercise
);
router.post(
  "/class/exercise/:classId/delete/:exerciseId",
  ClassController.handleDeleteExercise
);
router.get(
  "/class/exercise/:classId/submission/:exerciseId",
  ClassController.checkSubmit
);
router.get("/class/:classId/comment", ClassController.comment);

router.post(
  "/class/:classId/comment",
  upload.single("fileInput"),
  ClassController.handlePost
);
router.post("/class/:classId/reply", ClassController.handlePostReply);
router.post("/class/:classId/comment/delete", ClassController.handleDelete);
router.post("/class/:classId/comment/update", ClassController.handleUpdate);

// course
router.get("/course", CourseController.course);
router.get("/course/modules/:id", CourseController.modules);
router.post(
  "/course/modules/:courseId/update-module/:moduleId",
  CourseController.handleUpdateModule
);
router.post(
  "/course/modules/:courseId/update-document/:documentId",
  CourseController.handleUpdateDocument
);
router.post(
  "/course/modules/:courseId/add-document/:moduleId",
  CourseController.handleAddDocument
);
router.post("/course/modules/:id/add-module", CourseController.handleAddModule);

// calendar

router.get("/calendar", CalendarController.index);
router.get("/api/schedule", CalendarController.startDate);

module.exports = router;
