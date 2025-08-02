// 🗄️ Servicio de Pokémon simplificado para Astro DB
// Integra base de datos local con caché básico

import { getPokemons, type PokemonListItem } from './pokemon';

// 🎯 Tipos de datos optimizados
export interface PokemonData {
  id: number;
  name: string;
  sprite: string;
  updatedAt: Date;
  isFavorite?: boolean;
}

// 📦 Variable de caché simple en memoria
let pokemonCache: PokemonData[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 horas

/**
 * 📊 Obtiene todos los Pokémon con caché TTL
 */
export async function getAllPokemon(): Promise<PokemonData[]> {
  try {
    const now = Date.now();
    
    // 🔍 Verificar caché
    if (pokemonCache && (now - cacheTimestamp) < CACHE_TTL_MS) {
      console.log("✅ Usando caché de Pokémon");
      return pokemonCache;
    }
    
    console.log("🔄 Obteniendo Pokémon desde PokéAPI...");
    
    // 🌐 Obtener datos frescos desde PokéAPI
    const pokemonList = await getPokemons(151, 0);
    
    // 🗂️ Transformar a formato interno
    pokemonCache = pokemonList.results.slice(0, 151).map((pokemon: PokemonListItem, index: number) => ({
      id: index + 1,
      name: pokemon.name,
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
      updatedAt: new Date()
    }));
    
    cacheTimestamp = now;
    console.log(`📥 Caché actualizado con ${pokemonCache?.length || 0} Pokémon`);
    
    return pokemonCache || [];
    
  } catch (error) {
    console.error("❌ Error obteniendo Pokémon:", error);
    
    // 🆘 Fallback a caché viejo si existe
    if (pokemonCache) {
      console.log("⚠️ Usando caché expirado como fallback");
      return pokemonCache;
    }
    
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

// 💾 Favoritos en memoria (temporal - en producción usar base de datos real)
let favorites: Set<number> = new Set();

/**
 * ⭐ Obtiene todos los Pokémon favoritos
 */
export async function getFavoritePokemon(): Promise<PokemonData[]> {
  try {
    const allPokemon = await getAllPokemon();
    return allPokemon
      .filter(pokemon => favorites.has(pokemon.id))
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
    favorites.add(pokemonId);
    console.log(`💖 Pokémon ${pokemonId} añadido a favoritos`);
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
    favorites.delete(pokemonId);
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
  return favorites.has(pokemonId);
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
