// Configuración de Astro para PokeDB
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import compressor from 'astro-compressor';
import critters from 'astro-critters';
import vercel from '@astrojs/vercel';
import solid from '@astrojs/solid-js';

import db from '@astrojs/db';

export default defineConfig({
  site: 'https://pokedb-astro.vercel.app', // 🌐 URL de producción en Vercel
  base: '/',
  output: 'server', // 🚀 Configuración SSR
  adapter: vercel(), // 🌐 Vercel adapter con zero-config
  integrations: [sitemap(), compressor(), critters(), db(), solid()],
  build: {
    inlineStylesheets: "always",
  },

  image: {
     remotePatterns: [
      { protocol: 'https', hostname: 'raw.githubusercontent.com', pathname: '/PokeAPI/sprites/master/sprites/*' },
    ],
  },

  cacheDir: '.astro-cache',

  vite: {}
});
