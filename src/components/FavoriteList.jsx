
import { useState, useEffect } from 'react';
import PokemonCard from './PokemonCard.astro'; // Astro va a manejar esto

function FavoriteList() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const response = await fetch('/api/favorites');
        if (!response.ok) {
          throw new Error('Error fetching favorites');
        }
        const data = await response.json();
        setFavorites(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchFavorites();
  }, []);

  if (loading) {
    return <p>Cargando tus Pokémon favoritos...</p>;
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-0">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 max-w-md mx-auto">
          <div className="text-6xl mb-6">💔</div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            No hay favoritos aún
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Explora la Pokédex y marca tus Pokémon favoritos haciendo clic en el corazón
          </p>
          <a 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <span>🔍</span>
            Explorar Pokédex
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {favorites.map(pokemon => (
        <PokemonCard pokemon={pokemon} />
      ))}
    </div>
  );
}

export default FavoriteList;
