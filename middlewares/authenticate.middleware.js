const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send("Please Login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded) {
      req.userID = decoded.userID;
      next();
    } else {
      return res.status(401).send("Please Login");
    }
  } catch (error) {
    return res.status(401).send("Invalid Token");
  }
};

module.exports = {
  authenticate,
};
