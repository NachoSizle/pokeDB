# 🎮 PokeDB - Pokédex SSR con Astro v5 

<div align="center">

![PokeDB Banner](https://raw.githubusercontent.com/NachoSizle/pokeDB/main/public/logo.webp)

**Pokédex completa con arquitectura SSR híbrida, base de datos Turso y caché TTL inteligente**

[![Astro](https://img.shields.io/badge/Astro-v5.12.8-FF5D01?style=flat&logo=astro&logoColor=white)](https://astro.build)
[![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=flat&logo=netlify&logoColor=white)](https://pokedb-astro.netlify.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[🚀 **Demo en Vivo**](https://pokedb-astro.netlify.app) • [📚 **Documentación**](#-características) • [🛠️ **Instalación**](#-instalación-local)

</div>

---

## 📖 **Descripción**

**PokeDB** es una Pokédex moderna construida con **Astro v5** que demuestra el poder de la **arquitectura SSR híbrida**. Combina lo mejor de ambos mundos: páginas estáticas súper rápidas y funcionalidad dinámica server-side.

### 🎯 **Características Principales:**

- 🏠 **Homepage Estática** → Pre-renderizada con 151 Pokémon (velocidad máxima + SEO)
- ⚡ **Rutas Dinámicas SSR** → Páginas individuales y favoritos con datos actualizados
- 🗄️ **Base de Datos Turso** → SQL distribuido globalmente con Astro DB
- ⏰ **Caché TTL 24h** → Sistema inteligente que evita llamadas innecesarias a PokéAPI
- 💖 **Sistema de Favoritos** → CRUD completo con persistencia en base de datos
- 🌐 **Netlify Functions** → Deploy serverless automático
- 🎨 **Tailwind CSS v4** → Diseño moderno y responsivo
- 📱 **PWA Ready** → Optimizado para móviles y desktop

---

## 🏗️ **Arquitectura SSR Híbrida**

### 📊 **Comparativa de Rendimiento:**

| Ruta | Tipo | Tiempo de Carga | SEO | Funcionalidad |
|------|------|-----------------|-----|---------------|
| `/` | Estática | ~100ms | ⭐⭐⭐⭐⭐ | Solo lectura |
| `/pokemon/[id]` | SSR | ~300ms | ⭐⭐⭐⭐ | Dinámico + DB |
| `/favorites` | SSR | ~400ms | ⭐⭐⭐⭐ | CRUD completo |

---

## ✨ **Características Técnicas**

<table>
<tr>
<td width="50%">

### 🚀 **Frontend**
- **Astro v5.12.8** - Framework principal
- **SSR Híbrido** - `output: 'server'` + `prerender`
- **Tailwind CSS v4** - Estilos utility-first
- **TypeScript** - Tipado completo
- **Astro Islands** - Hidratación selectiva

</td>
<td width="50%">

### 🗄️ **Backend**
- **Astro DB** - ORM integrado con Drizzle
- **Turso** - Base de datos SQLite distribuida
- **Netlify Functions** - Serverless deployment
- **PokéAPI** - Datos de Pokémon oficiales
- **Sistema de Caché TTL** - 24h de persistencia

</td>
</tr>
</table>

---

## 🔧 **Requisitos Previos**

- **Node.js** ≥ 20.0.0
- **Bun** (recomendado) o npm
- **Turso CLI** ≥ 0.54
- **Git** y cuenta GitHub
- **Cuenta Netlify** (plan gratuito)

### 📦 **Instalación Turso CLI:**

```bash
# macOS/Linux
curl -sSfL https://get.tur.so/install.sh | sh

# Windows
scoop install turso
```

---

## 🚀 **Instalación Local**

### 1️⃣ **Clonar el Repositorio**

```bash
git clone https://github.com/NachoSizle/pokeDB.git
cd pokeDB
```

### 2️⃣ **Instalar Dependencias**

```bash
bun install
# o npm install
```

### 3️⃣ **Configurar Base de Datos**

```bash
# Autenticarse en Turso
turso auth login

# Crear base de datos
turso db create pokedb-astro

# Generar token de autenticación
turso db tokens create pokedb-astro --read-write
```

### 4️⃣ **Variables de Entorno**

Crea un archivo `.env` en la raíz:

```env
# Database
ASTRO_DB_REMOTE_URL=libsql://tu-database-url.turso.io
ASTRO_DB_APP_TOKEN=tu-token-aqui

# Opcional: PokéAPI
POKEAPI_BASE_URL=https://pokeapi.co/api/v2
```

### 5️⃣ **Migrar y Sembrar Datos**

```bash
# Aplicar migraciones
bun run astro db push --remote

# Sembrar datos iniciales (151 Pokémon)
bun run astro db seed --remote
```

### 6️⃣ **Ejecutar en Desarrollo**

```bash
bun run dev
# Abre http://localhost:4321
```

---

## ☁️ **Despliegue en Netlify**

### 🔄 **Deploy Automático:**

1. **Push a GitHub**
   ```bash
   git add .
   git commit -m "feat: mi nueva funcionalidad"
   git push origin main
   ```

2. **Conectar con Netlify**
   - Ve a [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" → "Import from GitHub"
   - Selecciona tu repositorio `pokeDB`

3. **Configurar Build**
   ```
   Build command: npm run build
   Publish directory: dist
   Functions directory: .netlify/build
   ```

4. **Variables de Entorno**
   - Ve a Site Settings → Environment variables
   - Añade: `ASTRO_DB_REMOTE_URL` y `ASTRO_DB_APP_TOKEN`

5. **Deploy**
   - Click "Deploy site"
   - Netlify creará automáticamente las Functions serverless

### 🎯 **URLs de Producción:**

- **Homepage**: https://pokedb-astro.netlify.app/
- **Pokémon Individual**: https://pokedb-astro.netlify.app/pokemon/25
- **Favoritos**: https://pokedb-astro.netlify.app/favorites
- **API**: https://pokedb-astro.netlify.app/api/favorites

---

## 📂 **Estructura del Proyecto**

```
pokeDB/
├── 📁 src/
│   ├── 📁 components/          # Componentes UI reutilizables
│   │   ├── PokemonCard.astro   # Card individual de Pokémon
│   │   └── PokemonList.astro   # Grid de Pokémon con filtros
│   ├── 📁 layouts/
│   │   └── MainLayout.astro    # Layout principal con SEO
│   ├── 📁 pages/               # Páginas y rutas
│   │   ├── index.astro         # 🏠 Homepage (estática)
│   │   ├── favorites.astro     # ⭐ Página de favoritos (SSR)
│   │   ├── 📁 pokemon/
│   │   │   └── [id].astro      # 🎮 Páginas dinámicas (SSR)
│   │   └── 📁 api/
│   │       └── favorites.ts    # 🔌 API endpoints
│   ├── 📁 services/
│   │   └── pokemonDB.ts        # 🗄️ Servicio de base de datos
│   └── 📁 styles/
│       └── global.css          # 🎨 Estilos globales
├── 📁 db/
│   ├── config.ts               # 🗃️ Schema de base de datos
│   └── seed.ts                 # 🌱 Datos iniciales
├── 📁 public/                  # Assets estáticos
├── astro.config.mjs            # ⚙️ Configuración Astro
├── netlify.toml               # 🌐 Configuración Netlify
└── package.json               # 📦 Dependencias
```

---

## 📜 **Scripts Disponibles**

| Script | Descripción | Uso |
|--------|-------------|-----|
| `dev` | Desarrollo local con SSR | `bun run dev` |
| `build` | Build de producción | `bun run build` |
| `build:local` | Build sin remote DB | `bun run build:local` |
| `preview` | Preview del build | `bun run preview` |
| `astro db push` | Aplicar migraciones | `bun run astro db push --remote` |
| `astro db seed` | Sembrar datos | `bun run astro db seed --remote` |

---

## 🎯 **Funcionalidades**

### 🏠 **Homepage Estática**
- Pre-renderizada con `export const prerender = true`
- Carga de 151 Pokémon en build time
- SEO optimizado y velocidad máxima
- Grid responsivo con Tailwind CSS

### 🎮 **Páginas de Pokémon**
- Rutas dinámicas `/pokemon/[id]`
- Datos actualizados con sistema de caché TTL
- Botón de favoritos con persistencia
- Información completa: stats, tipos, sprites

### ⭐ **Sistema de Favoritos**
- Página dedicada `/favorites`
- API REST con endpoints CRUD
- Persistencia en base de datos Turso
- Interfaz intuitiva para gestión

### ⚡ **Caché TTL Inteligente**
- Cache de 24 horas por Pokémon
- Actualización automática cuando expira
- Fallback a PokéAPI si no hay datos
- Optimización de requests de red

---

## 🔍 **API Reference**

### **GET** `/api/favorites`
Obtiene todos los Pokémon favoritos

```javascript
// Respuesta
{
  "favorites": [
    {
      "id": 25,
      "name": "pikachu",
      "sprite": "https://...",
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### **POST** `/api/favorites`
Añade o elimina un Pokémon de favoritos

```javascript
// Request
{
  "pokemonId": 25,
  "action": "add" // o "remove"
}

// Respuesta
{
  "success": true,
  "action": "added", // o "removed"
  "pokemonId": 25
}
```

---

## 🛠️ **Tecnologías Utilizadas**

<div align="center">

| Categoría | Tecnologías |
|-----------|-------------|
| **Framework** | ![Astro](https://img.shields.io/badge/Astro-FF5D01?style=flat&logo=astro&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) |
| **Estilos** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) |
| **Base de Datos** | ![Turso](https://img.shields.io/badge/Turso-4F46E5?style=flat&logo=sqlite&logoColor=white) ![SQLite](https://img.shields.io/badge/SQLite-07405E?style=flat&logo=sqlite&logoColor=white) |
| **Deploy** | ![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=flat&logo=netlify&logoColor=white) |
| **APIs** | ![PokéAPI](https://img.shields.io/badge/PokéAPI-FF6B35?style=flat&logo=pokemon&logoColor=white) |

</div>

---

## 📈 **Roadmap**

- [ ] 🔍 **Búsqueda avanzada** - Filtros por tipo, generación, stats
- [ ] 📊 **Comparador de Pokémon** - Side-by-side stats comparison
- [ ] 🎨 **Temas personalizables** - Dark/light mode + colores por tipo
- [ ] 📱 **PWA completa** - Service workers + offline support
- [ ] 🔄 **Generaciones adicionales** - Expandir más allá de Gen 1
- [ ] 🎮 **Modo competitivo** - Teams builder + movesets
- [ ] 📈 **Analytics** - Tracking de Pokémon más populares

---

## 🤝 **Contribuir**

¡Las contribuciones son bienvenidas! 

1. **Fork** el proyecto
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

### 📋 **Convenciones de Commits**

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: ✨ nueva funcionalidad
fix: 🐛 corrección de bug
docs: 📚 actualización documentación
style: 🎨 cambios de estilo
refactor: ♻️ refactorización de código
perf: ⚡ mejora de rendimiento
test: 🧪 añadir tests
```

---

## 📚 **Referencias y Recursos**

- 📖 [Astro Documentation](https://docs.astro.build)
- 🗄️ [Astro DB Guide](https://docs.astro.build/en/guides/astro-db/)
- 🚀 [Turso Documentation](https://docs.turso.tech/)
- 🎮 [PokéAPI Documentation](https://pokeapi.co/docs/v2)
- 🌐 [Netlify Functions](https://docs.netlify.com/functions/overview/)
- 🎨 [Tailwind CSS v4](https://tailwindcss.com/docs)

---

## 📄 **Licencia**

Este proyecto está bajo la **Licencia MIT**. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 🙏 **Agradecimientos**

- 🎮 **PokéAPI** - Por proporcionar datos completos y gratuitos
- 🚀 **Astro Team** - Por crear un framework increíble
- 🗄️ **Turso** - Por la base de datos SQLite distribuida
- 🌐 **Netlify** - Por el hosting y functions gratuitas
- 🎨 **Tailwind CSS** - Por el sistema de diseño utility-first

---

<div align="center">

**¿Te gusta el proyecto? ¡Dale una ⭐ en GitHub!**

[![GitHub stars](https://img.shields.io/github/stars/NachoSizle/pokeDB?style=social)](https://github.com/NachoSizle/pokeDB)

[🚀 **Ver Demo**](https://pokedb-astro.netlify.app) • [📝 **Reportar Bug**](https://github.com/NachoSizle/pokeDB/issues) • [💡 **Solicitar Feature**](https://github.com/NachoSizle/pokeDB/issues)

</div>