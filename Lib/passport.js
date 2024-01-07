var GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const prisma = require("../routes/prismaClient");
require("dotenv").config();
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `${process.env.REACT_APP_URL}/auth/google/callback`,
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const user = await prisma.user.findUnique({
          where: {
            id: 2,
          },
        });
        console.log(profile);
        if (user) {
          done(null, user);
        } else {
          newUser = await prisma.user.create({
            data: {
              name: profile.displayName,
              password: profile.name.givenName,
              email: "sooraj+1006@hamon.in",
            },
          });
          done(null, newUser);
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
