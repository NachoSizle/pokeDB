// 🗄️ Servicio de Pokémon con Astro DB + Turso - Arquitectura Robusta

import { db, eq, inArray } from 'astro:db';
import { asDrizzleTable } from '@astrojs/db/utils';
import { Pokemon as PokemonConfig, Favorite as FavoriteConfig } from '../../db/config';
import { getPokemons, getPokemonDetails, type PokemonDetails } from './pokemon';

// 🔄 Crear referencias type-safe a las tablas
const PokemonTable = asDrizzleTable('Pokemon', PokemonConfig);
const FavoriteTable = asDrizzleTable('Favorite', FavoriteConfig);

// 🎯 Tipos de datos optimizados
export interface PokemonData {
  id: number;
  name: string;
  sprite: string;
  types: string[];
  stats: Record<string, number>;
  updatedAt: Date;
  isFavorite?: boolean;
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

/**
 * ⭐ Obtiene todos los Pokémon favoritos (LÓGICA REFACTORIZADA SIN JOIN)
 */
export async function getFavoritePokemon(): Promise<PokemonData[]> {
  try {
    // Paso 1: Obtener todos los IDs de la tabla de favoritos.
    const favoriteIdRows = await db.select({ pokemonId: FavoriteTable.pokemonId }).from(FavoriteTable).all();

    // Si no hay favoritos, devolver un array vacío inmediatamente.
    if (favoriteIdRows.length === 0) {
      return [];
    }

    // Extraer los IDs a un array simple: [1, 4, 7]
    const favoriteIds = favoriteIdRows.map(row => row.pokemonId);

    // Paso 2: Obtener todos los datos de los Pokémon que están en la lista de IDs.
    const favoritePokemons = await db.select().from(PokemonTable).where(inArray(PokemonTable.id, favoriteIds)).all();

    // Mapear el resultado al formato esperado, añadiendo isFavorite = true
    return favoritePokemons.map(p => ({ 
      ...p,
      id: p.id,
      name: p.name || '',
      sprite: p.sprite || '',
      types: p.types ? (p.types as string[]) : [],
      stats: p.stats ? (p.stats as Record<string, number>) : {},
      updatedAt: p.updatedAt || new Date(),
      isFavorite: true 
    }));

  } catch (error) {
    console.error("❌ Error DETALLADO en getFavoritePokemon (sin JOIN):", error);
    throw new Error(`Error de base de datos al obtener favoritos: ${error.message}`);
  }
}

/**
 * 💖 Añade un Pokémon a favoritos
 */
export async function addToFavorites(pokemonId: number): Promise<boolean> {
  try {
    const existing = await db.select().from(FavoriteTable).where(eq(FavoriteTable.pokemonId, pokemonId)).all();
    if (existing.length === 0) {
      await db.insert(FavoriteTable).values({ pokemonId }).execute();
    }
    return true;
  } catch (error) {
    console.error(`❌ Error añadiendo a favoritos:`, error);
    return false;
  }
}

/**
 * 🗑️ Remueve un Pokémon de favoritos
 */
export async function removeFromFavorites(pokemonId: number): Promise<boolean> {
  try {
    await db.delete(FavoriteTable).where(eq(FavoriteTable.pokemonId, pokemonId)).execute();
    return true;
  } catch (error) {
    console.error(`❌ Error removiendo de favoritos:`, error);
    return false;
  }
}

/**
 * 🔍 Verifica si un Pokémon es favorito
 */
export async function isFavorite(pokemonId: number): Promise<boolean> {
  try {
    const result = await db.select().from(FavoriteTable).where(eq(FavoriteTable.pokemonId, pokemonId)).all();
    return result.length > 0;
  } catch (error) {
    console.error(`❌ Error verificando favorito:`, error);
    return false;
  }
}
