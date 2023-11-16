"use strict";

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./db");

const profilePageRoutes = require("./routes/page/profile");

const authApiRoutes = require("./routes/api/auth");
const profileApiRoutes = require("./routes/api/profile");

const swaggerDocsRoutes = require("./routes/docs/swagger");

const seed = require("./seed");

const startServer = async () => {
  await connectDB();
  // Seed after connect to the memory database
  await seed();

  // set the view engine to ejs
  app.set("view engine", "ejs");

  app
    .use(cors())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(morgan("dev"));

  // page routes
  app.use("/profile", profilePageRoutes());

  // api routes
  app.use("/api/auth", authApiRoutes());
  app.use("/api/profiles", profileApiRoutes());

  // doc routes
  app.use("/docs", swaggerDocsRoutes());

  // start server
  app.listen(port);
  console.log("Express started. Listening on %s", port);
};

startServer();
