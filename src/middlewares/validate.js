import { ca } from "zod/v4/locales";

export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      error: "Validation error",
      details: error.errors.map((e) => ({
        path: e.path[0],
        message: e.message,
      })),
    });
  }
};
