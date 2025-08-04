// 🗄️ Configuración de Astro DB - PokeDB
// Esquema SQL para Pokémon con índices optimizados para búsqueda

import { defineDb, defineTable, column } from 'astro:db';

// 🐾 Tabla principal de Pokémon con índices optimizados
export const Pokemon = defineTable({
  columns: {
    id: column.number({ primaryKey: true, autoIncrement: false }),
    name: column.text(),
    sprite: column.text(),
    types: column.json(), // 🎨 Almacena un array de strings
    stats: column.json(), // 📊 Almacena un objeto con las estadísticas
    // 🔍 Campos optimizados para búsqueda
    primaryType: column.text(), // 🎯 Tipo principal para búsquedas rápidas
    totalStats: column.number(), // 📊 Suma total de stats para filtros
    hp: column.number(), // ❤️ HP individual para filtros granulares
    attack: column.number(), // ⚔️ Ataque individual
    defense: column.number(), // 🛡️ Defensa individual
    updatedAt: column.date()
  },
  indexes: {
    // 🚀 Índices para búsquedas ultrarrápidas
    nameIndex: { on: ["name"], unique: false },
    typeIndex: { on: ["primaryType"], unique: false },
    statsIndex: { on: ["totalStats"], unique: false },
    hpIndex: { on: ["hp"], unique: false }
  }
});

// 📊 Exportar configuración de la base de datos
// https://astro.build/db/config
export default defineDb({
  tables: { 
    Pokemon
  }
});