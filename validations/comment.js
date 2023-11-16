const { z } = require("zod");

const toggleLikeCommentValidationSchema = z.object({
  commentId: z.string({
    errorMap: () => ({ message: "Invalid Comment" }),
  }),
  userId: z.string({
    errorMap: () => ({ message: "Invalid User" }),
  }),
});

const toggleLikeCommentValidation = async (req, res, next) => {
  const result = toggleLikeCommentValidationSchema.safeParse({
    commentId: req.params.commentId,
    userId: req.auth?.userId,
  });

  if (!result.success) {
    return httpResponse.badRequest(res, result.error.issues.at(0).message);
  }

  req.validatedRequestData = result.data;

  next();
};

module.exports = { toggleLikeCommentValidation };
