// 🗄️ Configuración de Astro DB - PokeDB
// Esquema SQL para Pokémon y favoritos con Turso (libSQL)

import { defineDb, defineTable, column } from 'astro:db';

// 🐾 Tabla principal de Pokémon
export const Pokemon = defineTable({
  columns: {
    id: column.number({ primaryKey: true, autoIncrement: false }),
    name: column.text(),
    sprite: column.text(),
    types: column.json(), // 🎨 Almacena un array de strings
    stats: column.json(), // 📊 Almacena un objeto con las estadísticas
    updatedAt: column.date()
  }
});

// ⭐ Tabla de favoritos con referencia a Pokémon
export const Favorite = defineTable({
  columns: {
    pokemonId: column.number({ references: () => Pokemon.columns.id })
  }
});

// 📊 Exportar configuración de la base de datos
// https://astro.build/db/config
export default defineDb({
  tables: { 
    Pokemon, 
    Favorite 
  }
});
