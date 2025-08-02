# 🚀 Guía de Deployment - PokeDB en Netlify

## 📋 Pre-requisitos
- ✅ Build exitoso (`npm run build`)
- ✅ Repositorio en GitHub
- ✅ Cuenta de Netlify

## 🚀 Pasos para desplegar

### 1. 📁 Preparar repositorio
```bash
# Commit y push de todos los cambios
git add .
git commit -m "🚀 Preparación para deployment en Netlify con SSR"
git push origin main
```

### 2. 🌐 Configurar en Netlify
1. Ir a [netlify.com](https://netlify.com) y hacer login
2. Hacer clic en "Add new site" → "Import an existing project"
3. Conectar con GitHub y seleccionar el repositorio `pokeDB`
4. Configurar settings de build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `dist/functions` (auto-detectado)

### 3. ⚙️ Variables de entorno (opcional)
En Netlify Dashboard → Site settings → Environment variables:
```
NODE_ENV=production
```

### 4. 🎯 Deploy
- Netlify detectará automáticamente el `netlify.toml`
- El deployment se iniciará automáticamente
- URL será algo como: `https://amazing-app-name.netlify.app`

## 🔧 Configuración incluida

### 📄 netlify.toml
- ✅ Build optimizado para Node.js 18
- ✅ Redirects para SSR routes
- ✅ Headers de seguridad y caché
- ✅ Configuración de Functions

### 🏗️ astro.config.mjs
- ✅ Output: "server" (SSR habilitado)
- ✅ Adapter: netlify()
- ✅ Optimizaciones de build
- ✅ Configuración de imágenes remotas

## 🎯 Funcionalidades desplegadas

### ✅ Páginas SSR
- 🏠 `/` - Homepage con grid de Pokémon
- 🔍 `/pokemon/[id]` - Detalles de Pokémon individual
- ❤️ `/favorites` - Lista de favoritos

### ✅ API Endpoints
- 📡 `/api/favorites` - Gestión de favoritos

### ✅ Optimizaciones
- 🚀 Server-Side Rendering
- 💾 Caché TTL de 24 horas
- 🗜️ Compresión gzip/brotli
- 🖼️ Optimización de imágenes
- 🔒 Headers de seguridad

## 🐛 Troubleshooting

### Si el build falla:
1. Verificar que `npm run build` funciona localmente
2. Revisar logs en Netlify Dashboard
3. Verificar versión de Node.js en netlify.toml

### Si las rutas no funcionan:
- Netlify debería usar los redirects en `netlify.toml`
- Verificar que las Functions se han desplegado

### Para debugging:
- Ver logs en tiempo real en Netlify Dashboard
- Usar `netlify dev` para desarrollo local con Functions

## 🎉 ¡Listo!
Tu PokeDB estará disponible en la URL proporcionada por Netlify con:
- ⚡ SSR completo
- 🎮 Funcionalidad de favoritos
- 📱 Responsive design
- 🚀 Performance optimizado
