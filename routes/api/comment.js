"use strict";

const express = require("express");
const router = express.Router();
const Comment = require("../../models/comment");
const Like = require("../../models/like");
const { commentDataAccess } = require("../../data-access/comment");
const { likeDataAccess } = require("../../data-access/like");
const { toggleLikeCommentController } = require("../../controllers/comment");
const { toggleLikeCommentValidation } = require("../../validations/comment");
const { authMiddleware } = require("../../middlewares/auth");

const commentDataAccessImpl = commentDataAccess(Comment);
const likeDataAccessImpl = likeDataAccess(Like);

module.exports = function () {
  router.put(
    "/:commentId/like",
    authMiddleware,
    toggleLikeCommentValidation,
    toggleLikeCommentController(commentDataAccessImpl, likeDataAccessImpl)
  );

  return router;
};
