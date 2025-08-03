// src/components/FavoriteButton.jsx
import { createSignal } from 'solid-js';

export default function FavoriteButton({ pokemonId, isInitiallyFavorite }) {
  const [isFavorite, setIsFavorite] = createSignal(isInitiallyFavorite);
  const [isLoading, setIsLoading] = createSignal(false);

  const toggleFavorite = async () => {
    if (isLoading()) return;
    setIsLoading(true);

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pokemonId }),
      });

      if (!response.ok) {
        throw new Error('Error updating favorites');
      }

      const data = await response.json();
      setIsFavorite(data.isFavorite);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      // Opcional: revertir el estado visual si la API falla
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={toggleFavorite}
      disabled={isLoading()}
      class={`p-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${ 
        isFavorite() 
          ? 'bg-pink-500 text-white hover:bg-pink-600 focus:ring-pink-400' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 focus:ring-gray-400'
      }`}
      aria-label={isFavorite() ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg class={`w-8 h-8 transition-transform duration-200 ${isLoading() ? 'animate-pulse' : 'hover:scale-110'}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    </button>
  );
}