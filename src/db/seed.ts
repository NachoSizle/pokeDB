// 🌱 Seed inicial - PokeDB
// Carga los primeros 151 Pokémon desde PokéAPI

import { db } from 'astro:db';
import { asDrizzleTable } from '@astrojs/db/utils';
import { Pokemon } from './config';

// https://astro.build/db/seed
export default async function seed() {
  console.log("🌱 Iniciando seed de Pokémon...");

  try {
    // � Crear referencia type-safe a la tabla Pokemon
    const typeSafePokemon = asDrizzleTable('Pokemon', Pokemon);

    // �📡 Obtener lista de los primeros 151 Pokémon desde PokéAPI
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
    const data = await response.json();
    
    console.log(`📥 Obtenidos ${data.results.length} Pokémon de la API`);

    // 🗄️ Preparar datos para inserción
    const pokemonData = data.results.map((pokemon: any, index: number) => ({
      id: index + 1,
      name: pokemon.name,
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
      updatedAt: new Date()
    }));

    // 💾 Insertar en la base de datos
    await db.insert(typeSafePokemon).values(pokemonData);
    
    console.log("✅ Seed completado exitosamente!");
    console.log(`🐾 ${pokemonData.length} Pokémon insertados en la base de datos`);

  } catch (error) {
    console.error("❌ Error durante el seed:", error);
    throw error;
  }
}
