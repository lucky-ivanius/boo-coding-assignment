const httpResponse = require("../utils/http-response");

const renderProfileByIdController = (profileDataAccess) => {
  return async function (req, res, next) {
    try {
      const profile = await profileDataAccess.findById(req.params.id);

      if (!profile) return httpResponse.notFound(res, "Profile");

      return res.render("profile_template", {
        profile,
      });
    } catch (error) {
      return httpResponse.unexpected(res);
    }
  };
};

const createProfileController = (profileDataAccess) => {
  return async function (req, res, next) {
    try {
      await profileDataAccess.create(req.validatedRequestData);

      return httpResponse.created(res);
    } catch (error) {
      return httpResponse.unexpected(res);
    }
  };
};

const getProfileByIdController = (profileDataAccess) => {
  return async function (req, res, next) {
    try {
      const profile = await profileDataAccess.findById(req.params.profileId);

      if (!profile) return httpResponse.notFound(res, "Profile");

      return httpResponse.ok(res, profile);
    } catch (error) {
      return httpResponse.unexpected(res);
    }
  };
};

const getProfilesController = (profileDataAccess) => {
  return async function (req, res, next) {
    try {
      const profile = await profileDataAccess.findAll();

      return httpResponse.ok(res, profile);
    } catch (error) {
      return httpResponse.unexpected(res);
    }
  };
};

const createProfileCommentController = (
  profileDataAccess,
  commentDataAccess
) => {
  return async function (req, res, next) {
    try {
      const profileExists = await profileDataAccess.exists(
        req.params.profileId
      );

      if (!profileExists) return httpResponse.notFound(res, "Profile");

      await commentDataAccess.create(req.validatedRequestData);

      return httpResponse.created(res);
    } catch (error) {
      return httpResponse.unexpected(res);
    }
  };
};

const getProfileCommentsController = (profileDataAccess, commentDataAccess) => {
  return async function (req, res, next) {
    try {
      const profileExists = await profileDataAccess.exists(
        req.params.profileId
      );

      if (!profileExists) return httpResponse.notFound(res, "Profile");

      const comments = await commentDataAccess.findByProfileId(
        req.validatedRequestData
      );

      return httpResponse.ok(res, comments);
    } catch (error) {
      return httpResponse.unexpected(res);
    }
  };
};

module.exports = {
  renderProfileByIdController,
  createProfileController,
  getProfileByIdController,
  getProfilesController,
  createProfileCommentController,
  getProfileCommentsController,
};
