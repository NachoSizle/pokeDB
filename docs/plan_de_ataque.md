📑 Plan de Ataque – Proyecto PokeDB

Pokédex SSR con Astro 🪐, Astro DB (beta), Turso y Netlify Functions

⸻

⭐ Pilar fundamental: Rendimiento y persistencia full-stack
	•	Astro DB (beta) + Turso (libSQL) para SQL gestionada con Drizzle ORM.
	•	SSR (output:"server") en Netlify Functions → refresco TTL y endpoints de favoritos.
	•	Caché TTL 24 h: evita golpear la PokéAPI en cada request.

⸻

Fase 0 – Arranque y BD remota

# Nuevo proyecto Astro
npm create astro@latest pokedex-astro
cd pokedex-astro

# Añadir Astro DB
npx astro add db

# Turso CLI
turso auth login
turso db create pokedex-db
turso db tokens create pokedex-db --read-write

Guarda DATABASE_URL y TURSO_AUTH_TOKEN en .env.

⸻

Fase 1 – Esquema SQL y migraciones

// src/db/config.ts
import { defineDb, defineTable, integer, text, timestamp } from "astro:db";

export const Pokemon = defineTable({
  columns: {
    id: integer("id").primary(),
    name: text("name"),
    sprite: text("sprite"),
    updatedAt: timestamp("updated_at")
  }
});

export const Favorite = defineTable({
  columns: {
    pokemonId: integer("pokemon_id").references(() => Pokemon.id)
  }
});

export default defineDb({ tables: { Pokemon, Favorite } });

npx astro db push          # local
npx astro db push --remote # Turso


⸻

Fase 2 – Seed inicial (151 Pokémon)

// src/db/seed.ts
import { db, Pokemon } from "astro:db";
const list = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151").then(r => r.json());
await db.insert(Pokemon).values(
  list.results.map((p, i) => ({
    id: i + 1,
    name: p.name,
    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i+1}.png`,
    updatedAt: new Date()
  }))
);

npx astro db seed --remote


⸻

Fase 3 – SSR + caché TTL

astro.config.mjs

import netlify from "@astrojs/netlify";
export default {
  output: "server",
  adapter: netlify({ edge: false })
};

	•	index.astro: consulta a Astro DB ➜ si updatedAt > 24 h, refetch sprite y UPDATE.
	•	/favorites: INNER JOIN Pokémon ✕ Favorite.
	•	/api/fav: endpoint POST para insertar favorito idempotente.

⸻

Fase 4 – UI reutilizable

Componente	Archivo
Layout base	src/layouts/MainLayout.astro
Tarjeta Pokémon	src/components/PokemonCard.astro
Lista + filtro	src/components/PokemonList.astro
Vista favoritos	src/pages/favorites.astro


⸻

Fase 5 – Interactividad
	•	Filtro en cliente (client:load, vanilla JS).
	•	Estado favorito: actualiza UI tras POST; opcional island SolidJS.

⸻

Fase 6 – Tests y CI/CD
	1.	npm run dev (SSR local).
	2.	npm run build && npm run preview.
	3.	Netlify: importar repo, setear vars y desplegar.

⸻

Comandos útiles

npm run dev                     # SSR local
npx astro db push --remote      # migraciones en Turso
npx astro db seed --remote      # seed Pokémon
netlify open                    # vista deploy
turso db shell pokedex-db       # consola SQL


⸻

Próximos pasos
	•	Monitorizar métricas en el dashboard Turso.
	•	Preparar GIF y capturas para LinkedIn, X/Twitter y Threads.
	•	Abrir issues para paginación o +Pokémon.

⸻

Licencia MIT

¡Forks, estrellas y PRs son bienvenidos! 🐾🚀