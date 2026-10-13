import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://monfarmexperience.it',
  output: 'static',
  integrations: [sitemap()],
  security: {
    // Il controllo dell'origine è fatto in src/pages/api/contact.ts:
    // quello integrato blocca ogni invio dietro il proxy di Vercel (403).
    checkOrigin: false,
  },
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  build: {
    assets: '_assets',
  },
});
