<div align="center">

# 🎮 PokeDB

![PokeDB Banner](https://raw.githubusercontent.com/NachoSizle/pokeDB/main/public/logo.webp)

**Pokédex moderna con paginación secuencial, búsqueda avanzada y Lighthouse 100/100**

[![Astro](https://img.shields.io/badge/Astro-v5.12.8-FF5D01?style=flat&logo=astro&logoColor=white)](https://astro.build)
[![Lighthouse](https://img.shields.io/badge/Lighthouse-100%2F100-00C853?style=flat&logo=lighthouse&logoColor=white)](https://pagespeed.web.dev/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://pokedb-astro.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[🚀 **Demo en Vivo**](https://pokedb-astro.vercel.app) • [📚 **Documentación**](#-características-principales) • [🛠️ **Instalación**](#-instalación-local)

</div>

---

## 📖 **Descripción**

**PokeDB** es una Pokédex moderna construida con **Astro v5** que demuestra el poder de la **paginación optimizada** y **performance perfecta**. Combina una interfaz elegante con funcionalidades robustas y Lighthouse Score 100/100.

## 🎯 **Características Principales**

- ⚡ **Paginación Secuencial** → Carga progresiva de 12 Pokémon por página (1-12, 13-24, 25-36...)
- 🔍 **Búsqueda Avanzada** → Modal con filtros múltiples: nombre, tipos, estadísticas y HP
- 🏷️ **Sistema de Tags** → Selector de tipos con badges coloridos y eliminación individual
- 🚀 **Performance Perfecta** → Lighthouse 100/100 en Accesibilidad y Performance Desktop
- 📱 **Modal Responsivo** → HTML Dialog nativo con diseño adaptive móvil/desktop
- 🎨 **UI Moderna** → Gradientes, animaciones y sistema de colores por tipo
- 🖼️ **Optimización de Imágenes** → Astro Image para sprites con lazy loading y WebP
- 🌐 **151 Pokémon** → Datos completos de la primera generación con sprites oficiales

---

## ⚡ **Sistema de Paginación**

### 🔄 **Carga Progresiva Optimizada**

| Acción | Pokémon Mostrados | Comportamiento |
|--------|-------------------|----------------|
| **Carga Inicial** | 1-12 | SSR con getAllPokemon() ordenado por ID |
| **Click "Cargar más"** | 13-24 | Fetch a /api/search con ordenamiento por ID |
| **Segundo Click** | 25-36 | Array slice(24, 36) del dataset completo |
| **Último Lote** | 145-151 | Botón se oculta automáticamente |

### 🎯 **Optimizaciones de Performance**
- 📦 **Carga Inicial**: Solo 12 Pokémon via SSR para First Contentful Paint rápido
- 🔄 **Fetch Único**: Una sola petición carga todos los 151 Pokémon ordenados
- 📱 **DOM Progresivo**: insertAdjacentHTML para agregar sin re-renderizar
- 🎪 **Animaciones**: slideInUp CSS para nuevas tarjetas
- ♿ **Accesibilidad**: aria-label dinámico con conteo actualizado

### ⚡ **Paginación Optimizada - Código Principal**

```typescript
// PokemonList.astro - Paginación secuencial
if (showInitialLoad && pokemons.length === 0) {
  const { getAllPokemon } = await import('../services/pokemonDB');
  const allPokemons = await getAllPokemon();
  pokemons = allPokemons.sort((a, b) => a.id - b.id).slice(0, pageSize);
}

// Script de paginación frontend
async function loadMorePokemon() {
  if (allPokemon.length === 0) {
    const response = await fetch('/api/search');
    const data = await response.json();
    allPokemon = data.results.sort((a, b) => a.id - b.id);
  }
  
  const startIndex = currentPageIndex * pageSize;
  const endIndex = startIndex + pageSize;
  const newPokemon = allPokemon.slice(startIndex, endIndex);
  // Agregar al DOM con insertAdjacentHTML...
}
```

### � **API Endpoint - Ordenamiento Garantizado**

```typescript
// /api/search.ts - Lógica de ordenamiento
if (name || selectedTypes.length > 0 || hasFilters) {
  filteredPokemon.sort((a, b) => b.totalStats - a.totalStats); // Por poder
} else {
  filteredPokemon.sort((a, b) => a.id - b.id); // Por ID secuencial
}
```

---

## 🔍 **Búsqueda Avanzada**

### 🎛️ **Filtros Disponibles**

| Filtro | Tipo | Funcionalidad |
|--------|------|---------------|
| **Nombre** | Texto | Búsqueda parcial insensible a mayúsculas |
| **Tipos** | Multi-select | Tags coloridos con eliminación individual |
| **Poder Total** | Rango | Slider dual para estadísticas combinadas |
| **HP** | Rango | Control de puntos de vida mínimos/máximos |

### 🎨 **Sistema de Colores por Tipo**
- 🔥 **Fire**: Rojo - 💧 **Water**: Azul - ⚡ **Electric**: Amarillo
- 🌿 **Grass**: Verde - 👻 **Ghost**: Índigo - 🧚 **Fairy**: Rosa
- *... y 12 tipos más con colores únicos*

### 🎮 **Uso del Modal de Búsqueda**

1. **Abrir Modal**: Click en "Búsqueda Avanzada" en la homepage
2. **Filtrar por Tipos**: 
   - Click en "Selecciona tipos de Pokémon..."
   - Selecciona tipos del dropdown (aparecen como tags coloridos)
   - Click en "×" para eliminar un tipo específico
3. **Filtros de Estadísticas**:
   - **Poder Total**: Arrastra sliders para rango 0-800
   - **HP**: Controla puntos de vida 0-255
   - **Nombre**: Búsqueda de texto parcial
4. **Realizar Búsqueda**: Click en "🔍 Buscar Pokémon"
5. **Limpiar**: Click en "🧹 Limpiar Filtros" para resetear

---

## 🏗️ **Arquitectura Técnica**

<table>
<tr>
<td width="50%">

### 🚀 **Frontend Performance**
- **Astro v5.12.8** - Framework principal con Islands
- **Paginación Progresiva** - Carga secuencial 12x12 Pokémon
- **Tailwind CSS v4** - Diseño utility-first responsivo
- **TypeScript** - Tipado completo y robusto
- **HTML Dialog** - Modal nativo sin dependencias
- **Vanilla JavaScript** - Máxima compatibilidad y rendimiento

</td>
<td width="50%">

### 🗄️ **Backend & API**
- **pokemonDB.ts** - Servicio de datos optimizado
- **Fetch con Cache** - Una petición, múltiples paginaciones
- **Ordenamiento por ID** - Secuencia 1,2,3...151 garantizada
- **API Endpoints** - /api/search para búsqueda y listado
- **PokéAPI** - Datos oficiales de Pokémon
- **Vercel Functions** - Deploy serverless optimizado

</td>
</tr>
</table>

### 📊 **Comparativa de Rendimiento**

| Ruta | Tipo | Tiempo de Carga | SEO | Funcionalidad |
|------|------|-----------------|-----|---------------|
| `/` | Estática (SSG) | ~100ms | ⭐⭐⭐⭐⭐ | Grid completo + Modal |
| `/pokemon/[id]` | SSR | ~300ms | ⭐⭐⭐⭐ | Detalles dinámicos |
| `/api/search` | API | ~200ms | N/A | Búsqueda en tiempo real |

---

##  **Estructura del Proyecto**

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
│   │   └── MainLayout.astro      # 🏗️ Layout principal
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

### 🛣️ **Rutas y Funcionalidades**

| Ruta | Tipo | Descripción |
|------|------|-------------|
| `/` | SSG | Homepage con grid completo + modal búsqueda |
| `/pokemon/[id]` | SSR | Página detalle con estadísticas y tipos |
| `/api/search` | API | Endpoint búsqueda con filtros múltiples |

---

## 🚀 **Instalación Local**

### 📋 **Requisitos Previos**
- **Node.js** ≥ 20.0.0
- **Bun** (recomendado) o npm
- **Git** y cuenta GitHub

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

### 3️⃣ **Desarrollo Local**

```bash
# Iniciar servidor de desarrollo
bun run dev

# Build para producción
bun run build

# Vista previa del build
bun run preview
```

### 🎯 **URLs de Desarrollo**

- **Homepage**: `http://localhost:4321/`
- **Búsqueda**: Click en "Búsqueda Avanzada"
- **Detalle**: `http://localhost:4321/pokemon/25` (Pikachu)
- **API**: `http://localhost:4321/api/search?name=pikachu`

---

## 🛠️ **Scripts Disponibles**

```bash
# 🚀 Desarrollo
bun run dev              # Servidor de desarrollo
bun run build            # Build para producción  
bun run preview          # Vista previa del build

# 🔍 Debugging
bun run astro check      # Verificar tipos TypeScript
bun run astro --help     # Ayuda de comandos Astro
```

---

## ☁️ **Despliegue en Vercel**

### 🔄 **Deploy Automático**

1. **Push a GitHub**
   ```bash
   git add .
   git commit -m "feat: optimizaciones completas �"
   git push origin main
   ```

2. **Conectar con Vercel**
   - Ve a [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Importa tu repositorio `pokeDB`

3. **Deploy Automático**
   - Cada push a `main` triggerea deploy automático
   - Build time: ~2-3 minutos
   - ✅ URL live en segundos

### 🎯 **URLs de Producción**

- **Homepage**: https://pokedb-astro.vercel.app/
- **Búsqueda**: Modal en homepage → "Búsqueda Avanzada"
- **Detalle**: https://pokedb-astro.vercel.app/pokemon/25 (Pikachu)
- **API Search**: https://pokedb-astro.vercel.app/api/search?name=charizard

---

## � **Documentación Completa**

- 📋 [Arquitectura Técnica](./docs/ARCHITECTURE.md) - Sistema modular y componentes
- 🚀 [Performance & Lighthouse](./docs/PERFORMANCE.md) - Optimizaciones 100/100
- 🔍 [Sistema de Búsqueda](./docs/SEARCH_SYSTEM.md) - Modal avanzado y filtros
- 🌐 [Deploy en Vercel](./docs/VERCEL_MIGRATION.md) - Configuración production

---

## 🎓 **Demo para Presentaciones**

### 🎯 **Funcionalidades Destacadas**

1. **🔍 Búsqueda Avanzada**
   - Modal responsivo con filtros múltiples
   - Tags coloridos por tipo de Pokémon
   - Sliders de rango para estadísticas

2. **⚡ Paginación Optimizada**
   - Carga progresiva secuencial (1-12, 13-24, 25-36...)
   - Una sola petición para todos los datos
   - DOM progresivo sin re-renderizar

3. **🎨 UI/UX Moderna**
   - Diseño responsive mobile-first
   - Animaciones fluidas y gradientes
   - Sistema de colores por tipo

4. **� Performance Perfecta**
   - Lighthouse 100/100 en Accesibilidad
   - Performance Desktop optimizado
   - Carga inicial rápida con SSR

### 📊 **Métricas de Demostración**
- **Datos**: 151 Pokémon de la primera generación
- **Tipos**: 18 tipos diferentes con colores únicos  
- **Filtros**: 4 tipos de filtros combinables
- **Resultados**: Búsqueda instantánea < 200ms

---

## 🤝 **Contribución**

¿Quieres contribuir? ¡Genial! 

### 🔄 **Proceso**
1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit tus cambios: `git commit -m 'feat: nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

### 🎯 **Ideas para Contribuir**
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

**Construido con ❤️ usando Astro, TypeScript y Tailwind CSS**

[🚀 Ver Demo](https://pokedb-astro.vercel.app) • [📖 Documentación](https://github.com/NachoSizle/pokeDB#readme) • [🐛 Reportar Bug](https://github.com/NachoSizle/pokeDB/issues)

</div>

