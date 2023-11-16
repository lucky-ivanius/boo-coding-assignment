const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  commentId: {
    type: mongoose.Types.ObjectId,
    ref: "Comments",
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
  },
});

const Like = mongoose.model("Likes", likeSchema);

module.exports = Like;
