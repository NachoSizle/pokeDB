// 🗄️ Servicio de Pokémon con Astro DB + Turso - Arquitectura Robusta

import { db } from 'astro:db';
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
  // 🔍 Campos optimizados para búsqueda
  primaryType: string;
  totalStats: number;
  hp: number;
  attack: number;
  defense: number;
  updatedAt: Date;
}

/**
 * 📊 Obtiene todos los Pokémon, llenando la base de datos si es necesario.
 */
export async function getAllPokemon(): Promise<PokemonData[]> {
  try {
    // 🔄 Intentar obtener desde base de datos
    const cachedPokemon = await db.select().from(PokemonTable).all();
    if (cachedPokemon.length >= 151) {
      console.log(`✅ ${cachedPokemon.length} Pokémon cargados desde caché`);
      return cachedPokemon.map(p => ({
        id: p.id,
        name: p.name || '',
        sprite: p.sprite || '',
        types: p.types ? (p.types as string[]) : [],
        stats: p.stats ? (p.stats as Record<string, number>) : {},
        primaryType: p.primaryType || '',
        totalStats: p.totalStats || 0,
        hp: p.hp || 0,
        attack: p.attack || 0,
        defense: p.defense || 0,
        updatedAt: p.updatedAt || new Date(),
      }));
    }

    console.log("🔄 Base de datos vacía, obteniendo datos frescos desde PokéAPI...");
    return await populateDatabase();

  } catch (dbError) {
    console.warn("⚠️ Error de base de datos (posible auth):", dbError);
    
    // 🚨 FALLBACK: Si falla la DB, usar datos directos desde PokéAPI
    console.log("🔄 Fallback: obteniendo datos directamente desde PokéAPI...");
    return await populateDatabase();
  }
}

/**
 * 🏗️ Función auxiliar para poblar la base de datos
 */
async function populateDatabase(): Promise<PokemonData[]> {
  try {
    const pokemonList = await getPokemons(151, 0);
    const pokemonDetailsPromises = pokemonList.results.map(p => getPokemonDetails(p.id));
    const pokemonDetailsResults = await Promise.all(pokemonDetailsPromises);

    const freshPokemonData = pokemonDetailsResults.map((details: PokemonDetails) => {
      const statsObj = details.stats.reduce((acc, s) => {
        acc[s.stat.name] = s.base_stat;
        return acc;
      }, {} as Record<string, number>);

      // 🔍 Calcular campos optimizados para búsqueda
      const totalStats = details.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
      const hp = details.stats.find(s => s.stat.name === 'hp')?.base_stat || 0;
      const attack = details.stats.find(s => s.stat.name === 'attack')?.base_stat || 0;
      const defense = details.stats.find(s => s.stat.name === 'defense')?.base_stat || 0;
      const primaryType = details.types[0]?.type.name || 'normal';

      return {
        id: details.id,
        name: details.name,
        sprite: details.sprites.other['official-artwork'].front_default || details.sprites.front_default,
        types: details.types.map(t => t.type.name),
        stats: statsObj,
        primaryType,
        totalStats,
        hp,
        attack,
        defense,
        updatedAt: new Date(),
      };
    });

    // 🔄 Intentar guardar en BD, pero no fallar si no se puede
    try {
      await db.insert(PokemonTable).values(freshPokemonData).execute();
      console.log("✅ Datos guardados en base de datos");
    } catch (saveError) {
      console.warn("⚠️ No se pudieron guardar los datos en BD:", saveError);
      console.log("✅ Continuando con datos en memoria...");
    }

    return freshPokemonData;

  } catch (apiError) {
    console.error("❌ Error obteniendo datos desde PokéAPI:", apiError);
    throw new Error("No se pudo obtener datos desde ninguna fuente. Revisa tu conexión a internet.");
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

// 🔍 **FUNCIONES DE BÚSQUEDA SIMPLIFICADAS**

export interface SearchFilters {
  name?: string;
  type?: string;
  minStats?: number;
  maxStats?: number;
  minHp?: number;
  maxHp?: number;
  minAttack?: number;
  maxAttack?: number;
  minDefense?: number;
  maxDefense?: number;
}

/**
 * 🚀 Búsqueda simple en memoria (compatible con páginas estáticas)
 */
export async function searchPokemonSimple(filters: SearchFilters): Promise<PokemonData[]> {
  try {
    const allPokemon = await getAllPokemon();
    
    return allPokemon.filter(pokemon => {
      // Filtro por nombre
      if (filters.name && !pokemon.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }

      // Filtro por tipo
      if (filters.type && !pokemon.types.some(t => t.toLowerCase().includes(filters.type!.toLowerCase()))) {
        return false;
      }

      // Filtros por estadísticas
      if (filters.minStats !== undefined && pokemon.totalStats < filters.minStats) return false;
      if (filters.maxStats !== undefined && pokemon.totalStats > filters.maxStats) return false;
      if (filters.minHp !== undefined && pokemon.hp < filters.minHp) return false;
      if (filters.maxHp !== undefined && pokemon.hp > filters.maxHp) return false;
      if (filters.minAttack !== undefined && pokemon.attack < filters.minAttack) return false;
      if (filters.maxAttack !== undefined && pokemon.attack > filters.maxAttack) return false;
      if (filters.minDefense !== undefined && pokemon.defense < filters.minDefense) return false;
      if (filters.maxDefense !== undefined && pokemon.defense > filters.maxDefense) return false;

      return true;
    }).sort((a, b) => b.totalStats - a.totalStats); // Ordenar por poder total

  } catch (error) {
    console.error("❌ Error en búsqueda:", error);
    return [];
  }
}

/**
 * 📋 Obtiene todos los tipos únicos disponibles
 */
export async function getAvailableTypes(): Promise<string[]> {
  try {
    const allPokemon = await getAllPokemon();
    const typesSet = new Set<string>();
    
    allPokemon.forEach(pokemon => {
      pokemon.types.forEach(type => typesSet.add(type));
    });
    
    return Array.from(typesSet).sort();
  } catch (error) {
    console.error("❌ Error obteniendo tipos:", error);
    return ['fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark']; // fallback
  }
}

/**
 * 📊 Obtiene rangos de estadísticas para filtros dinámicos
 */
export async function getStatsRanges(): Promise<{
  totalStats: { min: number; max: number };
  hp: { min: number; max: number };
  attack: { min: number; max: number };
  defense: { min: number; max: number };
}> {
  try {
    const allPokemon = await getAllPokemon();
    
    if (allPokemon.length === 0) {
      return {
        totalStats: { min: 0, max: 800 },
        hp: { min: 0, max: 255 },
        attack: { min: 0, max: 255 },
        defense: { min: 0, max: 255 }
      };
    }

    const totalStats = allPokemon.map(p => p.totalStats);
    const hpValues = allPokemon.map(p => p.hp);
    const attackValues = allPokemon.map(p => p.attack);
    const defenseValues = allPokemon.map(p => p.defense);

    return {
      totalStats: { min: Math.min(...totalStats), max: Math.max(...totalStats) },
      hp: { min: Math.min(...hpValues), max: Math.max(...hpValues) },
      attack: { min: Math.min(...attackValues), max: Math.max(...attackValues) },
      defense: { min: Math.min(...defenseValues), max: Math.max(...defenseValues) }
    };
  } catch (error) {
    console.error("❌ Error obteniendo rangos:", error);
    return {
      totalStats: { min: 0, max: 800 },
      hp: { min: 0, max: 255 },
      attack: { min: 0, max: 255 },
      defense: { min: 0, max: 255 }
    };
  }
}