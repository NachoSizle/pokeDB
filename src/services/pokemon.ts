// 🚀 Servicio optimizado para la PokeAPI
// Enfocado en rendimiento y experiencia de usuario fluida

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

// Tipos de datos principales
export interface PokemonListItem {
  name: string;
  url: string;
  id: number;
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonStats {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonSprites {
  front_default: string;
  front_shiny: string;
  other: {
    'official-artwork': {
      front_default: string;
    };
  };
}

export interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: PokemonType[];
  stats: PokemonStats[];
  sprites: PokemonSprites;
  base_experience: number;
}

// Cache en memoria para optimizar rendimiento
const cache = new Map<string, any>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos

interface CacheEntry {
  data: any;
  timestamp: number;
}

function setCache(key: string, data: any) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

function getCache(key: string): any | null {
  const entry = cache.get(key) as CacheEntry;
  if (!entry) return null;
  
  if (Date.now() - entry.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  
  return entry.data;
}

// Función de fetch optimizada con retry y timeout
async function fetchWithRetry(url: string, maxRetries = 3): Promise<any> {
  const cacheKey = url;
  const cached = getCache(cacheKey);
  
  if (cached) {
    return cached;
  }

  for (let i = 0; i < maxRetries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout
      
      const response = await fetch(url, { 
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCache(cacheKey, data);
      return data;
      
    } catch (error) {
      console.warn(`Intento ${i + 1} fallido para ${url}:`, error);
      if (i === maxRetries - 1) throw error;
      
      // Backoff exponencial
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
}

/**
 * Obtiene una lista paginada de Pokémon
 * @param limit - Número máximo de Pokémon a obtener (default: 20)
 * @param offset - Número de Pokémon a saltar (default: 0)
 */
export async function getPokemons(limit: number = 20, offset: number = 0): Promise<{
  results: PokemonListItem[];
  count: number;
  next: string | null;
  previous: string | null;
}> {
  try {
    const url = `${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;
    const data = await fetchWithRetry(url);
    
    // Procesamos los resultados para incluir el ID
    const results: PokemonListItem[] = data.results.map((pokemon: any) => {
      const urlParts = pokemon.url.split('/');
      const id = parseInt(urlParts[urlParts.length - 2]);
      
      return {
        name: pokemon.name,
        url: pokemon.url,
        id
      };
    });
    
    return {
      results,
      count: data.count,
      next: data.next,
      previous: data.previous
    };
    
  } catch (error) {
    console.error('Error fetching Pokémon list:', error);
    throw new Error('No se pudo obtener la lista de Pokémon. Por favor, intenta de nuevo.');
  }
}

/**
 * Obtiene los detalles completos de un Pokémon específico
 * @param idOrName - ID numérico o nombre del Pokémon
 */
export async function getPokemonDetails(idOrName: string | number): Promise<PokemonDetails> {
  try {
    const url = `${POKEAPI_BASE_URL}/pokemon/${idOrName}`;
    const data = await fetchWithRetry(url);
    
    return {
      id: data.id,
      name: data.name,
      height: data.height,
      weight: data.weight,
      types: data.types,
      stats: data.stats,
      sprites: data.sprites,
      base_experience: data.base_experience
    };
    
  } catch (error) {
    console.error(`Error fetching Pokémon details for ${idOrName}:`, error);
    throw new Error(`No se pudo obtener información del Pokémon "${idOrName}". Verifica que el nombre o ID sea correcto.`);
  }
}

/**
 * Obtiene múltiples detalles de Pokémon en paralelo para mejor rendimiento
 * @param pokemonList - Lista de Pokémon básicos
 */
export async function getPokemonDetailsInParallel(pokemonList: PokemonListItem[]): Promise<PokemonDetails[]> {
  try {
    const promises = pokemonList.map(pokemon => getPokemonDetails(pokemon.id));
    const results = await Promise.allSettled(promises);
    
    return results
      .filter((result): result is PromiseFulfilledResult<PokemonDetails> => result.status === 'fulfilled')
      .map(result => result.value);
      
  } catch (error) {
    console.error('Error fetching multiple Pokémon details:', error);
    throw new Error('Error al obtener detalles de múltiples Pokémon.');
  }
}

/**
 * Utilidad para obtener el color asociado a un tipo de Pokémon
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
 * Capitaliza la primera letra de un string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
