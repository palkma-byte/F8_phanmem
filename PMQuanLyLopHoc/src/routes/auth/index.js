var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", (req, res) => {
  res.render("auth/login", { layout: "auth.layout.ejs" });
});
router.post("/", (req, res) => {
  res.send("Auth Handle Post");
});

module.exports = router;
