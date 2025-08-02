// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import compressor from 'astro-compressor';
import critters from 'astro-critters';
import tailwindcss from '@tailwindcss/vite';

import db from '@astrojs/db';

export default defineConfig({
  site: 'https://nachosizle.github.io',
  base: '/',
  integrations: [sitemap(), compressor(), critters(), db()],
  build: {
    inlineStylesheets: "always",
  },

  image: {
     remotePatterns: [
      { protocol: 'https', hostname: 'raw.githubusercontent.com', pathname: '/PokeAPI/sprites/master/sprites/**' },
    ],
  },

  cacheDir: '.astro-cache',

  vite: {
    plugins: [tailwindcss()]
  }
});