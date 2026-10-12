import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://monfarmexperience.it',
  output: 'static',
  adapter: vercel(),
  build: {
    assets: '_assets',
  },
});
