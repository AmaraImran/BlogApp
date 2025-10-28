const { validateToken } = require("../services/authentication");

function checkforauthenticationToken(cookieName) {
  return (req, res, next) => {
    const tokenvalue = req.cookies[cookieName];
    if (!tokenvalue) {
      req.user = null;
      return next();
    }

    try {
      const payload = validateToken(tokenvalue);
      req.user = payload;
      console.log("✅ User payload:", payload);
    } catch (error) {
      console.error("❌ Invalid token:", error.message);
      req.user = null;
    }

    return next();
  };
}

module.exports = { checkforauthenticationToken };
