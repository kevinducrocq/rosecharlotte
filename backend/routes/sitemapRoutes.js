import express from 'express';
import { SitemapStream, streamToPromise } from 'sitemap';
import zlib from 'zlib';
import dotenv from 'dotenv';
import Product from '../models/productModel.js';

dotenv.config();

const date = new Date().toISOString();
const sitemapRouter = express.Router();

let sitemap;

sitemapRouter.get('/sitemap.xml', async (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.header('Content-encoding', 'gzip');

  if (sitemap) return res.send(sitemap);
  try {
    // Fetching project records and mapping it
    // the desired URL pattern
    const data = await Product.find(),
      projects = data.map(({ slug }) => `/product/${slug}`),
      // Base url of our site
      smStream = new SitemapStream({ hostname: process.env.ROOT }),
      pipeline = smStream.pipe(zlib.createGzip());

    // Write project URL to the stream
    projects.forEach((item) =>
      smStream.write({
        url: item,
        lastmod: date,
        changefreq: 'daily',
        priority: 0.7,
      })
    );

    // Manually add all the other important URLs
    smStream.write({
      url: '/about',
      lastmod: date,
      changefreq: 'monthly',
      priority: 0.9,
    });
    smStream.write({
      url: '/contact',
      lastmod: date,
      changefreq: 'monthly',
      priority: 0.9,
    });

    // Cache the response
    streamToPromise(pipeline).then((sm) => (sitemap = sm));
    smStream.end();

    // Stream write the response
    pipeline.pipe(res).on('error', (e) => {
      throw e;
    });
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});

export default sitemapRouter;
