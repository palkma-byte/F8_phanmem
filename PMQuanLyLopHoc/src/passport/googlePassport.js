const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

module.exports = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_APP_ID,
    clientSecret: process.env.GOOGLE_APP_SECRET,
    callbackURL: process.env.GOOGLE_URL_CALLBACK,
  },
  (accessToken, refreshToken, profile, done) => {
    // Xử lý thông tin người dùng sau khi xác thực thành công
    // Có thể tạo hoặc cập nhật tài khoản người dùng trong cơ sở dữ liệu
    console.log(profile);
    return done(null, profile);
  }
);
