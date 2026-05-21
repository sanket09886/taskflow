export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const sendSuccess = (res, data = null, message = "Success", statusCode = 200) => {
  res.status(statusCode).json({ success: true, data, message });
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const notFound = (resource = "Resource") => new ApiError(404, `${resource} not found`);
