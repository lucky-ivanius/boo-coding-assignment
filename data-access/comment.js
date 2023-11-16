const commentDataAccess = (commentModel) => ({
  create: async (comment) => {
    await commentModel.create(comment);
  },
  findByProfileId: async ({ profileId, sort, filterType, filterValue }) => {
    const comments = await commentModel
      .find(
        {
          profileId,
          ...(!!filterType &&
            !!filterValue && {
              voting: {
                [filterType]: filterValue,
              },
            }),
        },
        { profileId: false },
        { lean: true }
      )
      .populate("userId")
      .sort({ [sort ?? "createdAt"]: "desc" });

    return comments;
  },
  exists: async (commentId) => {
    return commentModel.exists({ _id: commentId });
  },
  addLikes: async ({ commentId, likes }) => {
    await commentModel.findOneAndUpdate(
      { _id: commentId },
      { $inc: { likes } }
    );
  },
});

module.exports = { commentDataAccess };
