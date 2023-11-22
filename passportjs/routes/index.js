var express = require("express");
var router = express.Router();
const { User, Post } = require("../models");

/* GET home page. */
router.get("/bacxyc", async function (req, res, next) {
  const user = await User.findAll();
  const postWithUser = await Post.findByPk(1, { include: User });
  console.log(postWithUser.content);
  console.log(postWithUser.User.email);

  res.render("index", { title: "Express" });
});

router.get("/auth",async function (req,res) {
  res.render("index", { title: "Express" });
})

module.exports = router;
