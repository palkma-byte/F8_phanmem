var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/home", async (req, res) => {
  const user = req.user;
  res.render("student/index", { user });
});

module.exports = router;
