var express = require("express");
var router = express.Router();
const passport = require("passport");

/* GET home page. */
router.get("/login", (req, res) => {
  const flashmsg = req.flash("error")[0];

  res.render("auth/login", { flashmsg, layout: "layout/auth.layout.ejs" });
});
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/auth",
    failureFlash: true,
  })
);
router.get("/register", (req, res) => {
  res.render("auth/register", { layout: "layout/auth.layout.ejs" });
});
router.post("/register", (req, res) => {
  res.send("Register");
});
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);
router.get("/facebook", passport.authenticate("facebook"));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

router.get("/github", passport.authenticate("github"));

router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

module.exports = router;
