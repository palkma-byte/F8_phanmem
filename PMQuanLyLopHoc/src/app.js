require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var expressLayouts = require("express-ejs-layouts");
var passport = require("passport");
var LocalStrategy = require("passport-local");
const session = require("express-session");
var flash = require("connect-flash");
const { User } = require("./models");

const localPassport = require("./passport/localPassport");
const googlePassport = require("./passport/googlePassport");
const facebookPassport = require("./passport/facebookPassport");
const githubPassport = require("./passport/githubPassport");

const authRouter = require("./routes/auth");
const adminRouter = require("../src/routes/admin/index");
const studentRouter = require("../src/routes/students/index");
const teacherRouter = require("../src/routes/teacher/index");

var app = express();

// view engine setup

app.set("views", path.join(__dirname, "resources", "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout/master.layout.ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));
// app.use(express.static("../public"));
console.log(path.join(__dirname, "../public"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
  })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use("local", localPassport);
passport.use("google", googlePassport);
passport.use("facebook", facebookPassport);
passport.use("github", githubPassport);

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(async function (id, cb) {
  const user = await User.findByPk(id);
  cb(null, user);
});

//require("./test.js")

//Routers

app.use("/auth", authRouter);
app.use("/", studentRouter);
app.use("/teacher", teacherRouter);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
