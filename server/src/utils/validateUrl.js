import { URL } from 'url';
import { AppError } from './errors.js';

export const validateUrl = (input) => {
  if (typeof input !== 'string' || !input.trim()) {
    throw new AppError('INVALID_URL', 'A valid URL is required.', 400);
  }

  let parsed;
  try {
    parsed = new URL(input);
  } catch {
    throw new AppError('INVALID_URL', 'The provided URL is malformed.', 400);
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new AppError('INVALID_URL', 'Only http and https URLs are supported.', 400);
  }

  return parsed.toString();
};
