#!/usr/bin/env node

/**
 * 🔧 Script para organizar funciones de Netlify correctamente
 * Mueve solo entry.mjs como función principal SSR
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const buildDir = path.join(__dirname, '..', '.netlify', 'build');
const functionsDir = path.join(__dirname, '..', '.netlify', 'functions-internal');

if (!fs.existsSync(buildDir)) {
  console.log('❌ Directorio .netlify/build no encontrado');
  process.exit(1);
}

try {
  // Crear directorio de funciones si no existe
  if (!fs.existsSync(functionsDir)) {
    fs.mkdirSync(functionsDir, { recursive: true });
    console.log('📁 Creado directorio .netlify/functions-internal');
  }

  // Copiar entry.mjs como la función SSR principal
  const entrySource = path.join(buildDir, 'entry.mjs');
  const entryDest = path.join(functionsDir, 'ssr.mjs');
  
  if (fs.existsSync(entrySource)) {
    fs.copyFileSync(entrySource, entryDest);
    console.log('✅ Copiado entry.mjs → ssr.mjs');
  } else {
    console.log('❌ No se encontró entry.mjs');
    process.exit(1);
  }

  console.log('🎉 Función SSR configurada correctamente');
  
} catch (error) {
  console.error('❌ Error al procesar funciones:', error.message);
  process.exit(1);
}
