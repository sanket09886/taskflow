import { validationResult } from "express-validator";
import { ApiError } from "../utils/errors.js";

export const validate = (req, _res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const message = result
    .array()
    .map((error) => `${error.path}: ${error.msg}`)
    .join(", ");
  next(new ApiError(400, message));
};
