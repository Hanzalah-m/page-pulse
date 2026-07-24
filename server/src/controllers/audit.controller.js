import { fetchPage } from '../services/fetchPage.js';
import { parseHtml } from '../services/parseHtml.js';

export const auditController = async (req, res, next) => {
  try {
    const { url } = req.body || {};
    const page = await fetchPage(url);
    const parsed = parseHtml(page.body);

    res.json({
      url: page.url,
      status: page.status,
      responseTime: page.responseTime,
      title: parsed.title,
      metaDescription: parsed.metaDescription,
      h1Count: parsed.h1Count,
      imagesMissingAlt: parsed.imagesMissingAlt,
      wordCount: parsed.wordCount
    });
  } catch (error) {
    next(error);
  }
};
