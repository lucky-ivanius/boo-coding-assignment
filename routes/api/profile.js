"use strict";

const express = require("express");
const router = express.Router();
const Profile = require("../../models/profile");
const Comment = require("../../models/comment");
const { profileDataAccess } = require("../../data-access/profile");
const { commentDataAccess } = require("../../data-access/comment");
const {
  createProfileController,
  getProfileByIdController,
  getProfilesController,
  createProfileCommentController,
  getProfileCommentsController,
} = require("../../controllers/profile");
const {
  createProfileValidation,
  createProfileCommentValidation,
  getProfileCommentsValidation,
} = require("../../validations/profile");
const { authMiddleware } = require("../../middlewares/auth");

const profileDataAccessImpl = profileDataAccess(Profile);
const commentDataAccessImpl = commentDataAccess(Comment);

module.exports = function () {
  router.get("/", getProfilesController(profileDataAccessImpl));
  router.post(
    "/",
    createProfileValidation,
    createProfileController(profileDataAccessImpl)
  );
  router.get("/:profileId", getProfileByIdController(profileDataAccessImpl));
  router.get(
    "/:profileId/comments",
    getProfileCommentsValidation,
    getProfileCommentsController(profileDataAccessImpl, commentDataAccessImpl)
  );
  router.post(
    "/:profileId/comments",
    authMiddleware,
    createProfileCommentValidation,
    createProfileCommentController(profileDataAccessImpl, commentDataAccessImpl)
  );

  return router;
};
