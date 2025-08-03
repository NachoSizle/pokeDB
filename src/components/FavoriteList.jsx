import { createResource, For, Show } from 'solid-js';
import PokemonCard from './PokemonCard.astro';

const fetchFavorites = async () => {
  try {
    // Usamos una URL relativa, que es más robusta.
    const response = await fetch('/api/favorites');
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.errorMessage || 'Error fetching favorites');
    }
    const data = await response.json();
    return data.favorites || [];
  } catch (error) {
    console.error("Error en fetchFavorites:", error);
    throw error; // Propagamos el error para mostrarlo en la UI
  }
};

function FavoriteList() {
  // El resource ya no depende de props, se ejecuta al cargar.
  const [favorites] = createResource(fetchFavorites);

  return (
    <Show when={!favorites.loading} fallback={<p class="text-center text-white">Cargando tus Pokémon favoritos...</p>}>
      <Show when={!favorites.error} fallback={
        <div class="text-center text-red-400 bg-red-900/50 p-6 rounded-lg">
          <p><strong>Error al cargar favoritos:</strong></p>
          <p>{favorites.error.message}</p>
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
                  Explora la Pokédex y marca tus Pokémon favoritos haciendo clic en el corazón
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
