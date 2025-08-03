import { createResource, For, Show } from 'solid-js';
import PokemonCard from './PokemonCard.astro';

const fetchFavorites = async (apiBase) => {
  // Si por alguna razón la prop apiBase no llega, evitamos un crash.
  if (!apiBase) {
    throw new Error('La URL base de la API no fue proporcionada al componente.');
  }

  try {
    const url = new URL('/api/favorites', apiBase).href;
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.errorMessage || `El servidor respondió con un error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.favorites || [];
  } catch (error) {
    console.error("Error detallado en fetchFavorites:", error);
    // Propagamos el error para que Solid lo capture y lo muestre en la UI.
    throw error;
  }
};

function FavoriteList(props) {
  const [favorites] = createResource(() => props.apiBase, fetchFavorites);

  return (
    <Show when={!favorites.loading} fallback={<p class="text-center text-white">Cargando tus Pokémon favoritos...</p>}>
      {/* Bloque mejorado para mostrar errores de forma visible */}
      <Show when={!favorites.error} fallback={
        <div class="text-center text-red-300 bg-red-900/50 p-6 rounded-lg max-w-lg mx-auto border border-red-700">
          <h3 class="text-xl font-bold mb-2">Oops, algo salió mal</h3>
          <p class="font-mono text-sm bg-red-900/70 p-2 rounded">{favorites.error.message}</p>
        </div>
      }>
        <Show when={favorites() && favorites().length > 0} 
          fallback={
            <div class="text-center py-0">
              <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 max-w-md mx-auto">
                <div class="text-6xl mb-6">💔</div>
                <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  No hay favoritos aún
                </h3>
                <p class="text-gray-600 dark:text-gray-300 mb-8">
                  Explora la Pokédex y marca tus Pokémon favoritos haciendo clic en el corazón.
                </p>
                <a 
                  href="/"
                  class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <span>🔍</span>
                  Explorar Pokédex
                </a>
              </div>
            </div>
          }
        >
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <For each={favorites()}>
              {(pokemon) => <PokemonCard pokemon={pokemon} />}
            </For>
          </div>
        </Show>
      </Show>
    </Show>
  );
}

export default FavoriteList;
