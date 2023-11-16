"use strict";

const express = require("express");
const router = express.Router();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../../docs/swagger.json");

module.exports = function () {
  router.use("/", swaggerUi.serve);
  router.get("/", swaggerUi.setup(swaggerDocument));

  return router;
};
