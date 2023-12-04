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
    console.log(profile);
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
    return done(null, user);
  }
);
