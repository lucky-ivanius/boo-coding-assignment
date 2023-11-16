"use strict";

const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const { userDataAccess } = require("../../data-access/user");
const {
  registerController,
  loginController,
} = require("../../controllers/auth");
const { registerValidation } = require("../../validations/auth");

const userDataAccessImpl = userDataAccess(User);

module.exports = function () {
  router.post(
    "/register",
    registerValidation,
    registerController(userDataAccessImpl)
  );
  router.post("/login", loginController(userDataAccessImpl));

  return router;
};
