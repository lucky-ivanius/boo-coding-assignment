const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const {
  createProfileValidation,
  createProfileCommentValidation,
  getProfileCommentsValidation,
  toggleLikeCommentValidation,
} = require("../../validations/profile");
const {
  createProfileController,
  getProfileByIdController,
  getProfilesController,
  createProfileCommentController,
  getProfileCommentsController,
  likeCommentController,
  unlikeCommentController,
} = require("../../controllers/profile");

const profileDataAccessMock = {
  create: jest.fn(),
  exists: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
};

const commentDataAccessMock = {
  create: jest.fn(),
  findByProfileId: jest.fn(),
  exists: jest.fn(),
  addLikes: jest.fn(),
};

const likeDataAccessMock = {
  exists: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
};

const authMiddlewareMock = async (req, res, next) => {
  req.auth = {
    userId: "1234",
  };

  next();
};

const profiles = [
  {
    name: "A Martinez",
    description: "Adolph Larrue Martinez III.",
    mbti: "ISFJ",
    enneagram: "9w1",
    variant: "sp/so",
    tritype: 725,
    socionics: "SEE",
    sloan: "RCOEN",
    psyche: "FEVL",
    temperaments: "Sanguine",
    image: "https://soulverse.boo.world/images/1.png",
  },
];

const comments = [
  {
    profileId: "1234",
    userId: "1234",
    title: "test",
    description: "test",
    voting: {
      mbti: "INFP",
      enneagram: "9w1",
      zodiac: "Leo",
    },
    likes: 10,
    createdAt: 1577847600,
  },
  {
    profileId: "4567",
    userId: "4567",
    title: "test",
    description: "test",
    voting: {
      mbti: "ISFJ",
      enneagram: "5w4",
      zodiac: "Aquarius",
    },
    likes: 11,
    createdAt: 1577867600,
  },
  {
    profileId: "1234",
    userId: "7890",
    title: "test",
    description: "test",
    voting: {
      mbti: "ENFJ",
      enneagram: "9w1",
      zodiac: "Cancer",
    },
    likes: 12,
    createdAt: 1577857600,
  },
];

const likes = [{ commentId: "1234", userId: "1234" }];

const app = express();
app.use(bodyParser.json());

// routes
app.post(
  "/",
  createProfileValidation,
  createProfileController(profileDataAccessMock)
);
app.get("/", getProfilesController(profileDataAccessMock));
app.get("/:profileId", getProfileByIdController(profileDataAccessMock));
app.post(
  "/:profileId/comments",
  createProfileCommentValidation,
  createProfileCommentController(profileDataAccessMock, commentDataAccessMock)
);
app.get(
  "/:profileId/comments",
  authMiddlewareMock,
  getProfileCommentsValidation,
  getProfileCommentsController(profileDataAccessMock, commentDataAccessMock)
);
app.put(
  "/comments/:commentId/like",
  authMiddlewareMock,
  toggleLikeCommentValidation,
  likeCommentController(commentDataAccessMock, likeDataAccessMock)
);
app.put(
  "/comments/:commentId/unlike",
  authMiddlewareMock,
  toggleLikeCommentValidation,
  unlikeCommentController(commentDataAccessMock, likeDataAccessMock)
);

describe("Controller: Profile", () => {
  beforeEach(() => {
    profileDataAccessMock.create.mockReset();
    profileDataAccessMock.exists.mockReset();
    profileDataAccessMock.findAll.mockReset();
    profileDataAccessMock.findById.mockReset();

    commentDataAccessMock.create.mockReset();
    commentDataAccessMock.findByProfileId.mockReset();
    commentDataAccessMock.exists.mockReset();
    commentDataAccessMock.addLikes.mockReset();

    likeDataAccessMock.exists.mockReset();
    likeDataAccessMock.create.mockReset();
    likeDataAccessMock.delete.mockReset();
  });

  describe("createProfileController", () => {
    it("should return 201 Created when creation is successful", async () => {
      profileDataAccessMock.create.mockResolvedValue();

      const response = await request(app).post("/").send(profiles[0]);

      expect(response.status).toBe(201);
      expect(profileDataAccessMock.create).toHaveBeenCalledTimes(1);
    });

    it("should return 400 Bad Request when validation fails", async () => {
      const response = await request(app).post("/").send({});

      expect(response.status).toBe(400);
      expect(profileDataAccessMock.create).not.toHaveBeenCalled();
    });
  });

  describe("getProfilesController", () => {
    it("should return 200 OK", async () => {
      profileDataAccessMock.findAll.mockResolvedValue(profiles);

      const response = await request(app).get("/").send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual(profiles);
      expect(profileDataAccessMock.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("getProfileByIdController", () => {
    it("should return 200 OK when profile is found", async () => {
      profileDataAccessMock.findById.mockResolvedValue(profiles[0]);

      const response = await request(app).get("/1234").send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual(profiles[0]);
      expect(profileDataAccessMock.findById).toHaveBeenCalledTimes(1);
    });

    it("should return 404 Not found when the profile is not found", async () => {
      profileDataAccessMock.findById.mockResolvedValue(false);

      const response = await request(app).get("/1234").send();

      expect(response.status).toBe(404);
      expect(profileDataAccessMock.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe("getProfileCommentsController", () => {
    it("should return 200 OK when the profile is found", async () => {
      const profileId = "1234";

      profileDataAccessMock.exists.mockResolvedValue(true);
      commentDataAccessMock.findByProfileId.mockResolvedValue(comments);

      const response = await request(app).get(`/${profileId}/comments`).send();

      expect(response.status).toBe(200);
      expect(profileDataAccessMock.exists).toHaveBeenCalledTimes(1);
      expect(commentDataAccessMock.findByProfileId).toHaveBeenCalledTimes(1);
    });

    it("should return 404 not found when the profile is not found", async () => {
      const profileId = "1234";

      profileDataAccessMock.exists.mockResolvedValue(null);

      const response = await request(app).get(`/${profileId}/comments`).send();

      expect(response.status).toBe(404);
      expect(profileDataAccessMock.exists).toHaveBeenCalledTimes(1);
      expect(commentDataAccessMock.findByProfileId).not.toHaveBeenCalled();
    });
  });

  describe("likeCommentController", () => {
    it("should return 200 OK", async () => {
      const commentId = "1234";

      likeDataAccessMock.exists.mockResolvedValue(false);
      commentDataAccessMock.exists.mockResolvedValue(true);

      const response = await request(app)
        .put(`/comments/${commentId}/like`)
        .send();

      expect(response.status).toBe(200);
      expect(likeDataAccessMock.exists).toHaveBeenCalledTimes(1);
      expect(commentDataAccessMock.exists).toHaveBeenCalledTimes(1);
      expect(likeDataAccessMock.create).toHaveBeenCalledTimes(1);
      expect(commentDataAccessMock.addLikes).toHaveBeenCalledTimes(1);
    });

    it("should return 400 bad request when the comment is has been liked", async () => {
      const commentId = "1234";

      likeDataAccessMock.exists.mockResolvedValue(true);

      const response = await request(app)
        .put(`/comments/${commentId}/like`)
        .send();

      expect(response.status).toBe(400);
      expect(likeDataAccessMock.exists).toHaveBeenCalledTimes(1);
      expect(commentDataAccessMock.exists).not.toHaveBeenCalled();
      expect(likeDataAccessMock.create).not.toHaveBeenCalled();
      expect(commentDataAccessMock.addLikes).not.toHaveBeenCalled();
    });

    it("should return 400 bad request when the comment is not found", async () => {
      const commentId = "1234";

      likeDataAccessMock.exists.mockResolvedValue(false);
      commentDataAccessMock.exists.mockResolvedValue(false);

      const response = await request(app)
        .put(`/comments/${commentId}/like`)
        .send();

      expect(response.status).toBe(404);
      expect(likeDataAccessMock.exists).toHaveBeenCalledTimes(1);
      expect(commentDataAccessMock.exists).toHaveBeenCalledTimes(1);
      expect(likeDataAccessMock.create).not.toHaveBeenCalled();
      expect(commentDataAccessMock.addLikes).not.toHaveBeenCalled();
    });
  });

  describe("unlikeCommentController", () => {
    it("should return 200 OK", async () => {
      const commentId = "1234";

      likeDataAccessMock.exists.mockResolvedValue(true);

      const response = await request(app)
        .put(`/comments/${commentId}/unlike`)
        .send();

      expect(response.status).toBe(204);
      expect(likeDataAccessMock.exists).toHaveBeenCalledTimes(1);
      expect(likeDataAccessMock.delete).toHaveBeenCalledTimes(1);
      expect(commentDataAccessMock.addLikes).toHaveBeenCalledTimes(1);
    });

    it("should return 400 bad request when the comment is has not been liked", async () => {
      const commentId = "1234";

      likeDataAccessMock.exists.mockResolvedValue(false);

      const response = await request(app)
        .put(`/comments/${commentId}/unlike`)
        .send();

      expect(response.status).toBe(400);
      expect(likeDataAccessMock.exists).toHaveBeenCalledTimes(1);
      expect(commentDataAccessMock.exists).not.toHaveBeenCalled();
      expect(likeDataAccessMock.delete).not.toHaveBeenCalled();
      expect(commentDataAccessMock.addLikes).not.toHaveBeenCalled();
    });
  });
});
