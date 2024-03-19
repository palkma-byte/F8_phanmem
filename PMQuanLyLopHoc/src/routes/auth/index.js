var express = require("express");
var router = express.Router();
const passport = require("passport");

//import Recaptcha from 'express-recaptcha' with options
var Recaptcha = require("express-recaptcha").RecaptchaV3;
var options = { hl: "vi", callback: "cb" };
var recaptcha = new Recaptcha(
  process.env.CAPTCHA_SITE_KEY,
  process.env.CAPTCHA_SECRET_KEY,
  options
);

const AuthController = require("../../http/controllers/auth/AuthController");
const isUser = require("../../http/middlewares/isUser");
const isGuest = require("../../http/middlewares/isGuest");
/* GET home page. */
router.get("/login", isUser, recaptcha.middleware.render, AuthController.login);

router.get("/register", isUser, AuthController.register);
router.post("/register", AuthController.handleRegister);
router.get("/verify", isUser, AuthController.verify);
router.post("/verify", AuthController.handleVerify);
router.get("/recover-password", isUser, AuthController.recoverPassword);
router.post("/recover-password", AuthController.handleRecoverPassword);
router.get("/new-password/:token", isUser, AuthController.newPassword);
router.post("/new-password/:token", AuthController.handleNewPassword);
router.get("/update", isGuest, AuthController.update);
router.post("/update", AuthController.handleUpdate);
router.get("/change-password", isGuest, AuthController.changePassword);
router.post("/change-password", AuthController.handleChangePassword);
router.get("/remove/:social", isGuest, AuthController.removeSocial);
router.post("/logout", AuthController.logout);
router.post(
  "/login",
  recaptcha.middleware.verify,
  function (req, res, next) {
    if (!req.recaptcha.error && req.recaptcha.data.score > 0.3) {
      // success code
      console.log("Success captcha");
      next();
    } else {
      // error code

      req.flash("error", "Captcha thất bại, vui lòng thử lại!");
      res.redirect("/auth/login");
    }
  },
  passport.authenticate("local", {
    // successRedirect: "/admin",
    failureRedirect: "/auth/login",
    failureFlash: true,
  }),
  AuthController.handleLogin
);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    // successRedirect: "/",

    failureFlash: true,
    failureRedirect: "/login",
  }),
  AuthController.handleLogin
);
router.get("/facebook", passport.authenticate("facebook"));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    // successRedirect: "/",
    failureFlash: true,
    failureRedirect: "/login",
  }),
  AuthController.handleLogin
);

router.get("/github", passport.authenticate("github"));

router.get(
  "/github/callback",
  passport.authenticate("github", {
    // successRedirect: "/",
    failureFlash: true,
    failureRedirect: "/login",
  }),
  AuthController.handleLogin
);

module.exports = router;
