const LocalStrategy = require("passport-local").Strategy;

const { User } = require("../models");
const bcrypt = require("bcrypt");

module.exports = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async function verify(email, password, cb) {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return cb(null, false, { message: "Email hoặc mật khẩu sai" });
    }
    if (user.firstLogin === 0) {
      return cb(null, false, { message: "Tài khoản chưa được xác thực" });
    }

    const hash = user.password;
    bcrypt.compare(password, hash, (err, result) => {
      if (result) {
        return cb(null, user);
      }

      return cb(null, false, { message: "Email hoặc mật khẩu sai" });
    });
  }
);
