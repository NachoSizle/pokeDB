// 🗄️ Servicio de Pokémon con Astro DB + Turso - Arquitectura Robusta

import { db, eq } from 'astro:db';
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
 * Esta función es la piedra angular del proyecto. Se ejecuta durante el `build`
 * para asegurar que todos los datos estén disponibles de forma estática.
 */
export async function getAllPokemon(): Promise<PokemonData[]> {
  try {
    // 1. Intentar obtener los Pokémon de la base de datos
    const cachedPokemon = await db.select().from(PokemonTable).all();

    // 2. Si la base de datos ya tiene los 151 Pokémon, devolverlos directamente
    if (cachedPokemon.length >= 151) {
      console.log(`✅ Usando datos de la base de datos - ${cachedPokemon.length} Pokémon`);
      return cachedPokemon.map(p => ({
        id: p.id,
        name: p.name || '',
        sprite: p.sprite || '',
        types: p.types ? (p.types as string[]) : [],
        stats: p.stats ? (p.stats as Record<string, number>) : {},
        updatedAt: p.updatedAt || new Date(),
      }));
    }

    // 3. Si la base de datos está vacía, llenarla desde la PokéAPI
    console.log("🔄 Base de datos vacía, obteniendo datos frescos desde PokéAPI...");

    // Obtener la lista básica de los 151 Pokémon
    const pokemonList = await getPokemons(151, 0);
    
    // Obtener los detalles completos para cada uno en paralelo
    console.log("📥 Obteniendo detalles de 151 Pokémon...");
    const pokemonDetailsPromises = pokemonList.results.map(p => getPokemonDetails(p.id));
    const pokemonDetailsResults = await Promise.all(pokemonDetailsPromises);

    // Transformar los datos para la base de datos
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

    // 4. Insertar los nuevos datos en la base de datos
    console.log("💾 Llenando la base de datos con datos enriquecidos...");
    await db.insert(PokemonTable).values(freshPokemonData).execute();

    console.log(`🎉 Base de datos llenada con ${freshPokemonData.length} Pokémon`);
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
 * ⭐ Obtiene todos los Pokémon favoritos (MODO DEPURACIÓN: SOLO LEE LA TABLA FAVORITE)
 */
export async function getFavoritePokemon(): Promise<any[]> { // Tipo de retorno cambiado a any[] para depuración
  try {
    console.log("Ejecutando consulta de depuración: SELECT * FROM FavoriteTable");
    // Hacemos la consulta más simple posible para ver si la tabla Favorite es accesible.
    const favoriteIds = await db.select().from(FavoriteTable).all();
    console.log(`Consulta de depuración exitosa, se encontraron ${favoriteIds.length} favoritos.`);
    
    // Devolvemos los datos crudos. El frontend no los mostrará, pero evitaremos el error 500.
    return favoriteIds;

  } catch (error) {
    console.error("❌ Error DETALLADO en la consulta de depuración:", error);
    throw new Error(`Error de base de datos al consultar la tabla Favorite: ${error.message}`);
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
      console.log(`💖 Pokémon ${pokemonId} añadido a favoritos`);
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
    const result = await db.select().from(FavoriteTable).where(eq(FavoriteTable.pokemonId, pokemonId)).all();
    return result.length > 0;
  } catch (error) {
    console.error(`❌ Error verificando favorito:`, error);
    return false;
  }
}
