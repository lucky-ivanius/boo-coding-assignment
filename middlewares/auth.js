const { verify } = require("jsonwebtoken");
const httpResponse = require("../utils/http-response");
const jwtConfig = require("../config/jwt");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.substring(7) ?? "";

  if (!token) return httpResponse.unauthorized(res);

  const decoded = verify(token, jwtConfig.SECRET_KEY);

  req.auth = {
    userId: decoded.sub,
  };

  next();
};

module.exports = { authMiddleware };
