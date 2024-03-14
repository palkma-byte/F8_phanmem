var express = require("express");
var router = express.Router();

const HomeController = require("../../http/controllers/students/home.controller");

const classStudentMiddleware = require("../../http/middlewares/studentClassMiddleware");

/* GET home page. */
router.get("/home", HomeController.home);
router.get("/class", HomeController.classJoined);
router.get(
  "/class/detail/:id",
  classStudentMiddleware,
  HomeController.classDetail
);

module.exports = router;
