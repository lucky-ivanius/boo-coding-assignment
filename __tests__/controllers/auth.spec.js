const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const { registerValidation } = require("../../validations/auth");
const {
  registerController,
  loginController,
} = require("../../controllers/auth");

const userDataAccessMock = {
  exists: jest.fn(),
  create: jest.fn(),
  findByName: jest.fn(),
};

const app = express();
app.use(bodyParser.json());

// routes
app.post(
  "/register",
  registerValidation,
  registerController(userDataAccessMock)
);
app.post("/login", loginController(userDataAccessMock));

describe("Controller: Auth", () => {
  beforeEach(() => {
    userDataAccessMock.create.mockReset();
    userDataAccessMock.exists.mockReset();
    userDataAccessMock.findByName.mockReset();
  });

  describe("registerController", () => {
    it("should return 201 Created when registration is successful", async () => {
      userDataAccessMock.exists.mockResolvedValue(false);
      userDataAccessMock.create.mockResolvedValue();

      const response = await request(app)
        .post("/register")
        .send({ name: "testUser" });

      expect(response.status).toBe(201);
      expect(userDataAccessMock.exists).toHaveBeenCalledTimes(1);
      expect(userDataAccessMock.create).toHaveBeenCalledTimes(1);
    });

    it("should return 400 Bad Request when validation fails", async () => {
      const response = await request(app).post("/register").send({});

      expect(response.status).toBe(400);
      expect(userDataAccessMock.exists).not.toHaveBeenCalled();
      expect(userDataAccessMock.create).not.toHaveBeenCalled();
    });

    it("should return 400 Bad Request when user already exists", async () => {
      userDataAccessMock.exists.mockResolvedValue(true);

      const response = await request(app)
        .post("/register")
        .send({ name: "testUser" });

      expect(response.status).toBe(400);
      expect(userDataAccessMock.exists).toHaveBeenCalledTimes(1);
      expect(userDataAccessMock.create).not.toHaveBeenCalled();
    });
  });

  describe("loginController", () => {
    it("should return 200 OK with a token when login is successful", async () => {
      userDataAccessMock.findByName.mockResolvedValue({
        _id: "123",
        name: "testUser",
      });

      const response = await request(app)
        .post("/login")
        .send({ name: "testUser" });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
      expect(userDataAccessMock.findByName).toHaveBeenCalledTimes(1);
    });

    it("should return 400 Bad Request when the user is not found", async () => {
      userDataAccessMock.findByName.mockResolvedValue(null);

      const response = await request(app)
        .post("/login")
        .send({ name: "nonexistentUser" });

      expect(response.status).toBe(400);
      expect(userDataAccessMock.findByName).toHaveBeenCalledTimes(1);
    });
  });
});
