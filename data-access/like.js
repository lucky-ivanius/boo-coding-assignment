const likeDataAccess = (likeModel) => ({
  exists: async ({ commentId, userId }) => {
    return likeModel.exists({ commentId, userId });
  },
  create: async ({ commentId, userId }) => {
    await likeModel.create({ commentId, userId });
  },
  delete: async ({ commentId, userId }) => {
    await likeModel.deleteOne({ commentId, userId });
  },
});

module.exports = { likeDataAccess };
