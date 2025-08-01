Pokédex SSR con Astro 🪐, Astro DB (beta) y Turso

---

Demo en producción → https://TU-SITE-NETLIFY.netlify.app

⸻

📖 Descripción

Ejemplo full-stack construido con Astro 4, la beta de Astro DB (SQL as-a-Service), Drizzle ORM y Turso como base de datos remota.
	•	Lista los primeros 151 Pokémon usando la PokéAPI y los guarda en Astro DB.
	•	Renderiza cada página mediante SSR ( output:"server" ) y aplica caché TTL de 24 h: solo actualiza un Pokémon cuando su updatedAt ha caducado.
	•	Permite marcar favoritos (inserta en la tabla Favorite) y verlos en /favorites.
	•	Desplegado gratis en Netlify Functions.

⸻

✨ Características

Funcionalidad	Detalle
Astro + SSR	@astrojs/netlify + output:"server"
Astro DB (beta)	Schema con defineTable, tipado Drizzle ORM
Turso (libSQL)	SQL global, token JWT, plan gratuito
Caché TTL	24 h: evita fetch innecesario a PokéAPI
CRUD Favoritos	Endpoint /api/fav con insert idempotente
Filtrado UI	Input client-side, sin frameworks extra


⸻

🔧 Requisitos Previos
	•	Node 20+
	•	Turso CLI ≥ 0.54
curl -sSfL https://get.tur.so/install.sh | sh
	•	Git y cuenta GitHub
	•	Cuenta Netlify (plan Free)

⸻

🚀 Instalación Local

# 1 Clona el repo
 git clone https://github.com/TU-USUARIO/pokedex-astro.git
 cd pokedex-astro

# 2 Instala deps
 npm install

# 3 Crea la BD remota
 turso auth login
 turso db create pokedex-db
 turso db tokens create pokedex-db --read-write

# 4 Configura variables
 cp .env.example .env         # edita DATABASE_URL y TURSO_AUTH_TOKEN

# 5 Migra y siembra datos
 npx astro db push --remote   # crea tablas en Turso
 npx astro db seed --remote   # inserta 151 Pokémon

# 6 Inicia en desarrollo
 npm run dev                  # http://localhost:4321


⸻

☁️ Despliegue en Netlify
	1.	Push a GitHub.
	2.	En Netlify → Add new site → Import from GitHub.
	3.	Ajusta Build Command: npm run build y Publish Dir: netlify.
	4.	Añade las variables DATABASE_URL y TURSO_AUTH_TOKEN en Site → Environment.
	5.	Click Deploy Site. Netlify creará automáticamente las Functions serverless.

⸻

📂 Estructura de Carpetas

src/
 ├─ db/
 │   ├─ config.ts      # tablas Drizzle
 │   └─ seed.ts        # poblar la BD
 ├─ pages/
 │   ├─ index.astro    # lista + filtro + add Fav
 │   ├─ favorites.astro# vista favoritos
 │   └─ api/
 │       └─ fav.ts     # endpoint POST
 └─ components/        # UI reutilizable


⸻

📜 Scripts npm útiles

Script	Acción
dev	Ejecuta Astro + SSR en local
build	Compila para Netlify (netlify/)
preview	Previsualiza el build localmente
astro db push	Aplica migraciones locales
astro db seed	Inserta datos de ejemplo


⸻

🔍 Referencias
	•	Astro DB (beta) Docs
	•	Turso CLI Docs
	•	Drizzle ORM
	•	PokéAPI

⸻

🪪 Licencia

Este proyecto se distribuye bajo licencia MIT. ¡Forks, PRs y feedback son bienvenidos!