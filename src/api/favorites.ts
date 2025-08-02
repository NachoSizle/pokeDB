// 🌟 API Endpoint - Favoritos
// POST: Añade/remueve Pokémon de favoritos

import type { APIRoute } from 'astro';
import { addToFavorites, removeFromFavorites } from '../services/pokemonDB';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { pokemonId, action } = body;
    
    // Validar datos de entrada
    if (!pokemonId || !action) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'pokemonId y action son requeridos' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    if (!['add', 'remove'].includes(action)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'action debe ser "add" o "remove"' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Validar que pokemonId sea un número
    const id = parseInt(pokemonId);
    if (isNaN(id) || id < 1 || id > 151) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'pokemonId debe ser un número entre 1 y 151' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Ejecutar acción
    let result: boolean;
    if (action === 'add') {
      result = await addToFavorites(id);
    } else {
      result = await removeFromFavorites(id);
    }
    
    if (result) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Pokémon ${action === 'add' ? 'añadido a' : 'removido de'} favoritos`,
          pokemonId: id,
          action
        }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Error procesando la solicitud' 
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
  } catch (error) {
    console.error('Error en API de favoritos:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Error interno del servidor' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

// GET: Obtiene todos los favoritos
export const GET: APIRoute = async () => {
  try {
    const { getFavoritePokemon } = await import('../services/pokemonDB');
    const favorites = await getFavoritePokemon();
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        favorites,
        count: favorites.length 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Error obteniendo favoritos:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Error obteniendo favoritos' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
