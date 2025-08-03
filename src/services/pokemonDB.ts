// 🗄️ Servicio de Pokémon con Astro DB + Turso - Arquitectura Robusta

import { db, eq, inArray } from 'astro:db';
import { asDrizzleTable } from '@astrojs/db/utils';
import { Pokemon as PokemonConfig } from '../../db/config';
import { getPokemons, getPokemonDetails, type PokemonDetails } from './pokemon';

// 🔄 Crear referencias type-safe a las tablas
const PokemonTable = asDrizzleTable('Pokemon', PokemonConfig);

// 🎯 Tipos de datos optimizados
export interface PokemonData {
  id: number;
  name: string;
  sprite: string;
  types: string[];
  stats: Record<string, number>;
  updatedAt: Date;
}

/**
 * 📊 Obtiene todos los Pokémon, llenando la base de datos si es necesario.
 */
export async function getAllPokemon(): Promise<PokemonData[]> {
  try {
    const cachedPokemon = await db.select().from(PokemonTable).all();
    if (cachedPokemon.length >= 151) {
      return cachedPokemon.map(p => ({
        id: p.id,
        name: p.name || '',
        sprite: p.sprite || '',
        types: p.types ? (p.types as string[]) : [],
        stats: p.stats ? (p.stats as Record<string, number>) : {},
        updatedAt: p.updatedAt || new Date(),
      }));
    }

    console.log("🔄 Base de datos vacía, obteniendo datos frescos desde PokéAPI...");
    const pokemonList = await getPokemons(151, 0);
    const pokemonDetailsPromises = pokemonList.results.map(p => getPokemonDetails(p.id));
    const pokemonDetailsResults = await Promise.all(pokemonDetailsPromises);

    const freshPokemonData = pokemonDetailsResults.map((details: PokemonDetails) => ({
      id: details.id,
      name: details.name,
      sprite: details.sprites.other['official-artwork'].front_default || details.sprites.front_default,
      types: details.types.map(t => t.type.name),
      stats: details.stats.reduce((acc, s) => {
        acc[s.stat.name] = s.base_stat;
        return acc;
      }, {} as Record<string, number>),
      updatedAt: new Date(),
    }));

    await db.insert(PokemonTable).values(freshPokemonData).execute();
    return freshPokemonData;

  } catch (error) {
    console.error("❌ Error crítico obteniendo Pokémon:", error);
    throw new Error("No se pudo obtener la lista de Pokémon. Revisa los logs del servidor.");
  }
}

/**
 * 🔍 Obtiene un Pokémon específico por ID desde la caché local
 */
export async function getPokemonById(id: number): Promise<PokemonData | null> {
  try {
    const allPokemon = await getAllPokemon();
    return allPokemon.find(p => p.id === id) || null;
  } catch (error) {
    console.error(`❌ Error obteniendo Pokémon ${id}:`, error);
    return null;
  }
}