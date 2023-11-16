const httpResponse = require("../utils/http-response");

const toggleLikeCommentController = (commentDataAccess, likeDataAccess) => {
  return async function (req, res, next) {
    try {
      const likeExists = await likeDataAccess.exists(req.validatedRequestData);

      if (likeExists) {
        await likeDataAccess.delete(req.validatedRequestData);
        await commentDataAccess.addLikes({
          commentId: req.params.commentId,
          likes: -1,
        });

        return httpResponse.noContent(res);
      }

      const commentExists = await commentDataAccess.exists(
        req.params.commentId
      );

      if (!commentExists) return httpResponse.notFound(res, "Comment");

      await likeDataAccess.create(req.validatedRequestData);
      await commentDataAccess.addLikes({
        commentId: req.params.commentId,
        likes: 1,
      });

      return httpResponse.ok(res);
    } catch (error) {
      return httpResponse.unexpected(res);
    }
  };
};

module.exports = {
  toggleLikeCommentController,
};
