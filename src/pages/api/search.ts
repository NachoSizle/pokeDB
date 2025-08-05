import type { APIRoute } from 'astro';
import { getAllPokemon, type PokemonData } from '../../services/pokemonDB';

export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = url.searchParams;
    const name = searchParams.get('name')?.toLowerCase() || '';
    const selectedTypes = searchParams.getAll('types[]').map(t => t.toLowerCase());
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

    const allPokemon = await getAllPokemon();

    let filteredPokemon = allPokemon.filter((pokemon: PokemonData) => {
      if (name && !pokemon.name.toLowerCase().includes(name)) {
        return false;
      }

      if (selectedTypes.length > 0) {
        const pokemonTypes = Array.isArray(pokemon.types) 
          ? pokemon.types 
          : (typeof pokemon.types === 'string' ? JSON.parse(pokemon.types) : []);
        
        const hasSelectedType = selectedTypes.some(selectedType => 
          pokemonTypes.some((t: string) => t.toLowerCase().includes(selectedType))
        );
        
        if (!hasSelectedType) {
          return false;
        }
      }

      const totalStats = pokemon.hp + pokemon.attack + pokemon.defense + 
                        (pokemon.stats['special-attack'] || 0) + 
                        (pokemon.stats['special-defense'] || 0) + 
                        (pokemon.stats['speed'] || 0);

      if (totalStats < minStats || totalStats > maxStats) return false;
      if (pokemon.hp < minHp || pokemon.hp > maxHp) return false;
      if (pokemon.attack < minAttack || pokemon.attack > maxAttack) return false;
      if (pokemon.defense < minDefense || pokemon.defense > maxDefense) return false;

      return true;
    });

    if (name || selectedTypes.length > 0 || minStats > 0 || maxStats < 999 || 
        minHp > 0 || maxHp < 999 || minAttack > 0 || maxAttack < 999 || 
        minDefense > 0 || maxDefense < 999) {
      filteredPokemon.sort((a, b) => b.totalStats - a.totalStats);
    } else {
      filteredPokemon.sort((a, b) => a.id - b.id);
    }

    const total = filteredPokemon.length;
    
    let results;
    if (name || selectedTypes.length > 0 || minStats > 0 || maxStats < 999 || 
        minHp > 0 || maxHp < 999 || minAttack > 0 || maxAttack < 999 || 
        minDefense > 0 || maxDefense < 999) {
      results = filteredPokemon.slice(offset, offset + limit);
    } else {
      results = filteredPokemon;
    }

    return new Response(JSON.stringify({
      success: true,
      results,
      pagination: {
        total,
        limit: results.length,
        offset,
        hasMore: results.length < total && offset + results.length < total
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
        'Cache-Control': 'public, max-age=300'
      }
    });

  } catch (error) {
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
