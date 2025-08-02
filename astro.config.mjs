// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import compressor from 'astro-compressor';
import critters from 'astro-critters';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://nachosizle.github.io',
  base: '/',
  integrations: [sitemap(), compressor(), critters()],
  build: {
    inlineStylesheets: "always",
  },

  image: {
     remotePatterns: [
      { protocol: 'https', hostname: 'picsum.dev', pathname: '/**' },
    ],
  },

  cacheDir: '.astro-cache',

  vite: {
    plugins: [tailwindcss()]
  }
});