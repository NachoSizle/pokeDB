// 🌟 API Endpoint - Favoritos
// POST: Añade o remueve un Pokémon de la lista de favoritos (toggle).

import type { APIRoute } from 'astro';
import { isFavorite, addToFavorites, removeFromFavorites, getFavoritePokemon } from '../../services/pokemonDB';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { pokemonId } = body;

    if (!pokemonId || typeof pokemonId !== 'number' || pokemonId < 1 || pokemonId > 151) {
      return new Response(JSON.stringify({ success: false, error: 'ID de Pokémon inválido.' }), { status: 400 });
    }

    const wasFavorite = await isFavorite(pokemonId);
    let success = false;

    if (wasFavorite) {
      success = await removeFromFavorites(pokemonId);
    } else {
      success = await addToFavorites(pokemonId);
    }

    if (success) {
      return new Response(JSON.stringify({ 
        success: true, 
        isFavorite: !wasFavorite 
      }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ success: false, error: 'Error al actualizar favoritos.' }), { status: 500 });
    }

  } catch (error) {
    console.error('Error en API de favoritos:', error);
    return new Response(JSON.stringify({ success: false, error: 'Error interno del servidor.' }), { status: 500 });
  }
};

// GET: Obtiene todos los Pokémon marcados como favoritos.
export const GET: APIRoute = async () => {
  try {
    const favorites = await getFavoritePokemon();
    return new Response(JSON.stringify({ success: true, favorites }), { status: 200 });
  } catch (error) {
    console.error('Error en el endpoint GET /api/favorites:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Error interno del servidor.',
      errorMessage: error.message 
    }), { status: 500 });
  }
};
