import { createResource, Show } from 'solid-js';

// Función para obtener los datos de depuración de la API
const fetchDebugInfo = async (apiBase) => {
  try {
    const url = new URL('/api/favorites', apiBase).href;
    const response = await fetch(url);
    if (!response.ok) {
      return { error: `Error del servidor: ${response.statusText}` };
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return { error: 'Error de red al contactar la API de depuración.' };
  }
};

// Componente para mostrar la información de depuración
function FavoriteList(props) {
  const [debugInfo] = createResource(() => props.apiBase, fetchDebugInfo);

  return (
    <div class="max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl shadow-2xl text-white font-mono">
      <h2 class="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
        Resultados de Depuración del Runtime de Vercel
      </h2>
      
      <Show when={!debugInfo.loading} fallback={<p>Cargando información de depuración desde la API...</p>}>
        <Show when={!debugInfo().error} fallback={<p class="text-red-400">Error: {debugInfo().error}</p>}>
          <pre class="bg-gray-900/70 p-6 rounded-lg overflow-x-auto">
            <code>{JSON.stringify(debugInfo(), null, 2)}</code>
          </pre>
        </Show>
      </Show>

      <div class="mt-8 p-4 bg-red-900/50 border border-red-700 rounded-lg text-sm">
        <h3 class="font-bold text-red-300">Interpretación</h3>
        <p class="text-red-400 mt-2">
          Si `hasValue` es `false` o `length` es `0`, la variable de entorno `ASTRO_DB_APP_TOKEN`
          NO está llegando a la función serverless de Vercel, a pesar de estar configurada en la UI.
          Esto es un problema de configuración o de propagación en la plataforma de Vercel.
        </p>
      </div>
    </div>
  );
}

export default FavoriteList;
