// 🌱 Seed inicial - PokeDB
// Carga los primeros 151 Pokémon desde PokéAPI con datos completos

import { db } from 'astro:db';
import { asDrizzleTable } from '@astrojs/db/utils';
import { Pokemon } from './config';

// 🎮 Tipos para la PokéAPI
interface PokemonApiResponse {
  id: number;
  name: string;
  types: Array<{
    slot: number;
    type: { name: string; url: string };
  }>;
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: { name: string; url: string };
  }>;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
}

// 🚀 Función para obtener detalles completos de un Pokémon
async function getPokemonDetails(id: number): Promise<PokemonApiResponse> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!response.ok) {
    throw new Error(`Error obteniendo datos del Pokémon ${id}: ${response.status}`);
  }
  return response.json();
}

// 🕒 Función para añadir delay entre requests (ser amables con la API)
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// https://astro.build/db/seed
export default async function seed() {
  console.log("🌱 Iniciando seed de Pokémon con datos completos...");

  try {
    // 🗄️ Crear referencia type-safe a la tabla Pokemon
    const typeSafePokemon = asDrizzleTable('Pokemon', Pokemon);

    // 📡 Obtener lista de los primeros 151 Pokémon desde PokéAPI
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
    const data = await response.json();
    
    console.log(`📥 Obtenidos ${data.results.length} Pokémon básicos de la API`);
    console.log("🔄 Obteniendo datos completos de cada Pokémon...");

    const pokemonData = [];

    // 🎮 Procesar cada Pokémon obteniendo sus datos completos
    for (let i = 0; i < data.results.length; i++) {
      const pokemonId = i + 1;
      
      try {
        console.log(`📋 Procesando Pokémon ${pokemonId}/151: ${data.results[i].name}`);
        
        // 🎯 Obtener detalles completos
        const details = await getPokemonDetails(pokemonId);
        
        // 📊 Procesar estadísticas
        const statsObj = details.stats.reduce((acc, stat) => {
          acc[stat.stat.name] = stat.base_stat;
          return acc;
        }, {} as Record<string, number>);

        // 🔢 Calcular campos optimizados para búsqueda
        const totalStats = details.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
        const hp = details.stats.find(s => s.stat.name === 'hp')?.base_stat || 0;
        const attack = details.stats.find(s => s.stat.name === 'attack')?.base_stat || 0;
        const defense = details.stats.find(s => s.stat.name === 'defense')?.base_stat || 0;
        const primaryType = details.types[0]?.type.name || 'normal';
        const types = details.types.map(t => t.type.name);
        const sprite = details.sprites.other['official-artwork'].front_default || 
                      details.sprites.front_default || 
                      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

        // 🗄️ Preparar objeto para la base de datos
        pokemonData.push({
          id: details.id,
          name: details.name,
          sprite,
          types: JSON.stringify(types),
          stats: JSON.stringify(statsObj),
          primaryType,
          totalStats,
          hp,
          attack,
          defense,
          updatedAt: new Date()
        });

        // 🕒 Pequeño delay para no sobrecargar la API
        if (i < data.results.length - 1) {
          await delay(100); // 100ms entre requests
        }

      } catch (error) {
        console.error(`❌ Error procesando Pokémon ${pokemonId}:`, error);
        // Continuar con los siguientes Pokémon
        continue;
      }
    }

    console.log(`🎯 Procesados ${pokemonData.length} Pokémon exitosamente`);

    // 💾 Insertar todos los datos en la base de datos
    if (pokemonData.length > 0) {
      await db.insert(typeSafePokemon).values(pokemonData);
      console.log("✅ Seed completado exitosamente!");
      console.log(`🐾 ${pokemonData.length} Pokémon insertados en la base de datos con datos completos`);
    } else {
      console.warn("⚠️ No se pudieron procesar datos de Pokémon");
    }

  } catch (error) {
    console.error("❌ Error durante el seed:", error);
    throw error;
  }
}
