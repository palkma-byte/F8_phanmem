const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;

const { User, Social, UserSocial } = require("../models");

module.exports = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_APP_ID,
    clientSecret: process.env.GITHUB_APP_SECRET,
    callbackURL: process.env.GITHUB_URL_CALLBACK,
    passReqToCallback: true,
  },
  async (request, accessToken, refreshToken, profile, done) => {
    const { id, displayName, provider } = profile;
    const [social, createSocial] = await Social.findOrCreate({
      where: { name: provider },
      default: { name: provider },
    });
    if (request.user) {
      await UserSocial.findOrCreate({
        where: {
          userId: request.user.id,
          providerId: social.id,
          externalId: id,
        },
        default: {
          userId: request.user.id,
          providerId: social.id,
          externalId: id,
        },
      });
      return done(null, request.user);
    } else {
      const userSocial = await UserSocial.findOne({
        where: { providerId: social.id, externalId: id },
      });
      if (userSocial) {
        const user = await User.findByPk(userSocial.userId);
        return done(null, user);
      }
    }

    return done(null, false, {
      message:
        "Authentication failed! There is no account link to this social account!",
    });
  }
);
