const userDataAccess = (userModel) => ({
  exists: async (name) => {
    return userModel.exists({ name });
  },
  create: async (user) => {
    await userModel.create(user);
  },
  findByName: async (name) => {
    const user = await userModel.findOne({ name }, {}, { lean: true });

    if (!user) return null;

    return user;
  },
});

module.exports = { userDataAccess };
