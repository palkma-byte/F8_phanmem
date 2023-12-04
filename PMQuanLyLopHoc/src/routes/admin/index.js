var express = require("express");
var router = express.Router();

const AdminController = require("../../http/controllers/admin/AdminController");


/* GET home page. */
router.get("/", AdminController.index);

module.exports = router;
