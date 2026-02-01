import { MetadataRoute } from 'next';

// Base URL - Update this when deploying to production
const BASE_URL = 'https://doddapaneni-group.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/about',
    '/services',
    '/contact',
    '/companies/dealsmedi',
    '/companies/dlsin',
    '/companies/janatha-mirror'
  ];

  const locales = ['en', 'te', 'hi', 'es'];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  routes.forEach((route) => {
    locales.forEach((locale) => {
      // Default locale (en) is served at root for non-locale paths if configured,
      // but next-intl usually handles prefixes. 
      // Assuming structure is always /locale/route or /route (for default)
      
      // We'll generate explicit paths for all locales to be safe and thorough
      const url = `${BASE_URL}/${locale}${route}`;
      
      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
      });
    });
  });

  return sitemapEntries;
}
