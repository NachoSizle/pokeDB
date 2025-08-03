// 🗄️ Servicio de Pokémon con Astro DB + Turso - Caché TTL persistente
// Arquitectura completa con base de datos real

import { db, eq } from 'astro:db';
import { asDrizzleTable } from '@astrojs/db/utils';
import { Pokemon as PokemonConfig, Favorite as FavoriteConfig } from '../../db/config';

// 🔄 Crear referencias type-safe a las tablas
const Pokemon = asDrizzleTable('Pokemon', PokemonConfig);
const Favorite = asDrizzleTable('Favorite', FavoriteConfig);
import { getPokemons, type PokemonListItem } from './pokemon';

// 🎯 Tipos de datos optimizados
export interface PokemonData {
  id: number;
  name: string;
  sprite: string;
  updatedAt: Date;
  isFavorite?: boolean;
}

/**
 * 📊 Obtiene todos los Pokémon de forma segura para entornos serverless
 */
export async function getAllPokemon(): Promise<PokemonData[]> {
  try {
    // 1. Intentar obtener los Pokémon de la base de datos
    const cachedPokemon = await db.select().from(Pokemon).all();

    // 2. Si la base de datos ya tiene datos, devolverlos directamente
    // Esto evita condiciones de carrera en entornos serverless
    if (cachedPokemon.length > 0) {
      console.log(`✅ Usando datos de la base de datos - ${cachedPokemon.length} Pokémon`);
      return cachedPokemon.map((p, index) => ({
        id: index + 1, // Asumir IDs secuenciales
        name: p.name || '',
        sprite: p.sprite || '',
        updatedAt: p.updatedAt || new Date(),
      }));
    }

    // 3. Si la base de datos está vacía, llenarla desde la PokéAPI
    console.log("🔄 Base de datos vacía, obteniendo desde PokéAPI...");

    const pokemonList = await getPokemons(151, 0);

    const freshPokemon = pokemonList.results.slice(0, 151).map((pokemon: PokemonListItem, index: number) => ({
      id: index + 1,
      name: pokemon.name,
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
      updatedAt: new Date(),
    }));

    // 4. Insertar los nuevos datos en la base de datos
    console.log("💾 Llenando la base de datos...");
    const insertData = freshPokemon.map(p => ({ name: p.name, sprite: p.sprite, updatedAt: p.updatedAt }));
    await db.insert(Pokemon).values(insertData).execute();

    console.log(`📥 Base de datos llenada con ${freshPokemon.length} Pokémon`);
    return freshPokemon;

  } catch (error) {
    console.error("❌ Error obteniendo Pokémon:", error);
    // En caso de error, es mejor lanzar una excepción para que el problema sea visible
    throw new Error("No se pudo obtener la lista de Pokémon");
  }
}


/**
 * 🔍 Obtiene un Pokémon específico por ID
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
 * ⭐ Obtiene todos los Pokémon favoritos
 */
export async function getFavoritePokemon(): Promise<PokemonData[]> {
  try {
    // 🗄️ Obtener IDs de favoritos desde base de datos
    const favoriteIds = await db.select().from(Favorite).all();
    
    if (favoriteIds.length === 0) {
      return [];
    }
    
    // 📋 Obtener todos los Pokémon
    const allPokemon = await getAllPokemon();
    
    // 🔍 Filtrar solo los favoritos
    const favoriteIdSet = new Set(favoriteIds.map(f => f.pokemonId));
    return allPokemon
      .filter(pokemon => favoriteIdSet.has(pokemon.id))
      .map(pokemon => ({ ...pokemon, isFavorite: true }));
    
  } catch (error) {
    console.error("❌ Error obteniendo favoritos:", error);
    return [];
  }
}

/**
 * 💖 Añade un Pokémon a favoritos
 */
export async function addToFavorites(pokemonId: number): Promise<boolean> {
  try {
    // 🔍 Verificar si ya existe para evitar duplicados
    const existing = await db.select().from(Favorite).where(eq(Favorite.pokemonId, pokemonId)).all();
    
    if (existing.length === 0) {
      // 💾 Insertar en base de datos
      await db.insert(Favorite).values({ pokemonId }).execute();
      console.log(`💖 Pokémon ${pokemonId} añadido a favoritos`);
    } else {
      console.log(`ℹ️ Pokémon ${pokemonId} ya está en favoritos`);
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
    // 🗑️ Eliminar de base de datos
    await db.delete(Favorite).where(eq(Favorite.pokemonId, pokemonId)).execute();
    console.log(`💔 Pokémon ${pokemonId} removido de favoritos`);
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
    const result = await db.select().from(Favorite).where(eq(Favorite.pokemonId, pokemonId)).all();
    return result.length > 0;
  } catch (error) {
    console.error(`❌ Error verificando favorito:`, error);
    return false;
  }
}

/**
 * 🎨 Utilidad: Obtiene el color asociado a un tipo de Pokémon
 */
export function getTypeColor(typeName: string): string {
  const typeColors: Record<string, string> = {
    fire: 'from-red-500 to-orange-500',
    water: 'from-blue-500 to-cyan-500',
    grass: 'from-green-500 to-emerald-500',
    electric: 'from-yellow-400 to-yellow-500',
    psychic: 'from-pink-500 to-purple-500',
    ice: 'from-cyan-400 to-blue-400',
    dragon: 'from-purple-600 to-indigo-600',
    dark: 'from-gray-800 to-gray-900',
    fighting: 'from-red-600 to-orange-600',
    poison: 'from-purple-500 to-pink-500',
    ground: 'from-yellow-600 to-orange-600',
    flying: 'from-blue-400 to-purple-400',
    bug: 'from-green-400 to-lime-500',
    rock: 'from-yellow-600 to-gray-600',
    ghost: 'from-purple-600 to-gray-600',
    steel: 'from-gray-400 to-gray-600',
    fairy: 'from-pink-400 to-purple-400',
    normal: 'from-gray-400 to-gray-500'
  };
  
  return typeColors[typeName] || 'from-gray-400 to-gray-500';
}

/**
 * 🔤 Utilidad: Capitaliza la primera letra
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}