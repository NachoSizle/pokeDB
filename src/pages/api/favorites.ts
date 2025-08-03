// 🌟 API Endpoint - Favoritos (MODO DEPURACIÓN)

import type { APIRoute } from 'astro';

// GET: Devuelve el estado de las variables de entorno en el runtime de Vercel
export const GET: APIRoute = async () => {
  const appToken = import.meta.env.ASTRO_DB_APP_TOKEN;

  const debugData = {
    message: "Este es el resultado de la depuración del API en el servidor de Vercel.",
    timestamp: new Date().toISOString(),
    env: {
      ASTRO_DB_APP_TOKEN: {
        isDefined: appToken !== undefined && appToken !== null,
        hasValue: !!appToken,
        length: appToken?.length || 0,
        partialValue: appToken ? `${appToken.substring(0, 4)}...` : 'No disponible',
      }
    }
  };

  return new Response(JSON.stringify(debugData), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

// POST: Deshabilitado temporalmente para depuración
export const POST: APIRoute = async () => {
  return new Response(JSON.stringify({ success: false, error: 'API en modo de depuración.' }), { status: 405 });
};
