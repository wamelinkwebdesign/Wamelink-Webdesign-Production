import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonical: string;
  ogType?: string;
  jsonLd?: Record<string, unknown>;
}

const BASE_URL = 'https://wamelinkwebdesign.nl';
const SITE_NAME = 'Wamelink Webdesign';
const DEFAULT_IMAGE = 'https://storage.googleapis.com/wamelinkwebdesign/plusdak.png';
const DEFAULT_TITLE = 'Website laten maken Amsterdam | Wamelink Webdesign';

function setMetaTag(property: string, content: string, isProperty = false) {
  const attr = isProperty ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.href = href;
}

function setJsonLd(id: string, data: Record<string, unknown>) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.setAttribute('type', 'application/ld+json');
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function removeJsonLd(id: string) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

export function useSEO({ title, description, canonical, ogType = 'website', jsonLd }: SEOProps) {
  // Scroll to top only on mount (page navigation), not on every re-render
  useEffect(() => {
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    document.title = title;

    const fullCanonical = canonical.startsWith('http') ? canonical : `${BASE_URL}${canonical}`;

    // Standard meta
    setMetaTag('description', description);

    // Canonical
    setCanonical(fullCanonical);

    // Open Graph
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:url', fullCanonical, true);
    setMetaTag('og:type', ogType, true);
    setMetaTag('og:image', DEFAULT_IMAGE, true);
    setMetaTag('og:locale', 'nl_NL', true);
    setMetaTag('og:site_name', SITE_NAME, true);

    // Twitter
    setMetaTag('twitter:card', 'summary_large_image', true);
    setMetaTag('twitter:title', title, true);
    setMetaTag('twitter:description', description, true);
    setMetaTag('twitter:url', fullCanonical, true);
    setMetaTag('twitter:image', DEFAULT_IMAGE, true);

    // JSON-LD
    if (jsonLd) {
      setJsonLd('page-jsonld', { '@context': 'https://schema.org', ...jsonLd });
    }

    return () => {
      document.title = DEFAULT_TITLE;
      setCanonical(`${BASE_URL}/`);
      setMetaTag('og:url', `${BASE_URL}/`, true);
      setMetaTag('og:title', DEFAULT_TITLE, true);
      setMetaTag('twitter:url', `${BASE_URL}/`, true);
      setMetaTag('twitter:title', DEFAULT_TITLE, true);
      removeJsonLd('page-jsonld');
    };
  }, [title, description, canonical, ogType, jsonLd]);
}
