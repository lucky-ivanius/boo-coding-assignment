"use strict";

const express = require("express");
const router = express.Router();
const Profile = require("../../models/profile");
const Comment = require("../../models/comment");
const Like = require("../../models/like");
const { profileDataAccess } = require("../../data-access/profile");
const { commentDataAccess } = require("../../data-access/comment");
const { likeDataAccess } = require("../../data-access/like");
const {
  createProfileController,
  getProfileByIdController,
  getProfilesController,
  createProfileCommentController,
  getProfileCommentsController,
  likeCommentController,
  unlikeCommentController,
} = require("../../controllers/profile");
const {
  createProfileValidation,
  createProfileCommentValidation,
  getProfileCommentsValidation,
  toggleLikeCommentValidation,
} = require("../../validations/profile");
const { authMiddleware } = require("../../middlewares/auth");

const profileDataAccessImpl = profileDataAccess(Profile);
const commentDataAccessImpl = commentDataAccess(Comment);
const likeDataAccessImpl = likeDataAccess(Like);

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
  router.put(
    "/comments/:commentId/like",
    authMiddleware,
    toggleLikeCommentValidation,
    likeCommentController(commentDataAccessImpl, likeDataAccessImpl)
  );
  router.put(
    "/comments/:commentId/unlike",
    authMiddleware,
    toggleLikeCommentValidation,
    unlikeCommentController(commentDataAccessImpl, likeDataAccessImpl)
  );

  return router;
};
