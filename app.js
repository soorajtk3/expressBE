const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { PrismaClient } = require("@prisma/client");
var session = require("express-session");
var logger = require("morgan");
var cors = require("cors");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
require("dotenv").config();
const passportDir = require("./Lib/passport");
const app = express();
const prisma = new PrismaClient();
const passportSetup = require("./routes/authGoogle");
const { verifyToken } = require("./routes/auth");
app.use(
  cors({
    origin: process.env.REACT_APP_URL,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// Configure passport to use a local strategy
passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          name: username,
        },
      });

      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }

      if (user.password !== password) {
        return done(null, false, { message: "Incorrect password." });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// Serialize and deserialize user objects
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      return done(null, false, { message: "User not found." });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

// Configure express app
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Define routes

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", passportSetup);
app.use(verifyToken);
app.listen(3000, () => {
  console.log("Server started on port 3000");
});

module.exports = app;
