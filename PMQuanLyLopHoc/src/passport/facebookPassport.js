const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;

const { User, Social, UserSocial } = require("../models");

module.exports = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_URL_CALLBACK,
    passReqToCallback: true,
    //Route callback. Người dùng sẽ được chuyển hướng đến route này sau khi xác thực tài khoản
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
