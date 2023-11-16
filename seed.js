const Profile = require("./models/profile");
const User = require("./models/user");
const Comment = require("./models/comment");

module.exports = async () => {
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

  const users = [
    {
      name: "Admin",
    },
  ];

  await Profile.insertMany(profiles);
  await User.insertMany(users);

  const user = await User.findOne({ name: "Admin" }, {}, { lean: true });
  const profile = await Profile.findOne(
    { name: "A Martinez" },
    {},
    { lean: true }
  );

  const comments = [
    {
      userId: user._id,
      profileId: profile._id,
      title: "test",
      description: "test",
      voting: {
        mbti: "INFP",
        enneagram: "9w1",
        zodiac: "Leo",
      },
      likes: 10,
    },
    {
      userId: user._id,
      profileId: profile._id,
      title: "test",
      description: "test",
      voting: {
        mbti: "INTP",
        enneagram: "9w1",
        zodiac: "Aquarius",
      },
      likes: 17,
    },
  ];

  await Comment.insertMany(comments);
};
