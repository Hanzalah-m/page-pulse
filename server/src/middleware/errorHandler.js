import { createErrorResponse } from '../utils/errors.js';

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const responseBody = createErrorResponse(err);
  res.status(statusCode).json(responseBody);
};
