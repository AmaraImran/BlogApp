const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "defaultsecret";

function generateToken(user) {
  // Convert user to a plain object or pick only the needed fields
  const payload = {
    _id: user._id.toString(),
    email: user.email,
    profileImage: user.profileImage,
    role: user.role
  };

  return jwt.sign(payload, secret, { expiresIn: "1d" });
}

function validateToken(token) {
  return jwt.verify(token, secret);
}

module.exports = { generateToken, validateToken };
