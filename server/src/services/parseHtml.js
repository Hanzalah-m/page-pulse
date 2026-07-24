import * as cheerio from 'cheerio';

export const parseHtml = (html) => {
  const $ = cheerio.load(html || '');

  const title = $('title').first().text().trim() || null;
  const metaDescription = $('meta[name="description"]').attr('content')?.trim() || null;
  const h1Count = $('h1').length;
  const imagesMissingAlt = $('img').filter((_, el) => !$(el).attr('alt')).length;
  const wordCount = $('body')
    .text()
    .replace(/\s+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return {
    title,
    metaDescription,
    h1Count,
    imagesMissingAlt,
    wordCount
  };
};
