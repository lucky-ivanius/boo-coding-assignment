const { sign } = require("jsonwebtoken");
const httpResponse = require("../utils/http-response");
const jwtConfig = require("../config/jwt");

const registerController = (userDataAccess) => {
  return async function (req, res, next) {
    try {
      const userExists = await userDataAccess.exists(
        req.validatedRequestData.name
      );

      if (userExists)
        return httpResponse.badRequest(
          res,
          `User with name: ${req.validatedRequestData.name} already exists`
        );

      await userDataAccess.create(req.validatedRequestData);

      return httpResponse.created(res);
    } catch (error) {
      return httpResponse.unexpected(res);
    }
  };
};

const loginController = (userDataAccess) => {
  return async function (req, res, next) {
    try {
      const user = await userDataAccess.findByName(req.body.name);

      if (!user) return httpResponse.badRequest(res, "Invalid credential");

      const token = sign({ sub: user._id }, jwtConfig.SECRET_KEY, {
        expiresIn: "24h",
      });

      return httpResponse.ok(res, { token });
    } catch (error) {
      return httpResponse.unexpected(res);
    }
  };
};

module.exports = {
  registerController,
  loginController,
};
