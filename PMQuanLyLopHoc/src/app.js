require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var expressLayouts = require("express-ejs-layouts");

const authRouter = require("../src/routes/auth/index")
const adminRouter = require("../src/routes/admin/index");
const studentRouter = require("../src/routes/students/index");
const teacherRouter = require("../src/routes/teacher/index");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//require("./test.js")


//Routers

app.use('/auth', authRouter);
app.use('/', studentRouter);
app.use('/teacher', teacherRouter);
app.use('/admin', adminRouter);

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
