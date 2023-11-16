const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  SECRET_KEY: process.env.JWT_SECRET_KEY,
};
