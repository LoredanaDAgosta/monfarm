import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://monfarmexperience.it',
  output: 'static',
  integrations: [sitemap()],
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  build: {
    assets: '_assets',
  },
});
