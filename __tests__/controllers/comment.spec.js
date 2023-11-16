const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const { toggleLikeCommentValidation } = require("../../validations/comment");
const { toggleLikeCommentController } = require("../../controllers/comment");

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

const app = express();
app.use(bodyParser.json());

// routes
app.put(
  "/comments/:commentId/like",
  authMiddlewareMock,
  toggleLikeCommentValidation,
  toggleLikeCommentController(commentDataAccessMock, likeDataAccessMock)
);

describe("Controller: Comment", () => {
  beforeEach(() => {
    commentDataAccessMock.create.mockReset();
    commentDataAccessMock.findByProfileId.mockReset();
    commentDataAccessMock.exists.mockReset();
    commentDataAccessMock.addLikes.mockReset();

    likeDataAccessMock.exists.mockReset();
    likeDataAccessMock.create.mockReset();
    likeDataAccessMock.delete.mockReset();
  });

  describe("likeCommentController", () => {
    it("should return 200 OK when the comment is not liked", async () => {
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

    it("should return 204 No Content when the comment is liked", async () => {
      const commentId = "1234";

      likeDataAccessMock.exists.mockResolvedValue(true);

      const response = await request(app)
        .put(`/comments/${commentId}/like`)
        .send();

      expect(response.status).toBe(204);
      expect(likeDataAccessMock.exists).toHaveBeenCalledTimes(1);
      expect(likeDataAccessMock.delete).toHaveBeenCalledTimes(1);
      expect(commentDataAccessMock.addLikes).toHaveBeenCalledTimes(1);
    });

    it("should return 404 not found when the comment is not found", async () => {
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
});
