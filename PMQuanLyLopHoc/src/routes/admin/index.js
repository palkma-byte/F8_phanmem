var express = require("express");
var router = express.Router();

const AdminController = require("../../http/controllers/admin/AdminController");

/* GET home page. */
router.get("/", AdminController.index);
router.get("/manage", AdminController.manager);
router.get("/manage/update/:id", AdminController.updateUser);
router.post("/manage/update/:id", AdminController.handleUpdateUser);
router.post("/manage/delete/:id", AdminController.deleteUser);
router.get("/manage/export-excel", AdminController.excel);
router.get("/manage/add", AdminController.addNewUser);
router.post("/manage/add", AdminController.handleAddUser);

module.exports = router;
