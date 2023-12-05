const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;

const { User, Social } = require("../models");

module.exports = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_APP_ID,
    clientSecret: process.env.GITHUB_APP_SECRET,
    callbackURL: process.env.GITHUB_URL_CALLBACK,
  },
  async (accessToken, refreshToken, profile, done) => {
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
