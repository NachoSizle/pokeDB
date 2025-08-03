# 🏗️ Arquitectura Técnica - PokeDB

**Documentación técnica completa del proyecto PokeDB con Astro, siguiendo una arquitectura híbrida optimizada para rendimiento y escalabilidad.**

---

## 📋 **Índice**

1. [🎯 Arquitectura General](#-arquitectura-general)
2. [🚀 Modelo Híbrido (SSG/SSR)](#-modelo-híbrido-ssgssr)
3. [🗄️ Base de Datos y Flujo de Datos](#️-base-de-datos-y-flujo-de-datos)
4. [🌐 Deploy y CI/CD con Vercel](#-deploy-y-cicd-con-vercel)

---

## 🎯 **Arquitectura General**

### **Stack Tecnológico**

```
┌─────────────────────────────────────────────────────┐
│                 FRONTEND                            │
│  Astro v5+ + TypeScript + Tailwind CSS v4           │
└─────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────┐
│                 ROUTING                             │
│  Modelo Híbrido: SSG (páginas estáticas) + SSR      │
└─────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────┐
│                 BACKEND & BUILD                     │
│  Vercel Functions + Astro DB + PokéAPI             │
└─────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────┐
│                 DATABASE                            │
│  Turso (SQLite distribuida) + Drizzle ORM          │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 **Modelo Híbrido (SSG/SSR)**

La clave de la arquitectura de PokeDB es el **modelo híbrido** de Astro, que nos permite decidir el modo de renderizado por página para un rendimiento óptimo.

### **Configuración Principal (`astro.config.mjs`)**

Se establece `output: 'server'` para habilitar el renderizado en el servidor, lo que nos da la flexibilidad de elegir qué páginas son dinámicas y cuáles estáticas.

```javascript
// astro.config.mjs
export default defineConfig({
  output: 'server', // Habilita el modo híbrido
  adapter: vercel(), // Adaptador para despliegue en Vercel
});
```

### **Estrategia de Renderizado por Ruta**

| Ruta              | Modo de Renderizado | Razón de la Elección                                                                    |
|-------------------|---------------------|-----------------------------------------------------------------------------------------|
| `/`               | **SSG** (Estática)  | Página principal, contenido idéntico para todos. Se pre-renderiza para máxima velocidad y SEO. |
| `/pokemon/[id]`   | **SSG** (Estática)  | Los detalles de los 151 Pokémon son fijos. Se generan 151 páginas HTML en el `build`.   |
| `/favorites`      | **SSR** (Servidor)  | El contenido es dinámico y depende de las acciones del usuario (qué Pokémon ha marcado).  |
| `/api/*`          | **SSR** (Servidor)  | Endpoints de API que necesitan ejecutarse en el servidor para interactuar con la DB.     |

Para forzar que una página se genere de forma estática (SSG) en modo `server`, se utiliza `export const prerender = true;` en el script de la página.

---

## 🗄️ **Base de Datos y Flujo de Datos**

### **Schema de la Base de Datos (`db/config.ts`)**

El esquema se ha diseñado para almacenar toda la información necesaria de los Pokémon, evitando llamadas futuras a la API externa.

```typescript
// db/config.ts
import { defineDb, defineTable, column } from 'astro:db';

export const Pokemon = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
    sprite: column.text(),
    types: column.json(), // Almacena un array de strings, ej: ['grass', 'poison']
    stats: column.json(), // Almacena un objeto, ej: { "hp": 45, "attack": 49, ... }
    updatedAt: column.date(),
  }
});

export const Favorite = defineTable({
  columns: {
    pokemonId: column.number({ references: () => Pokemon.columns.id })
  }
});
```

### **Flujo de Datos en el `Build` (Proceso de Llenado)**

El problema de los errores 500 en Vercel se solucionó moviendo toda la carga de datos al proceso de `build`. Esto evita llamadas a la PokéAPI en tiempo de ejecución.

```mermaid
sequenceDiagram
    participant Build as Proceso de Build (Vercel)
    participant DB as Astro DB (Turso)
    participant API as PokéAPI

    Build->>DB: ¿Hay datos de Pokémon?
    alt Base de Datos Vacía
        DB-->>Build: No, estoy vacía.
        Build->>API: GET /pokemon?limit=151
        API-->>Build: Lista de 151 Pokémon
        
        Note right of Build: Pide detalles para cada Pokémon
        Build->>API: GET /pokemon/1 (details)
        Build->>API: GET /pokemon/2 (details)
        ... 
        API-->>Build: Detalles completos
        
        Build->>DB: INSERT 151 Pokémon con datos enriquecidos
        DB-->>Build: ¡Datos guardados!
    else Base de Datos con Datos
        DB-->>Build: Sí, aquí tienes los 151 Pokémon.
    end

    Note over Build,DB: Ahora, con los datos asegurados, se generan las páginas estáticas.
    Build->>Build: Genera /index.html
    Build->>Build: Genera /pokemon/1.html, /pokemon/2.html, ...
```

Este enfoque garantiza que la aplicación desplegada es extremadamente rápida y resiliente, ya que no depende de la disponibilidad de la PokéAPI para servir las páginas principales.

---

## 🌐 **Deploy y CI/CD con Vercel**

### **Configuración de Vercel**

El proyecto está configurado para un despliegue "zero-config" en Vercel gracias al `@astrojs/vercel` adapter. Vercel detecta automáticamente la configuración híbrida y despliega:

-   Las páginas SSG como assets estáticos en su CDN global.
-   Las páginas SSR (como `/favorites`) como Vercel Functions serverless.

### **Proceso de Sincronización de la Base de Datos**

Cuando se realizan cambios en el esquema de la base de datos (`db/config.ts`), es necesario sincronizarlo con la base de datos remota de Astro DB. Esto se hace con el siguiente comando:

```bash
# Empuja los cambios del esquema. El flag --force-reset borra la DB y la recrea.
# ¡Usar con cuidado! Es seguro en este proyecto porque los datos se pueden regenerar.
bunx astro db push --force-reset
```

Este comando es crucial y debe ejecutarse antes del `build` si el esquema ha cambiado.