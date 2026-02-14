/**
 * Post-build prerendering script.
 * Generates route-specific HTML files with correct SEO meta tags
 * so that search engines see fully formed <title>, <meta>, canonical,
 * Open Graph, Twitter Card, and JSON-LD on the initial HTML response.
 *
 * Run after `vite build` via: node scripts/prerender.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const BASE_URL = 'https://wamelinkwebdesign.nl';
const SITE_NAME = 'Wamelink Webdesign';
const DEFAULT_IMAGE = 'https://storage.googleapis.com/wamelinkwebdesign/plusdak.png';

// Read the built index.html as template
const template = readFileSync(join(DIST, 'index.html'), 'utf-8');

// SEO data per route
const routes = [
  {
    path: '/website-laten-maken-amsterdam',
    title: 'Website laten maken in Amsterdam | Wamelink Webdesign',
    description: 'Website laten maken in Amsterdam? Wamelink Webdesign bouwt maatwerk websites die scoren in Google. Persoonlijk contact, razendsnelle oplevering. Vraag een gratis offerte aan.',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          name: 'Website laten maken Amsterdam',
          description: 'Professionele maatwerk website laten maken in Amsterdam. Responsive, SEO-geoptimaliseerd en gebouwd voor conversie.',
          provider: { '@type': 'ProfessionalService', name: 'Wamelink Webdesign', url: BASE_URL },
          areaServed: { '@type': 'City', name: 'Amsterdam' },
          serviceType: 'Web Design',
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'Website laten maken Amsterdam', item: `${BASE_URL}/website-laten-maken-amsterdam` },
          ],
        },
      ],
    },
  },
  {
    path: '/website-redesign-amsterdam',
    title: 'Website redesign Amsterdam | Vernieuw je website | Wamelink Webdesign',
    description: 'Website redesign in Amsterdam? Wamelink Webdesign vernieuwt je website met maatwerk design, snellere performance en betere SEO. Behoud je rankings. Vraag een gratis analyse aan.',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          name: 'Website redesign Amsterdam',
          description: 'Website redesign in Amsterdam. Vernieuw je website met maatwerk design, snellere performance en betere SEO.',
          provider: { '@type': 'ProfessionalService', name: 'Wamelink Webdesign', url: BASE_URL },
          areaServed: { '@type': 'City', name: 'Amsterdam' },
          serviceType: 'Website Redesign',
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'Website redesign Amsterdam', item: `${BASE_URL}/website-redesign-amsterdam` },
          ],
        },
      ],
    },
  },
  {
    path: '/webshop-laten-maken-amsterdam',
    title: 'Webshop laten maken Amsterdam | E-commerce | Wamelink Webdesign',
    description: 'Webshop laten maken in Amsterdam? Wamelink Webdesign bouwt maatwerk webshops die verkopen. Conversie-gericht design, alle betaalmethodes, SEO-geoptimaliseerd. Vraag een gratis offerte aan.',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          name: 'Webshop laten maken Amsterdam',
          description: 'Maatwerk webshop laten maken in Amsterdam. Conversie-gericht design, alle betaalmethodes en SEO-geoptimaliseerd.',
          provider: { '@type': 'ProfessionalService', name: 'Wamelink Webdesign', url: BASE_URL },
          areaServed: { '@type': 'City', name: 'Amsterdam' },
          serviceType: 'E-commerce Development',
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'Webshop laten maken Amsterdam', item: `${BASE_URL}/webshop-laten-maken-amsterdam` },
          ],
        },
      ],
    },
  },
  {
    path: '/app-laten-maken-amsterdam',
    title: 'App laten maken Amsterdam | App ontwikkeling | Wamelink Webdesign',
    description: 'App laten maken in Amsterdam? Wamelink Webdesign ontwikkelt maatwerk apps voor iOS en Android. Van concept tot App Store. Vraag een gratis offerte aan.',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          name: 'App laten maken Amsterdam',
          description: 'Maatwerk app development in Amsterdam. Native en cross-platform apps voor iOS en Android.',
          provider: { '@type': 'ProfessionalService', name: 'Wamelink Webdesign', url: BASE_URL },
          areaServed: { '@type': 'City', name: 'Amsterdam' },
          serviceType: 'Mobile App Development',
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'App laten maken Amsterdam', item: `${BASE_URL}/app-laten-maken-amsterdam` },
          ],
        },
      ],
    },
  },
  {
    path: '/blog',
    title: 'Blog | Wamelink Webdesign',
    description: 'Lees onze artikelen over webdesign, development, SEO en online groei. Praktische tips en inzichten van Wamelink Webdesign Amsterdam.',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          name: 'Blog - Wamelink Webdesign',
          description: 'Tips over webdesign, SEO en online groei voor MKB',
          url: `${BASE_URL}/blog`,
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
          ],
        },
      ],
    },
  },
  {
    path: '/blog/wordpress-vs-maatwerk-website',
    title: 'WordPress vs maatwerk website | Vergelijking 2026 | Wamelink Webdesign',
    description: 'WordPress of een maatwerk website? Ontdek de voor- en nadelen van beide opties en leer welke keuze het beste past bij jouw bedrijf en groeiverwachtingen.',
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          headline: 'WordPress vs maatwerk website: wat is beter voor jouw bedrijf?',
          description: 'WordPress of een maatwerk website? Ontdek de voor- en nadelen van beide opties en leer welke keuze het beste past bij jouw bedrijf en groeiverwachtingen.',
          datePublished: '2026-02-13',
          dateModified: '2026-02-13',
          author: { '@type': 'Person', name: 'Dennis Wamelink' },
          publisher: { '@type': 'Organization', name: 'Wamelink Webdesign', url: BASE_URL },
          mainEntityOfPage: `${BASE_URL}/blog/wordpress-vs-maatwerk-website`,
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
            { '@type': 'ListItem', position: 3, name: 'WordPress vs Maatwerk Website', item: `${BASE_URL}/blog/wordpress-vs-maatwerk-website` },
          ],
        },
      ],
    },
  },
  {
    path: '/blog/wat-kost-een-website-laten-maken',
    title: 'Wat kost een website laten maken? Prijzen 2026 | Wamelink Webdesign',
    description: 'Wat kost een website laten maken in 2026? Ontdek de prijzen voor een maatwerk website, webshop of redesign. Eerlijke vergelijking van kosten en wat je ervoor terugkrijgt.',
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          headline: 'Wat kost een website laten maken in 2026?',
          description: 'Wat kost een website laten maken in 2026? Ontdek de prijzen voor een maatwerk website, webshop of redesign.',
          datePublished: '2026-02-13',
          dateModified: '2026-02-13',
          author: { '@type': 'Person', name: 'Dennis Wamelink' },
          publisher: { '@type': 'Organization', name: 'Wamelink Webdesign', url: BASE_URL },
          mainEntityOfPage: `${BASE_URL}/blog/wat-kost-een-website-laten-maken`,
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
            { '@type': 'ListItem', position: 3, name: 'Wat kost een website laten maken?', item: `${BASE_URL}/blog/wat-kost-een-website-laten-maken` },
          ],
        },
      ],
    },
  },
  {
    path: '/blog/website-laten-maken-waar-op-letten',
    title: 'Website laten maken: waar op letten? Checklist 2026 | Wamelink Webdesign',
    description: 'Website laten maken maar geen idee waar je moet beginnen? Deze checklist helpt je de juiste keuzes te maken: van webdesigner kiezen tot techniek en SEO.',
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          headline: 'Website laten maken: waar moet je op letten?',
          description: 'Website laten maken maar geen idee waar je moet beginnen? Deze checklist helpt je de juiste keuzes te maken.',
          datePublished: '2026-02-13',
          dateModified: '2026-02-13',
          author: { '@type': 'Person', name: 'Dennis Wamelink' },
          publisher: { '@type': 'Organization', name: 'Wamelink Webdesign', url: BASE_URL },
          mainEntityOfPage: `${BASE_URL}/blog/website-laten-maken-waar-op-letten`,
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
            { '@type': 'ListItem', position: 3, name: 'Website laten maken: waar op letten?', item: `${BASE_URL}/blog/website-laten-maken-waar-op-letten` },
          ],
        },
      ],
    },
  },
  {
    path: '/blog/seo-tips-voor-kleine-bedrijven',
    title: '10 SEO-tips voor kleine bedrijven | Hoger in Google 2026 | Wamelink Webdesign',
    description: 'Wil je hoger scoren in Google met je kleine bedrijf? Deze 10 praktische SEO tips helpen je meer bezoekers en klanten te krijgen via zoekmachines.',
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          headline: '10 SEO-tips die elk klein bedrijf moet weten',
          description: 'Wil je hoger scoren in Google met je kleine bedrijf? Deze 10 praktische SEO tips helpen je meer bezoekers en klanten te krijgen.',
          datePublished: '2026-02-13',
          dateModified: '2026-02-13',
          author: { '@type': 'Person', name: 'Dennis Wamelink' },
          publisher: { '@type': 'Organization', name: 'Wamelink Webdesign', url: BASE_URL },
          mainEntityOfPage: `${BASE_URL}/blog/seo-tips-voor-kleine-bedrijven`,
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
            { '@type': 'ListItem', position: 3, name: '10 SEO-tips voor kleine bedrijven', item: `${BASE_URL}/blog/seo-tips-voor-kleine-bedrijven` },
          ],
        },
      ],
    },
  },
  {
    path: '/terms',
    title: 'Algemene Voorwaarden | Wamelink Webdesign',
    description: 'Lees de algemene voorwaarden van Wamelink Webdesign. Transparante afspraken over onze dienstverlening.',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Algemene Voorwaarden',
      url: `${BASE_URL}/terms`,
    },
  },
  {
    path: '/privacy',
    title: 'Privacybeleid | Wamelink Webdesign',
    description: 'Lees het privacybeleid van Wamelink Webdesign. Hoe wij omgaan met je persoonsgegevens conform de AVG.',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Privacybeleid',
      url: `${BASE_URL}/privacy`,
    },
  },
];

/**
 * Replace meta tag content in the HTML string.
 */
function replaceMeta(html, attr, name, content) {
  const regex = new RegExp(`(<meta\\s+${attr}="${name}"\\s+content=")([^"]*)(")`, 'i');
  if (regex.test(html)) {
    return html.replace(regex, `$1${content}$3`);
  }
  // Also try the reversed attribute order (content before name)
  const regexAlt = new RegExp(`(<meta\\s+content=")([^"]*)(\"\\s+${attr}="${name}")`, 'i');
  if (regexAlt.test(html)) {
    return html.replace(regexAlt, `$1${content}$3`);
  }
  return html;
}

function generateHTML(route) {
  let html = template;
  const canonical = `${BASE_URL}${route.path}`;

  // Replace <title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${route.title}</title>`);

  // Replace meta name="title"
  html = replaceMeta(html, 'name', 'title', route.title);

  // Replace meta name="description"
  html = replaceMeta(html, 'name', 'description', route.description);

  // Replace canonical
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${canonical}" />`
  );

  // Replace Open Graph tags
  html = replaceMeta(html, 'property', 'og:title', route.title);
  html = replaceMeta(html, 'property', 'og:description', route.description);
  html = replaceMeta(html, 'property', 'og:url', canonical);
  html = replaceMeta(html, 'property', 'og:type', route.ogType);

  // Replace Twitter tags
  html = replaceMeta(html, 'property', 'twitter:title', route.title);
  html = replaceMeta(html, 'property', 'twitter:description', route.description);
  html = replaceMeta(html, 'property', 'twitter:url', canonical);

  // Inject page-specific JSON-LD before closing </head>
  if (route.jsonLd) {
    const jsonLdScript = `\n    <!-- Page-specific structured data -->\n    <script type="application/ld+json">\n    ${JSON.stringify(route.jsonLd, null, 2).split('\n').join('\n    ')}\n    </script>\n`;
    html = html.replace('</head>', `${jsonLdScript}  </head>`);
  }

  return html;
}

// Generate prerendered HTML for each route
let count = 0;
for (const route of routes) {
  const html = generateHTML(route);
  const dir = join(DIST, route.path);

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  writeFileSync(join(dir, 'index.html'), html);
  count++;
}

console.log(`Prerendered ${count} routes with SEO meta tags.`);
