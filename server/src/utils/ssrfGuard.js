import { URL } from 'url';
import dns from 'dns';
import { AppError } from './errors.js';

const isPrivateIp = (ip) => {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part) || part < 0 || part > 255)) {
    return false;
  }

  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 169 && b === 254) return true;
  return false;
};

export const ssrfGuard = async (url) => {
  const parsed = new URL(url);
  const hostname = parsed.hostname.toLowerCase();

  if (['localhost', '127.0.0.1'].includes(hostname)) {
    throw new AppError('INVALID_URL', 'Localhost URLs are not allowed.', 400);
  }

  if (hostname.startsWith('::ffff:')) {
    throw new AppError('INVALID_URL', 'Loopback addresses are not allowed.', 400);
  }

  if (hostname === '0.0.0.0') {
    throw new AppError('INVALID_URL', 'Reserved addresses are not allowed.', 400);
  }

  try {
    const result = await new Promise((resolve, reject) => {
      dns.lookup(hostname, { all: false }, (err, address) => {
        if (err) reject(err);
        else resolve(address);
      });
    });

    if (typeof result === 'string' && isPrivateIp(result)) {
      throw new AppError('INVALID_URL', 'Private network addresses are not allowed.', 400);
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('DNS_ERROR', 'The target host could not be resolved.', 502);
  }

  return parsed;
};
