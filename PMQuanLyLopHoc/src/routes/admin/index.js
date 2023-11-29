var express = require("express");
var router = express.Router();

const AdminController = require("../../http/controllers/admin/AdminController");

const TypeMiddleware = require("../../http/middlewares/Type");
/* GET home page. */
router.get("/", TypeMiddleware.get, AdminController.index);

module.exports = router;
