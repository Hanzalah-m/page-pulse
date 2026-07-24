import axios from 'axios';
import { env } from '../config/env.js';
import { AppError } from '../utils/errors.js';
import { validateUrl } from '../utils/validateUrl.js';
import { ssrfGuard } from '../utils/ssrfGuard.js';

export const fetchPage = async (inputUrl) => {
  const normalizedUrl = validateUrl(inputUrl);
  await ssrfGuard(normalizedUrl);

  const controller = new AbortController();
  const startedAt = Date.now();
  const timeout = setTimeout(() => controller.abort(), env.requestTimeoutMs);

  try {
    const response = await axios.get(normalizedUrl, {
      responseType: 'text',
      timeout: env.requestTimeoutMs,
      signal: controller.signal,
      maxRedirects: 5,
      headers: {
        'User-Agent': 'PagePulse/1.0'
      }
    });

    const contentType = response.headers['content-type'] || '';
    if (!contentType.toLowerCase().includes('text/html')) {
      throw new AppError('UNSUPPORTED_CONTENT_TYPE', 'The target URL did not return HTML content.', 415);
    }

    return {
      url: response.request?.res?.responseUrl || normalizedUrl,
      status: response.status,
      responseTime: Date.now() - startedAt,
      body: response.data
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new AppError('REQUEST_TIMEOUT', 'The request timed out.', 504);
    }

    if (error.response?.status === 404) {
      throw new AppError('UNREACHABLE', 'The target URL could not be reached.', 404);
    }

    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED' || error.code === 'EAI_AGAIN') {
      throw new AppError('DNS_ERROR', 'The target host could not be resolved.', 502);
    }

    if (error.code === 'ECONNABORTED') {
      throw new AppError('REQUEST_TIMEOUT', 'The request timed out.', 504);
    }

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError('UNREACHABLE', 'The target URL could not be reached.', 502);
  } finally {
    clearTimeout(timeout);
  }
};
