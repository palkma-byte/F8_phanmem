var express = require("express");
var router = express.Router();
const multer = require("multer");
const upload = multer();

const HomeController = require("../../http/controllers/students/home.controller");

const classStudentMiddleware = require("../../http/middlewares/studentClassMiddleware");
const StudentCommentMiddleware = require("../../http/middlewares/StudentComment");

/* GET home page. */
router.get("/home", HomeController.home);
router.get("/class", HomeController.classJoined);
router.get(
  "/class/homework/:classId",
  classStudentMiddleware,
  HomeController.homework
);
router.get(
  "/class/document/:classId",
  classStudentMiddleware,
  HomeController.document
);
router.post(
  "/class/homework/:classId/submit",
  classStudentMiddleware,
  HomeController.submitHomework
);
router.post(
  "/class/homework/:classId/update",
  classStudentMiddleware,
  HomeController.updateHomework
);
router.get(
  "/class/attendance/:classId",
  classStudentMiddleware,
  HomeController.attendance
);
router.get(
  "/class/:classId/comment",
  classStudentMiddleware,
  HomeController.comment
);

router.post(
  "/class/:classId/comment",
  upload.single("fileInput"),
  classStudentMiddleware,
  HomeController.handlePost
);
router.post("/class/:classId/reply", HomeController.handlePostReply);
router.post(
  "/class/:classId/comment/delete",
  StudentCommentMiddleware,
  HomeController.handleDelete
);
router.post(
  "/class/:classId/comment/update",
  StudentCommentMiddleware,
  HomeController.handleUpdate
);

module.exports = router;
