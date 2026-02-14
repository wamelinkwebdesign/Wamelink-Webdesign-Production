import type { VercelRequest, VercelResponse } from '@vercel/node';

interface BlogPostMeta {
  slug: string;
  date: string;
}

// Blog posts - kept in sync with data/blogPosts.ts
// When adding new blog posts, add their slug and publication date here.
const blogPosts: BlogPostMeta[] = [
  { slug: 'wordpress-vs-maatwerk-website', date: '2026-02-13' },
  { slug: 'wat-kost-een-website-laten-maken', date: '2026-02-13' },
  { slug: 'website-laten-maken-waar-op-letten', date: '2026-02-13' },
  { slug: 'seo-tips-voor-kleine-bedrijven', date: '2026-02-13' },
];

const staticPages = [
  { loc: 'https://wamelinkwebdesign.nl/', priority: '1.0', changefreq: 'weekly', lastmod: '2026-02-13' },
  { loc: 'https://wamelinkwebdesign.nl/website-laten-maken-amsterdam', priority: '0.9', changefreq: 'monthly', lastmod: '2026-02-13' },
  { loc: 'https://wamelinkwebdesign.nl/website-redesign-amsterdam', priority: '0.9', changefreq: 'monthly', lastmod: '2026-02-13' },
  { loc: 'https://wamelinkwebdesign.nl/app-laten-maken-amsterdam', priority: '0.9', changefreq: 'monthly', lastmod: '2026-02-13' },
  { loc: 'https://wamelinkwebdesign.nl/webshop-laten-maken-amsterdam', priority: '0.9', changefreq: 'monthly', lastmod: '2026-02-13' },
  { loc: 'https://wamelinkwebdesign.nl/blog', priority: '0.8', changefreq: 'weekly', lastmod: '2026-02-13' },
  { loc: 'https://wamelinkwebdesign.nl/terms', priority: '0.3', changefreq: 'yearly', lastmod: '2026-02-11' },
  { loc: 'https://wamelinkwebdesign.nl/privacy', priority: '0.3', changefreq: 'yearly', lastmod: '2026-02-11' },
];

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const blogPages = blogPosts.map((post) => ({
    loc: `https://wamelinkwebdesign.nl/blog/${post.slug}`,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: post.date,
  }));

  const allPages = [...staticPages, ...blogPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (p) => `  <url>
    <loc>${p.loc}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.status(200).send(xml);
}
