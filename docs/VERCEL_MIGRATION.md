# 🚀 Guía de Despliegue y Solución de Errores en Vercel

Este documento detalla los problemas encontrados durante el despliegue de PokeDB en Vercel y las soluciones de arquitectura implementadas para resolverlos.

---

## 🚨 Problema Inicial: Error 500 en Páginas Dinámicas

Tras el despliegue inicial en Vercel, cualquier página que no fuera estática (ej. `/favorites`, `/pokemon/[id]`) devolvía un **error HTTP 500**, bloqueando la funcionalidad de la aplicación.

### **Causas Raíz Identificadas:**

1.  **Condiciones de Carrera (Race Conditions)**: La función `getAllPokemon` intentaba borrar y rellenar la base de datos en cada ejecución. En un entorno serverless como Vercel, múltiples peticiones simultáneas provocaban que una función borrara la base de datos mientras otra intentaba leerla, causando inconsistencias y errores.

2.  **Dependencia de API Externa en Tiempo de Ejecución**: Las funciones serverless intentaban contactar con la PokéAPI en cada petición para llenar la base de datos. Esto introducía una alta latencia y un punto de fallo crítico si la API externa respondía lentamente o fallaba.

3.  **Errores de `TypeError` Ocultos**: El error 500 enmascaraba un problema más profundo. El código intentaba acceder a datos (como `pokemon.types`) que no existían en la base de datos, ya que solo se guardaba la información más básica (nombre y sprite).

4.  **Esquema de Base de Datos Desincronizado**: Los cambios en el esquema local (`db/config.ts`) no se reflejaban automáticamente en la base de datos remota de producción, causando errores `SQLITE_UNKNOWN` durante el proceso de `build`.

---

## 🛠️ Solución Arquitectónica: Build Híbrido y Robusto

Se implementó una estrategia de **generación de sitio híbrida (SSG/SSR)** para mover toda la carga de datos posible al **momento del `build`**, haciendo la aplicación final más rápida y resiliente.

### **Pasos de la Solución:**

1.  **Convertir Páginas Públicas a Estáticas (SSG):**
    *   Se añadió `export const prerender = true;` a `src/pages/index.astro`.
    *   En `src/pages/pokemon/[id].astro`, se implementó `getStaticPaths` para generar las 151 páginas de Pokémon durante el `build` y se añadió `export const prerender = true;` para forzar su generación estática.

2.  **Refactorización del Servicio de Base de Datos (`pokemonDB.ts`):**
    *   La función `getAllPokemon` se modificó para que solo intente llenar la base de datos si esta está completamente vacía.
    *   El proceso de llenado se enriqueció para obtener los **detalles completos** (tipos, estadísticas) de cada Pokémon y guardarlos, asegurando que todos los datos necesarios estén disponibles sin llamar a la API externa en tiempo de ejecución.

3.  **Actualización del Esquema de la Base de Datos:**
    *   Se añadieron las columnas `types` y `stats` de tipo `json` a la tabla `Pokemon` en `db/config.ts`.
    *   Se utilizó el comando `bunx astro db push --force-reset` para forzar la actualización del esquema en la base de datos de producción, borrando los datos antiguos y preparando la base de datos para el nuevo formato.

4.  **Mantener Páginas Dinámicas (SSR) solo cuando es Necesario:**
    *   La página `favorites.astro` se mantuvo como SSR, ya que su contenido depende de las interacciones del usuario y debe generarse en tiempo real.

### **Resultado Final:**

-   **Cero Errores 500**: La aplicación es estable en Vercel.
-   **Rendimiento Mejorado**: Las páginas se sirven desde el CDN de Vercel, con una latencia mínima.
-   **Resiliencia**: La aplicación no depende de la disponibilidad de la PokéAPI después del `build`.
-   **Arquitectura Clara**: Se sigue un patrón híbrido claro, aprovechando lo mejor de SSG y SSR.