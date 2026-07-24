import { describe, expect, it } from 'vitest';
import { validateUrl } from '../src/utils/validateUrl.js';
import { AppError } from '../src/utils/errors.js';

describe('validateUrl', () => {
  it('rejects malformed or non-http(s) URLs before any fetch', () => {
    expect(() => validateUrl('not-a-url')).toThrowError(AppError);
    expect(() => validateUrl('ftp://example.com')).toThrowError(AppError);
  });
});
