# 🎮 PokeDB - Pokédex con Búsqueda Avanzada y AstroDB

<div align="center">

![PokeDB Banner](https://raw.githubusercontent.com/NachoSizle/pokeDB/main/public/logo.webp)

**Pokédex completa con búsqueda avanzada, base de datos AstroDB/Turso y arquitectura SSR híbrida**

[![Astro](https://img.shields.io/badge/Astro-v5.12.8-FF5D01?style=flat&logo=astro&logoColor=white)](https://astro.build)
[![AstroDB](https://img.shields.io/badge/AstroDB-4F46E5?style=flat&logo=astro&logoColor=white)](https://docs.astro.build/en/guides/astro-db/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://pokedb-astro.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[🚀 **Demo en Vivo**](https://pokedb-astro.vercel.app) • [� **Búsqueda Avanzada**](#-búsqueda-avanzada) • [�📚 **Documentación**](#-características) • [🛠️ **Instalación**](#-instalación-local)

</div>

---

## 📖 **Descripción**

**PokeDB** es una Pokédex moderna construida con **Astro v5** y **AstroDB** que demuestra el poder de la **búsqueda avanzada en tiempo real** y la **arquitectura SSR híbrida**. Combina una interfaz elegante con funcionalidades robustas de filtrado y consulta.

### 🎯 **Características Principales:**

- 🔍 **Búsqueda Avanzada** → Modal con filtros múltiples: nombre, tipos, estadísticas y HP
- 🏷️ **Sistema de Tags** → Selector de tipos con badges coloridos y eliminación individual
- 🗄️ **AstroDB + Turso** → Base de datos SQL distribuida con índices optimizados
- ⚡ **Arquitectura Híbrida** → SSG para la homepage, SSR para búsquedas dinámicas
- � **Modal Responsivo** → HTML Dialog nativo con diseño adaptive móvil/desktop
- � **UI Moderna** → Gradientes, animaciones y sistema de colores por tipo
- 🚀 **Rendimiento Optimizado** → Consultas indexadas y caché inteligente
- � **151 Pokémon** → Datos completos de la primera generación con sprites oficiales

---

## 🔍 **Búsqueda Avanzada**

### 🎛️ **Filtros Disponibles:**

| Filtro | Tipo | Funcionalidad |
|--------|------|---------------|
| **Nombre** | Texto | Búsqueda parcial insensible a mayúsculas |
| **Tipos** | Multi-select | Tags coloridos con eliminación individual |
| **Poder Total** | Rango | Slider dual para estadísticas combinadas |
| **HP** | Rango | Control de puntos de vida mínimos/máximos |

### 🎨 **Sistema de Colores por Tipo:**
- 🔥 **Fire**: Rojo - 💧 **Water**: Azul - ⚡ **Electric**: Amarillo
- 🌿 **Grass**: Verde - 👻 **Ghost**: Índigo - 🧚 **Fairy**: Rosa
- *... y 12 tipos más con colores únicos*

---

## 🏗️ **Arquitectura**

<table>
<tr>
<td width="50%">

### 🚀 **Frontend**
- **Astro v5.12.8** - Framework principal con Islands
- **SSR Híbrido** - `output: 'server'` + `prerender`
- **Tailwind CSS v4** - Diseño utility-first responsivo
- **TypeScript** - Tipado completo y robusto
- **HTML Dialog** - Modal nativo sin dependencias
- **Vanilla JavaScript** - Máxima compatibilidad

</td>
<td width="50%">

### 🗄️ **Backend & Base de Datos**
- **AstroDB** - ORM integrado con Drizzle
- **Turso** - SQLite distribuido globalmente
- **Índices Optimizados** - Consultas eficientes
- **API Endpoints** - Búsqueda y metadatos
- **PokéAPI** - Datos oficiales de Pokémon
- **Vercel Functions** - Deploy serverless

</td>
</tr>
</table>

### 🔍 **Base de Datos - Esquema Optimizado:**

```typescript
// db/config.ts - Esquema extendido para búsqueda
export const Pokemon = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text({ notNull: true }),
    types: column.text({ notNull: true }), // JSON array
    sprite: column.text({ notNull: true }),
    primaryType: column.text({ notNull: true }), // Tipo principal
    totalStats: column.number({ notNull: true }), // Suma de estadísticas
    hp: column.number({ notNull: true }),
    attack: column.number({ notNull: true }),
    defense: column.number({ notNull: true }),
    stats: column.text({ notNull: true }), // JSON completo
  },
  indexes: {
    nameIndex: index('name_idx').on('name'),
    typeIndex: index('type_idx').on('primaryType'),
    statsIndex: index('stats_idx').on('totalStats'),
    hpIndex: index('hp_idx').on('hp'),
  }
});
```

### 📊 **Comparativa de Rendimiento:**

| Ruta | Tipo | Tiempo de Carga | SEO | Funcionalidad |
|------|------|-----------------|-----|---------------|
| `/` | Estática (SSG) | ~100ms | ⭐⭐⭐⭐⭐ | Grid completo + Modal |
| `/pokemon/[id]` | SSR | ~300ms | ⭐⭐⭐⭐ | Detalles dinámicos |
| `/api/search` | API | ~200ms | N/A | Búsqueda en tiempo real |

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
# AstroDB + Turso
ASTRO_DB_REMOTE_URL=libsql://tu-database-url.turso.io
ASTRO_DB_APP_TOKEN=tu-token-aqui

# Opcional: PokéAPI (para re-seed)
POKEAPI_BASE_URL=https://pokeapi.co/api/v2
```

### 5️⃣ **Sembrar Base de Datos**

```bash
# Ejecutar seed con datos de PokéAPI
bun run db:seed

# Verificar datos cargados
bun run db:studio
```

### 6️⃣ **Desarrollo Local**

```bash
# Iniciar servidor de desarrollo
bun run dev

# Build para producción
bun run build

# Vista previa del build
bun run preview
```

### 🎯 **URLs de Desarrollo:**

- **Homepage**: `http://localhost:4321/`
- **Búsqueda**: Click en "Búsqueda Avanzada"
- **Detalle**: `http://localhost:4321/pokemon/25` (Pikachu)
- **API**: `http://localhost:4321/api/search?name=pikachu`

---

## 🎮 **Uso de la Búsqueda Avanzada**

### 🔍 **Abrir Modal de Búsqueda**
1. Click en **"Búsqueda Avanzada"** en la homepage
2. El modal se abre con todos los filtros disponibles

### 🏷️ **Filtrar por Tipos**
1. Click en el área **"Selecciona tipos de Pokémon..."**
2. Selecciona uno o varios tipos del dropdown
3. Los tipos aparecen como **tags coloridos**
4. Click en **"×"** para eliminar un tipo específico

### 📊 **Filtros de Estadísticas**
- **Poder Total**: Arrastra los sliders para establecer rango 0-800
- **HP**: Controla puntos de vida entre 0-255
- **Nombre**: Búsqueda de texto parcial

### 🎯 **Realizar Búsqueda**
1. Configura los filtros deseados
2. Click en **"🔍 Buscar Pokémon"**
3. Los resultados aparecen en **tiempo real**
4. **"🧹 Limpiar Filtros"** para resetear todo

---

---

## 📁 **Estructura del Proyecto**

```
pokeDB/
├── db/
│   ├── config.ts          # 🗄️ Esquema AstroDB con índices
│   └── seed.ts            # 🌱 Población de 151 Pokémon desde PokéAPI
├── src/
│   ├── components/
│   │   ├── PokemonCard.astro     # 🃏 Tarjeta individual
│   │   └── PokemonList.astro     # 📋 Grid de Pokémon
│   ├── layouts/
│   │   └── MainLayout.astro      # 🏗️ Layout principal con footer actualizado
│   ├── pages/
│   │   ├── index.astro           # 🏠 Homepage con modal de búsqueda
│   │   ├── pokemon/
│   │   │   └── [id].astro        # 📄 Páginas de detalle SSR
│   │   └── api/
│   │       └── search.ts         # 🔍 API de búsqueda avanzada
│   ├── services/
│   │   ├── pokemon.ts            # ⚡ Cliente PokéAPI con caché
│   │   └── pokemonDB.ts          # 🗄️ Operaciones de base de datos
│   └── styles/
│       └── global.css            # 🎨 Estilos globales
├── astro.config.mjs              # ⚙️ Configuración Astro + AstroDB
├── tailwind.config.mjs           # 🎨 Configuración Tailwind v4
└── vercel.json                   # 🚀 Configuración Vercel
```

### 🛣️ **Rutas y Funcionalidades:**

| Ruta | Tipo | Descripción |
|------|------|-------------|
| `/` | SSG | Homepage con grid completo + modal búsqueda |
| `/pokemon/[id]` | SSR | Página detalle con estadísticas y tipos |
| `/api/search` | API | Endpoint búsqueda con filtros múltiples |
| `/api/search` (POST) | API | Metadatos (tipos disponibles) |

---

## ☁️ **Despliegue en Vercel**

### 🔄 **Deploy Automático:**

1. **Push a GitHub**
   ```bash
   git add .
   git commit -m "feat: búsqueda avanzada completa 🔍"
   git push origin main
   ```

2. **Conectar con Vercel**
   - Ve a [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Importa tu repositorio `pokeDB`

3. **Variables de Entorno en Vercel**
   ```
   ASTRO_DB_REMOTE_URL=libsql://tu-database.turso.io
   ASTRO_DB_APP_TOKEN=tu-token-aqui
   ```

4. **Deploy Automático**
   - Cada push a `main` triggerea deploy automático
   - Build time: ~2-3 minutos
   - ✅ URL live en segundos

---

## ☁️ **Despliegue en Netlify**

### 🔄 **Deploy Automático:**

1. **Push a GitHub**
   ```bash
   git add .
   git commit -m "feat: mi nueva funcionalidad"
   git push origin main
---

## 🛠️ **Scripts Disponibles**

```bash
# 🚀 Desarrollo
bun run dev              # Servidor de desarrollo
bun run build            # Build para producción  
bun run preview          # Vista previa del build

# 🗄️ Base de Datos
bun run db:seed          # Sembrar 151 Pokémon desde PokéAPI
bun run db:studio        # Abrir Drizzle Studio
bun run db:push          # Aplicar cambios del schema

# 🔍 Debugging
bun run astro check      # Verificar tipos TypeScript
bun run astro --help     # Ayuda de comandos Astro
```

### 🎯 **URLs de Producción:**

- **Homepage**: https://pokedb-astro.vercel.app/
- **Búsqueda**: Modal en homepage → "Búsqueda Avanzada"
- **Detalle**: https://pokedb-astro.vercel.app/pokemon/25 (Pikachu)
- **API Search**: https://pokedb-astro.vercel.app/api/search?name=charizard

---

## 🎓 **Demo para Presentaciones**

### 🎯 **Funcionalidades Destacadas:**

1. **🔍 Búsqueda Avanzada**
   - Modal responsivo con filtros múltiples
   - Tags coloridos por tipo de Pokémon
   - Sliders de rango para estadísticas

2. **🗄️ AstroDB Integration**
   - Esquema optimizado con índices
   - Consultas eficientes en tiempo real
   - 151 Pokémon con datos completos

3. **🎨 UI/UX Moderna**
   - Diseño responsive mobile-first
   - Animaciones fluidas y gradientes
   - Sistema de colores por tipo

4. **⚡ Rendimiento**
   - SSG para homepage (100ms)
   - SSR para búsquedas dinámicas
   - API endpoints optimizados

### 📊 **Métricas de Demostración:**
- **Datos**: 151 Pokémon de la primera generación
- **Tipos**: 18 tipos diferentes con colores únicos  
- **Filtros**: 4 tipos de filtros combinables
- **Resultados**: Búsqueda instantánea < 200ms

---

## 🤝 **Contribución**

¿Quieres contribuir? ¡Genial! 

### 🔄 **Proceso:**
1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit tus cambios: `git commit -m 'feat: nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

### 🎯 **Ideas para Contribuir:**
- 🔍 Más filtros de búsqueda (región, generación)
- 🎨 Temas de color personalizables
- 📊 Comparador de Pokémon
- 🌍 Internacionalización (i18n)

---

## 📄 **Licencia**

**MIT License** - Consulta el archivo [LICENSE](LICENSE) para detalles.

---

## 👨‍💻 **Autor**

**NachoSizle** - *Desarrollo Full Stack*

- GitHub: [@NachoSizle](https://github.com/NachoSizle)
- LinkedIn: [Tu perfil](https://linkedin.com/in/tu-perfil)

---

<div align="center">

### ⭐ **¡Si te gusta el proyecto, deja una estrella!** ⭐

**Construido con ❤️ usando Astro, AstroDB y Tailwind CSS**

[🚀 Ver Demo](https://pokedb-astro.vercel.app) • [📖 Documentación](https://github.com/NachoSizle/pokeDB#readme) • [🐛 Reportar Bug](https://github.com/NachoSizle/pokeDB/issues)

</div>

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