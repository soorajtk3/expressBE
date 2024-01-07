var router = require("express").Router();
const passport = require("passport");
router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "Login success",
      user: req.user,
    });
  } else {
    res.status(404).json({
      error: true,
      message: "Login failed",
    });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "Login failed",
  });
});
router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: `${process.env.REACT_APP_URL}/dashboard`,
    failureRedirect: "/login/failed",
  })
);

router.get("/logout", (req, res) => {
  req.logOut();
  re.redirect(`${process.env.REACT_APP_URL}`);
});
module.exports = router;
