import { readFileSync } from 'fs';
import { join } from 'path';
import { describe, expect, it } from 'vitest';
import { parseHtml } from '../src/services/parseHtml.js';

describe('parseHtml', () => {
  it('returns the expected report values for fixture HTML', () => {
    const html = readFileSync(join(process.cwd(), 'tests/fixtures/sample.html'), 'utf8');
    const report = parseHtml(html);

    expect(report.title).toBe('Sample Page');
    expect(report.metaDescription).toBe('This is a sample description.');
    expect(report.h1Count).toBe(1);
    expect(report.imagesMissingAlt).toBe(2);
    expect(report.wordCount).toBeGreaterThan(0);
  });
});
