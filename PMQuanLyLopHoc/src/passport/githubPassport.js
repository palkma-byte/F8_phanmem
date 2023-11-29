const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;

module.exports = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_APP_ID,
    clientSecret: process.env.GITHUB_APP_SECRET,
    callbackURL: process.env.GITHUB_URL_CALLBACK,
  },
  (accessToken, refreshToken, profile, done) => {
    // Xử lý thông tin người dùng sau khi xác thực thành công
    // Có thể tạo hoặc cập nhật tài khoản người dùng trong cơ sở dữ liệu
    console.log(profile);
    return done(null, profile);
  }
);
