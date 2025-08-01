// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://nachosizle.github.io',
  base: '/portfolio',
  build: {
    inlineStylesheets: "always",
  },
  image: {
     remotePatterns: [
      { protocol: 'https', hostname: 'picsum.dev', pathname: '/**' },
    ],
  },
  cacheDir: '.astro-cache'
});