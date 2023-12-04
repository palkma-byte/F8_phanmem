const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const { User, Social, UserSocial } = require("../models");

module.exports = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_APP_ID,
    clientSecret: process.env.GOOGLE_APP_SECRET,
    callbackURL: process.env.GOOGLE_URL_CALLBACK,
  },
  async (accessToken, refreshToken, profile, done) => {
    // Xử lý thông tin người dùng sau khi xác thực thành công
    // Có thể tạo hoặc cập nhật tài khoản người dùng trong cơ sở dữ liệu

    const { displayName, provider } = profile;
    const [social, createSocial] = await Social.findOrCreate({
      where: { name: provider },
      default: { name: provider },
    });
    // console.log(social);
    const [user, createUser] = await User.findOrCreate({
      where: { email: profile._json.email },
      default: { name: displayName, email: profile._json.email },
    });
    await user.addSocial(social);
    const fk = await UserSocial.findOne({
      where: { userId: user.id, providerId: social.id },
    });
    await fk.update({ externalId: profile.id });
    console.log(fk);
    return done(null, user);
  }
);
