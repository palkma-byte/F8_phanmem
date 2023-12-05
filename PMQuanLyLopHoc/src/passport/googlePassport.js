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
    //Lien ket tai khoan dua tren email, khi email dang ky va email lien ket khong trung => khong thanh cong 

    const { displayName, provider } = profile;

    const social = await Social.findOne({ where: { name: provider } });
    const user = await User.findOne({
      where: { email: profile._json.email },
    });
    const socialConnected = await user.hasSocial(social);
    const logged = await user.getLoginToken();
    if (!socialConnected && !logged) {
      return done(null, false, { message: "Mang xa hoi chua duoc ket noi!" });
    } else if (!socialConnected && logged) {
      const [social, createSocial] = await Social.findOrCreate({
        where: { name: provider },
        default: { name: provider },
      });
      await user.addSocial(social);
      return done(null, user);
    } else if (socialConnected && !logged) {
      return done(null, user);
    }
  }
);
