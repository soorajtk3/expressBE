const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({
      status: "fail",
      message: "Unauthorized!",
    });
  }
  const token = authHeader.split(" ")[1];
  try {
    const user = jwt.verify(token, "SECRET");
    console.log(user);
    req.user.name = user;
    next();
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: "Unauthorized!",
    });
  }
};
module.exports = { verifyToken };
