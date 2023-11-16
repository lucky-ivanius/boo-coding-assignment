const { isValidObjectId } = require("mongoose");

const profileDataAccess = (profileModel) => ({
  create: async (profile) => {
    const DEFAULT_IMAGE = "https://soulverse.boo.world/images/1.png";

    await profileModel.create({
      ...profile,
      image: profile.image ?? DEFAULT_IMAGE,
    });
  },
  exists: async (id) => {
    return profileModel.exists({ _id: id });
  },
  findById: async (id) => {
    if (!isValidObjectId(id)) return null;

    const profile = await profileModel.findById(id);

    if (!profile) return null;

    return profile;
  },
  findAll: async () => {
    return profileModel.find({}, {}, { lean: true });
  },
});

module.exports = { profileDataAccess };
