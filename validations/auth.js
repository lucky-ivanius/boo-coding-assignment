const { z } = require("zod");
const httpResponse = require("../utils/http-response");

const registerValidationSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Name must be a string",
      required_error: "Name is required",
    })
    .min(1, "Name must have at least 1")
    .max(32, "Name must not have more than 32 characters"),
});

const registerValidation = async (req, res, next) => {
  const result = registerValidationSchema.safeParse(req.body);

  if (!result.success)
    return httpResponse.badRequest(res, result.error.issues.at(0).message);

  req.validatedRequestData = result.data;

  next();
};

module.exports = { registerValidation };
