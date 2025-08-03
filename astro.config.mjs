// Configuración de Astro para PokeDB
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import compressor from 'astro-compressor';
import critters from 'astro-critters';
import tailwindcss from '@tailwindcss/vite';
import netlify from '@astrojs/netlify';

import db from '@astrojs/db';

export default defineConfig({
  site: 'https://pokedb-astro.netlify.app', // 🌐 URL de producción en Netlify
  base: '/',
  output: 'server', // 🚀 Volvemos a server pero con configuración simplificada
  adapter: netlify(), // 🌐 Netlify adapter sin configuraciones extra
  integrations: [sitemap(), compressor(), critters(), db()],
  build: {
    inlineStylesheets: "always",
  },

  image: {
     remotePatterns: [
      { protocol: 'https', hostname: 'raw.githubusercontent.com', pathname: '/PokeAPI/sprites/master/sprites/*' },
    ],
  },

  cacheDir: '.astro-cache',

  vite: {
    plugins: [tailwindcss()]
  }
});