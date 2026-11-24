import { Router } from 'express';
import { pool } from '../config/db';

const router = Router();

router.get('/sitemap.xml', async (req, res) => {
  try {
    const host = (req.headers['x-forwarded-host'] || req.headers.host || '') as string;
    const isOriginalNg = host.includes('haiflytrapng.com');
    const baseUrl = isOriginalNg ? 'https://haiflytrapng.com' : 'https://haiflytrap.com';

    // Fetch blogs and products
    const [blogsRes, productsRes] = await Promise.all([
      pool.query('SELECT slug, updated_at FROM blogs'),
      pool.query('SELECT id, created_at FROM products'),
    ]);

    const blogs = blogsRes.rows || [];
    const products = productsRes.rows || [];

    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/shop', priority: '0.9', changefreq: 'daily' },
      { url: '/blog', priority: '0.8', changefreq: 'daily' },
      { url: '/reviews', priority: '0.7', changefreq: 'weekly' },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Static pages
    staticPages.forEach((page) => {
      xml += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });

    // Blog posts
    blogs.forEach((post: any) => {
      xml += `
  <url>
    <loc>${baseUrl}/blog/${post.slug || post.id}</loc>
    <lastmod>${new Date(post.updated_at || Date.now()).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    // Products
    products.forEach((product: any) => {
      xml += `
  <url>
    <loc>${baseUrl}/product/${product.id}</loc>
    <lastmod>${new Date(product.created_at || Date.now()).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    xml += '\n</urlset>';

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Sitemap error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

export default router;
