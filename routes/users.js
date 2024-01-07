var express = require("express");
var router = express.Router();
const passport = require("passport");
const { verifyToken } = require("./auth");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

/* GET users listing. */
router.get("/profile", verifyToken, async (req, res, next) => {
  const userDetails = await prisma.user.findMany({
    where: {
      name: req.user.name.name,
    },
    select: {
      password: false,
      name: true,
      email: true,
    },
  });
  if (userDetails) {
    return res.status(200).json({ status: true, userDetails });
  }
});

router.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: "Incorrect username or password" });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      const accessToken = jwt.sign({ name: user.name }, "SECRET", {
        expiresIn: "24h",
      });
      res.status(201).json({
        status: "success",
        message: "User Logged In!",
        data: {
          accessToken,
        },
      });
    });
  })(req, res, next);
});

router.post("/register", async (req, res) => {
  let userRegister;
  const { username, email, password } = req.body;
  let hashedPassword = password;
  if (email) {
    userRegister = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (userRegister) {
      return res.status(400).json({ error: "This email already exists" });
    }
  }

  if (password) {
    hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync(8));
  }
  if (email && username && password) {
    userRegister = await prisma.user.create({
      data: {
        email: email,
        name: username,
        password: hashedPassword,
      },
    });
  } else {
    return res
      .status(400)
      .json({ status: false, error: "Email,Password and User name required" });
  }
  return res.status(200).json({ status: true, userRegister });
});

module.exports = router;
