# 🚀 Plan de Ataque: Proyecto pokeDB

Este documento describe el plan de desarrollo para crear una Pokédex interactiva utilizando Astro. Nos basaremos en la estructura del "Astro Starter Kit: Minimal" y las convenciones definidas en `GEMINI.md`.

## ⭐ Pilar Fundamental: Rendimiento Excepcional

Antes de detallar las fases, es crucial establecer que **la velocidad de carga y el rendimiento son los pilares fundamentales de este proyecto**. Cada decisión técnica, desde la elección de componentes hasta la gestión de assets, se tomará con el objetivo de mantener un performance óptimo y una experiencia de usuario fluida, siguiendo la filosofía "content-first" de Astro.

## Fase 1: Configuración Inicial y Estructura Base

El objetivo de esta fase es establecer una base sólida para el proyecto.

1.  **Instalación de Dependencias**:
    *   Ejecutar `bun install` para asegurar que todas las dependencias base de Astro estén instaladas.

2.  **Creación de Layouts**:
    *   Crear un layout principal en `src/layouts/MainLayout.astro`.
    *   Este layout contendrá la estructura HTML base (`<head>`, `<body>`), importará fuentes, y definirá los estilos globales con Tailwind CSS.

3.  **Estructura de Páginas**:
    *   Modificar `src/pages/index.astro` para que sea la página principal que mostrará el listado de Pokémon.
    *   Crear una ruta dinámica `src/pages/pokemon/[id].astro` que servirá para mostrar la página de detalle de cada Pokémon.

## Fase 2: Integración de API y Fetching de Datos

En esta fase nos conectaremos a una fuente de datos externa para obtener la información de los Pokémon.

1.  **Selección de API**:
    *   Utilizaremos la **PokeAPI (pokeapi.co)** como fuente de datos principal por ser gratuita y completa.

2.  **Servicio de Datos**:
    *   Crear un archivo de utilidad (ej. `src/services/pokemon.ts`) para encapsular la lógica de fetching.
    *   Implementar funciones para:
        *   `getPokemons(limit, offset)`: Obtener un listado paginado de Pokémon.
        *   `getPokemonDetails(id)`: Obtener los detalles de un Pokémon específico por su ID o nombre.

3.  **Renderizado en la Página Principal**:
    *   En `src/pages/index.astro`, usar la función `getPokemons` para obtener la primera generación de Pokémon y pasarlos como `props` a un componente de listado.

## Fase 3: Creación de Componentes de UI

Desarrollaremos los componentes reutilizables que formarán la interfaz de usuario.

1.  **Tarjeta de Pokémon (`PokemonCard.astro`)**:
    *   Crear un componente en `src/components/PokemonCard.astro`.
    *   Mostrará la imagen, el nombre y el número del Pokémon.
    *   Al hacer clic, deberá navegar a la página de detalle (`/pokemon/[id]`).

2.  **Listado de Pokémon (`PokemonList.astro`)**:
    *   Crear `src/components/PokemonList.astro` que recibirá un array de Pokémon y renderizará una `PokemonCard` por cada uno.

3.  **Vista de Detalle (`PokemonDetail.astro`)**:
    *   Crear `src/components/PokemonDetail.astro` para ser usado dentro de `src/pages/pokemon/[id].astro`.
    *   Mostrará información detallada: imagen, tipos, estadísticas (HP, ataque, defensa, etc.), altura y peso.

## Fase 4: Funcionalidad Interactiva

Añadiremos interactividad en el lado del cliente para mejorar la experiencia de usuario.

1.  **Búsqueda y Filtrado**:
    *   Implementar un componente interactivo (usando SolidJS o Preact, siguiendo las directrices de `GEMINI.md`) para filtrar el listado de Pokémon por nombre.
    *   Este componente se integrará en `index.astro` con una directiva `client:load`.

2.  **Paginación**:
    *   Añadir botones de "Siguiente" y "Anterior" en la página principal para cargar más Pokémon utilizando las funciones de fetching con `limit` y `offset`.

3.  **Estilos Dinámicos**:
    *   Aplicar estilos de Tailwind CSS que cambien según el tipo de Pokémon (ej. fondo de color fuego para Charmander).

## Fase 5: Pruebas y Despliegue

Aseguraremos la calidad del proyecto y lo prepararemos para producción.

1.  **Verificación con Astro Check**:
    *   Ejecutar `bun astro check` para validar la correctitud de tipos en el proyecto.

2.  **Construcción para Producción**:
    *   Generar el build de producción con `bun build`.

3.  **Previsualización Local**:
    *   Verificar que el sitio funcione correctamente con `bun preview`.

4.  **Despliegue**:
    *   Configurar el flujo de trabajo de GitHub Actions (`deploy.yml`) para desplegar automáticamente el sitio en una plataforma como Vercel o Netlify.

Este plan nos proporciona una hoja de ruta clara para construir la `pokeDB` de manera incremental y organizada.
