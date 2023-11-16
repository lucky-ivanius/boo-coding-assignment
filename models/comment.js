const mongoose = require("mongoose");

const votingSchema = new mongoose.Schema(
  {
    mbti: String,
    enneagram: String,
    zodiac: String,
  },
  {
    id: false,
  }
);

const commentSchema = new mongoose.Schema(
  {
    profileId: {
      type: mongoose.Types.ObjectId,
      ref: "Profiles",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
    title: String,
    description: String,
    voting: votingSchema,
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comments", commentSchema);

module.exports = Comment;
