#!/usr/bin/env node

/**
 * 🔧 Script para renombrar funciones de Netlify con caracteres especiales
 * Este script resuelve el problema de nombres de función que contienen '@' u otros caracteres especiales
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const buildDir = path.join(__dirname, '..', '.netlify', 'build');

if (!fs.existsSync(buildDir)) {
  console.log('❌ Directorio .netlify/build no encontrado');
  process.exit(1);
}

try {
  const files = fs.readdirSync(buildDir);
  console.log('📂 Archivos en .netlify/build:', files);
  
  // Buscar archivos con caracteres especiales
  const problematicFiles = files.filter(file => 
    file.includes('@') || file.includes('-') && file.startsWith('_')
  );
  
  if (problematicFiles.length === 0) {
    console.log('✅ No se encontraron archivos con nombres problemáticos');
    process.exit(0);
  }
  
  problematicFiles.forEach(file => {
    // Separar nombre y extensión
    const ext = path.extname(file);
    const baseName = path.basename(file, ext);
    
    // Generar un nombre válido manteniendo la extensión
    const cleanBaseName = baseName
      .replace('@', '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .replace(/^_+/, '')
      .replace(/_+/g, '_');
    
    const newName = cleanBaseName + ext;
    
    const oldPath = path.join(buildDir, file);
    const newPath = path.join(buildDir, newName);
    
    fs.renameSync(oldPath, newPath);
    console.log(`✅ Renombrado: ${file} → ${newName}`);
  });
  
  console.log('🎉 Funciones renombradas exitosamente');
  
} catch (error) {
  console.error('❌ Error al procesar funciones:', error.message);
  process.exit(1);
}
