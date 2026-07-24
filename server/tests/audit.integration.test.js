import request from 'supertest';
import axios from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';

vi.mock('axios');

describe('POST /api/audit', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('handles non-html content types without throwing', async () => {
    axios.get.mockResolvedValue({
      status: 200,
      headers: { 'content-type': 'application/pdf' },
      data: 'pdf payload',
      request: { res: { responseUrl: 'https://example.com/file.pdf' } }
    });

    const app = createApp();
    const response = await request(app)
      .post('/api/audit')
      .send({ url: 'https://example.com/file.pdf' });

    expect(response.status).toBe(415);
    expect(response.body).toEqual({
      error: 'UNSUPPORTED_CONTENT_TYPE',
      message: 'The target URL did not return HTML content.'
    });
  });
});
