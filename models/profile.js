const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  name: String,
  description: String,
  mbti: String,
  enneagram: String,
  variant: String,
  tritype: Number,
  socionics: String,
  sloan: String,
  psyche: String,
  temperaments: String,
  image: String,
});

const Profile = mongoose.model("Profiles", profileSchema);

module.exports = Profile;
