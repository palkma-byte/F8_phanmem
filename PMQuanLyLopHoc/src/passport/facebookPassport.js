const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;

module.exports = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_URL_CALLBACK, //Route callback. Người dùng sẽ được chuyển hướng đến route này sau khi xác thực tài khoản
  },
  (accessToken, refreshToken, profile, done) => {
    // Xử lý thông tin người dùng sau khi xác thực thành công
    // Có thể tạo hoặc cập nhật tài khoản người dùng trong cơ sở dữ liệu
    return done(null, profile);
  }
);
