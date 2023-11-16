const { z } = require("zod");
const httpResponse = require("../utils/http-response");

const mbtiOptions = [
  "INFP",
  "INFJ",
  "ENFP",
  "ENFJ",
  "INTJ",
  "INTP",
  "ENTP",
  "ENTJ",
  "ISFP",
  "ISFJ",
  "ESFP",
  "ESFJ",
  "ISTP",
  "ISTJ",
  "ESTP",
  "ESTJ",
];
const enneagramOptions = [
  "1w9",
  "2w1",
  "2w3",
  "3w2",
  "3w4",
  "4w3",
  "4w5",
  "5w4",
  "5w6",
  "6w5",
  "6w7",
  "7w6",
  "7w8",
  "8w7",
  "8w9",
  "9w1",
  "9w8",
];
const socionicsOptions = [
  "SEE",
  "LII",
  "IEE",
  "EIE",
  "SLE",
  "LIE",
  "ESI",
  "LSI",
  "ILI",
  "ESE",
  "LSE",
  "IEI",
  "SEI",
  "SLI",
  "ESI",
  "IEE",
  "SEE",
  "ILI",
  "LII",
  "EIE",
];
const sloanOptions = ["RCOAI", "RCOAN", "RCOEN", "RCOIN", "RCOAR", "RCOIR"];
const psycheOptions = [
  "FEVL",
  "FEVR",
  "FIVE",
  "FLVE",
  "FLVN",
  "FONE",
  "FLVE",
  "SEVL",
  "SEVR",
  "SIXE",
  "SIXN",
  "SEVE",
  "FEVE",
];
const variantOptions = ["sp/so", "so/sp", "sp/sx", "sx/sp", "so/sx", "sx/so"];
const temperamentsOptions = [
  "Sanguine",
  "Choleric",
  "Phlegmatic",
  "Melancholic",
];
const zodiacOptions = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

const commentSortOptions = ["recent", "best"];
const commentSortMapping = {
  recent: "createdAt",
  best: "likes",
};

const commentFilterTypeOptions = ["mbti", "enneagram", "zodiac"];

const createProfileValidationSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Name must be a string",
      required_error: "Name is required",
    })
    .min(1, "Name must have at least 1")
    .max(100, "Name must not have more than 100 characters"),
  description: z
    .string({
      invalid_type_error: "Description must be a string",
    })
    .max(500, "Description must not have more than 500 characters")
    .optional(),
  mbti: z.enum(mbtiOptions, {
    errorMap: (issue, ctx) => ({
      message: !!ctx.data ? "Invalid MBTI" : "MBTI is required",
    }),
  }),
  enneagram: z.enum(enneagramOptions, {
    errorMap: (issue, ctx) => ({
      message: !!ctx.data ? "Invalid Enneagram" : "Enneagram is required",
    }),
  }),
  variant: z.enum(variantOptions, {
    errorMap: (issue, ctx) => ({
      message: !!ctx.data
        ? "Invalid Instinctual Variant"
        : "Instinctual Variant is required",
    }),
  }),
  tritype: z
    .number({
      invalid_type_error: "Tritype must be a number",
      required_error: "Tritype is required",
    })
    .min(0, { message: "Tritype must not be a negative number" }),
  socionics: z.enum(socionicsOptions, {
    errorMap: (issue, ctx) => ({
      message: !!ctx.data ? "Invalid Socionics" : "Socionics is required",
    }),
  }),
  sloan: z.enum(sloanOptions, {
    errorMap: (issue, ctx) => ({
      message: !!ctx.data ? "Invalid Big 5 Sloan" : "Big 5 Sloan is required",
    }),
  }),
  psyche: z.enum(psycheOptions, {
    errorMap: (issue, ctx) => ({
      message: !!ctx.data
        ? "Invalid Attitudinal Psyche"
        : "Attitudinal Psyche is required",
    }),
  }),
  temperaments: z.enum(temperamentsOptions, {
    errorMap: (issue, ctx) => ({
      message: !!ctx.data ? "Invalid Temperament" : "Temperament is required",
    }),
  }),
  image: z
    .string({
      invalid_type_error: "Image must be a string",
    })
    .url({ message: "Invalid Image URL" })
    .optional(),
});

const createProfileCommentValidationSchema = z
  .object(
    {
      profileId: z.string({
        errorMap: () => ({ message: "Invalid Profile" }),
      }),
      userId: z.string({
        errorMap: () => ({ message: "Invalid User" }),
      }),
      title: z.string().optional(),
      description: z.string().optional(),
      voting: z.object({
        mbti: z.enum(mbtiOptions, {
          errorMap: (issue, ctx) => ({
            message: !!ctx.data ? "Invalid MBTI" : "MBTI is required",
          }),
        }),
        enneagram: z.enum(enneagramOptions, {
          errorMap: (issue, ctx) => ({
            message: !!ctx.data ? "Invalid Enneagram" : "Enneagram is required",
          }),
        }),
        zodiac: z.enum(zodiacOptions, {
          errorMap: (issue, ctx) => ({
            message: !!ctx.data ? "Invalid Zodiac" : "Zodiac is required",
          }),
        }),
      }),
    },
    {
      invalid_type_error: "Invalid Voting",
      required_error: "Voting is required",
    }
  )
  .refine(
    (data) => data.title || data.description,
    "Either title or description is required"
  );

const getProfileCommentsValidationSchema = z.object({
  profileId: z.string({
    errorMap: () => ({ message: "Invalid Profile" }),
  }),
  sort: z
    .enum(commentSortOptions, {
      errorMap: (issue, ctx) => ({
        message: "Invalid sort type",
      }),
    })
    .default(commentSortOptions[0])
    .transform((arg, ctx) => {
      return commentSortMapping[arg];
    }),
  filterType: z
    .enum(commentFilterTypeOptions, {
      errorMap: (issue, ctx) => ({
        message: "Invalid filter type",
      }),
    })
    .optional(),
  filterValue: z.string().optional(),
});

const toggleLikeCommentValidationSchema = z.object({
  commentId: z.string({
    errorMap: () => ({ message: "Invalid Comment" }),
  }),
  userId: z.string({
    errorMap: () => ({ message: "Invalid User" }),
  }),
});

const createProfileValidation = async (req, res, next) => {
  const result = createProfileValidationSchema.safeParse(req.body);

  if (!result.success)
    return httpResponse.badRequest(res, result.error.issues.at(0).message);

  req.validatedRequestData = result.data;

  next();
};

const createProfileCommentValidation = async (req, res, next) => {
  const result = createProfileCommentValidationSchema.safeParse({
    profileId: req.params.profileId,
    userId: req.auth?.userId,
    title: req.body.title,
    description: req.body.description,
    voting: req.body.voting,
  });

  if (!result.success) {
    return httpResponse.badRequest(res, result.error.issues.at(0).message);
  }

  req.validatedRequestData = result.data;

  next();
};

const getProfileCommentsValidation = async (req, res, next) => {
  const result = getProfileCommentsValidationSchema.safeParse({
    profileId: req.params.profileId,
    sort: req.query.sort,
    filterType: req.query.filterType,
    filterValue: req.query.filterValue,
  });

  if (!result.success) {
    return httpResponse.badRequest(res, result.error.issues.at(0).message);
  }

  req.validatedRequestData = result.data;

  next();
};

const toggleLikeCommentValidation = async (req, res, next) => {
  const result = toggleLikeCommentValidationSchema.safeParse({
    commentId: req.params.commentId,
    userId: req.auth?.userId,
  });

  if (!result.success) {
    return httpResponse.badRequest(res, result.error.issues.at(0).message);
  }

  req.validatedRequestData = result.data;

  next();
};

module.exports = {
  createProfileValidation,
  createProfileCommentValidation,
  getProfileCommentsValidation,
  toggleLikeCommentValidation,
};
