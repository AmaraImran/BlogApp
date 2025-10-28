const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

function generateToken(user) {
  return jwt.sign(user, secret, { expiresIn: "1d" });
}

function validateToken(token) {
  return jwt.verify(token, secret);
}

module.exports = { generateToken, validateToken };
