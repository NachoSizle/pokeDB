#!/usr/bin/env node

/**
 * 🔧 Script para corregir rutas de redirects en Netlify
 * Actualiza _redirects para usar la estructura correcta de Astro v5
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const redirectsPath = path.join(__dirname, '..', 'dist', '_redirects');

if (!fs.existsSync(redirectsPath)) {
  console.log('❌ Archivo _redirects no encontrado');
  process.exit(1);
}

try {
  // Leer el archivo _redirects actual
  let redirectsContent = fs.readFileSync(redirectsPath, 'utf8');
  console.log('� Contenido original de _redirects:');
  console.log(redirectsContent);
  
  // Reemplazar las rutas para que apunten a la función correcta
  const updatedContent = redirectsContent.replace(
    /\/.netlify\/functions\/ssr/g,
    '/.netlify/v1/functions/ssr'
  );
  
  // Escribir el archivo actualizado
  fs.writeFileSync(redirectsPath, updatedContent);
  
  console.log('✅ Archivo _redirects actualizado:');
  console.log(updatedContent);
  console.log('🎉 Redirects corregidos para Astro v5');
  
} catch (error) {
  console.error('❌ Error al procesar _redirects:', error.message);
  process.exit(1);
}
