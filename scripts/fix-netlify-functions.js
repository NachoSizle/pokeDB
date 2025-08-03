#!/usr/bin/env node

/**
 * 🔧 Script para renombrar funciones de Netlify con caracteres especiales
 * Este script resuelve el problema de nombres de función que contienen '@' u otros caracteres especiales
 * También actualiza las referencias internas en los archivos
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
    file.includes('@') || (file.includes('-') && file.startsWith('_'))
  );
  
  if (problematicFiles.length === 0) {
    console.log('✅ No se encontraron archivos con nombres problemáticos');
    process.exit(0);
  }
  
  // Mapa de nombres antiguos a nuevos
  const renameMap = new Map();
  
  // Primero, generar el mapa de renombrado
  problematicFiles.forEach(file => {
    const ext = path.extname(file);
    const baseName = path.basename(file, ext);
    
    const cleanBaseName = baseName
      .replace('@', '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .replace(/^_+/, '')
      .replace(/_+/g, '_');
    
    const newName = cleanBaseName + ext;
    renameMap.set(file, newName);
  });
  
  // Actualizar referencias en entry.mjs antes de renombrar
  const entryPath = path.join(buildDir, 'entry.mjs');
  if (fs.existsSync(entryPath)) {
    let entryContent = fs.readFileSync(entryPath, 'utf8');
    let contentChanged = false;
    
    for (const [oldName, newName] of renameMap) {
      if (entryContent.includes(oldName)) {
        entryContent = entryContent.replaceAll(`./${oldName}`, `./${newName}`);
        entryContent = entryContent.replaceAll(`'${oldName}'`, `'${newName}'`);
        entryContent = entryContent.replaceAll(`"${oldName}"`, `"${newName}"`);
        contentChanged = true;
        console.log(`🔄 Actualizada referencia en entry.mjs: ${oldName} → ${newName}`);
      }
    }
    
    if (contentChanged) {
      fs.writeFileSync(entryPath, entryContent);
      console.log('✅ Referencias actualizadas en entry.mjs');
    }
  }
  
  // Ahora renombrar los archivos
  for (const [oldName, newName] of renameMap) {
    const oldPath = path.join(buildDir, oldName);
    const newPath = path.join(buildDir, newName);
    
    fs.renameSync(oldPath, newPath);
    console.log(`✅ Renombrado: ${oldName} → ${newName}`);
  }
  
  console.log('🎉 Funciones renombradas exitosamente');
  
} catch (error) {
  console.error('❌ Error al procesar funciones:', error.message);
  process.exit(1);
}
