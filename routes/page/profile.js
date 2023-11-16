"use strict";

const express = require("express");
const router = express.Router();
const Profile = require("../../models/profile");
const { profileDataAccess } = require("../../data-access/profile");
const { renderProfileByIdController } = require("../../controllers/profile");

const profileDataAccessImpl = profileDataAccess(Profile);

module.exports = function () {
  router.get("/:id", renderProfileByIdController(profileDataAccessImpl));

  return router;
};
