// 🔍 API Endpoint para búsqueda avanzada de Pokémon
// Endpoint optimizado que funciona con páginas estáticas

import type { APIRoute } from 'astro';
import { getAllPokemon, type PokemonData } from '../../services/pokemonDB';

export const GET: APIRoute = async ({ url }) => {
  try {
    // 📋 Obtener parámetros de búsqueda
    const searchParams = url.searchParams;
    const name = searchParams.get('name')?.toLowerCase() || '';
    const selectedTypes = searchParams.getAll('types[]').map(t => t.toLowerCase()); // Tipos múltiples
    const minStats = parseInt(searchParams.get('minStats') || '0');
    const maxStats = parseInt(searchParams.get('maxStats') || '999');
    const minHp = parseInt(searchParams.get('minHp') || '0');
    const maxHp = parseInt(searchParams.get('maxHp') || '999');
    const minAttack = parseInt(searchParams.get('minAttack') || '0');
    const maxAttack = parseInt(searchParams.get('maxAttack') || '999');
    const minDefense = parseInt(searchParams.get('minDefense') || '0');
    const maxDefense = parseInt(searchParams.get('maxDefense') || '999');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // 🎮 Obtener todos los Pokémon
    const allPokemon = await getAllPokemon();

    // 🔍 Aplicar filtros en memoria (para simplicidad)
    let filteredPokemon = allPokemon.filter((pokemon: PokemonData) => {
      // Filtro por nombre
      if (name && !pokemon.name.toLowerCase().includes(name)) {
        return false;
      }

      // Filtro por tipos múltiples - parsear JSON si es string
      if (selectedTypes.length > 0) {
        const pokemonTypes = Array.isArray(pokemon.types) 
          ? pokemon.types 
          : (typeof pokemon.types === 'string' ? JSON.parse(pokemon.types) : []);
        
        // Verificar si el Pokémon tiene al menos uno de los tipos seleccionados
        const hasSelectedType = selectedTypes.some(selectedType => 
          pokemonTypes.some((t: string) => t.toLowerCase().includes(selectedType))
        );
        
        if (!hasSelectedType) {
          return false;
        }
      }

      // Calcular stats para filtros
      const totalStats = pokemon.hp + pokemon.attack + pokemon.defense + 
                        (pokemon.stats['special-attack'] || 0) + 
                        (pokemon.stats['special-defense'] || 0) + 
                        (pokemon.stats['speed'] || 0);

      // Filtros por estadísticas
      if (totalStats < minStats || totalStats > maxStats) return false;
      if (pokemon.hp < minHp || pokemon.hp > maxHp) return false;
      if (pokemon.attack < minAttack || pokemon.attack > maxAttack) return false;
      if (pokemon.defense < minDefense || pokemon.defense > maxDefense) return false;

      return true;
    });

    // 📊 Ordenar por poder total (descendente)
    filteredPokemon.sort((a, b) => b.totalStats - a.totalStats);

    // 📄 Aplicar paginación
    const total = filteredPokemon.length;
    const results = filteredPokemon.slice(offset, offset + limit);

    // 🎯 Respuesta optimizada
    return new Response(JSON.stringify({
      success: true,
      results,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + results.length < total
      },
      filters: {
        name,
        selectedTypes,
        minStats,
        maxStats,
        minHp,
        maxHp,
        minAttack,
        maxAttack,
        minDefense,
        maxDefense
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300' // 5 minutos de caché
      }
    });

  } catch (error) {
    console.error('❌ Error en API de búsqueda:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Error interno del servidor',
      results: [],
      pagination: { total: 0, limit: 0, offset: 0, hasMore: false }
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

// 📋 Endpoint para obtener metadatos de filtros
export const POST: APIRoute = async () => {
  try {
    const allPokemon = await getAllPokemon();
    
    // 🎨 Tipos únicos - parsear correctamente los tipos desde JSON
    const allTypes = allPokemon.flatMap(p => {
      const pokemonTypes = Array.isArray(p.types) 
        ? p.types 
        : (typeof p.types === 'string' ? JSON.parse(p.types) : []);
      return pokemonTypes;
    });
    const types = [...new Set(allTypes)].sort();
    
    // 📊 Rangos de estadísticas
    const totalStats = allPokemon.map(p => p.totalStats);
    const hpValues = allPokemon.map(p => p.hp);
    const attackValues = allPokemon.map(p => p.attack);
    const defenseValues = allPokemon.map(p => p.defense);

    const metadata = {
      types,
      ranges: {
        totalStats: {
          min: Math.min(...totalStats),
          max: Math.max(...totalStats)
        },
        hp: {
          min: Math.min(...hpValues),
          max: Math.max(...hpValues)
        },
        attack: {
          min: Math.min(...attackValues),
          max: Math.max(...attackValues)
        },
        defense: {
          min: Math.min(...defenseValues),
          max: Math.max(...defenseValues)
        }
      }
    };

    return new Response(JSON.stringify({
      success: true,
      metadata
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600' // 1 hora de caché
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo metadatos:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Error obteniendo metadatos'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
