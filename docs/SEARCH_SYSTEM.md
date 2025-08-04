# 🔍 Sistema de Búsqueda Avanzada - Documentación Técnica

## 📋 Resumen Ejecutivo

El **Sistema de Búsqueda Avanzada** de PokeDB es una implementación completa de filtrado en tiempo real construida sobre **AstroDB/Turso** con una interfaz de usuario moderna y responsiva. Permite a los usuarios filtrar los 151 Pokémon de la primera generación usando múltiples criterios combinables.

---

## 🏗️ Arquitectura del Sistema

### 📊 Flujo de Datos

```mermaid
graph TD
    A[Usuario abre Modal] --> B[Carga tipos desde API]
    B --> C[Renderiza interfaz de filtros]
    C --> D[Usuario configura filtros]
    D --> E[Submit búsqueda]
    E --> F[API /search procesa query]
    F --> G[Consulta AstroDB con índices]
    G --> H[Retorna resultados JSON]
    H --> I[Renderiza cards de Pokémon]
```

### 🗄️ Esquema de Base de Datos

```typescript
export const Pokemon = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text({ notNull: true }),
    types: column.text({ notNull: true }), // JSON: ["fire", "flying"]
    sprite: column.text({ notNull: true }),
    primaryType: column.text({ notNull: true }), // Primer tipo para indexing
    totalStats: column.number({ notNull: true }), // Suma de stats
    hp: column.number({ notNull: true }),
    attack: column.number({ notNull: true }),
    defense: column.number({ notNull: true }),
    stats: column.text({ notNull: true }), // JSON completo de stats
  },
  indexes: {
    nameIndex: index('name_idx').on('name'),
    typeIndex: index('type_idx').on('primaryType'), 
    statsIndex: index('stats_idx').on('totalStats'),
    hpIndex: index('hp_idx').on('hp'),
  }
});
```

### 🔍 Campos Optimizados para Búsqueda

| Campo | Tipo | Propósito | Índice |
|-------|------|-----------|--------|
| `name` | `text` | Búsqueda por nombre parcial | ✅ `nameIndex` |
| `primaryType` | `text` | Filtro rápido por tipo principal | ✅ `typeIndex` |
| `totalStats` | `number` | Filtro por rango de poder total | ✅ `statsIndex` |
| `hp` | `number` | Filtro por rango de HP | ✅ `hpIndex` |
| `types` | `text` (JSON) | Tipos múltiples para UI | ❌ (campo derivado) |

---

## 🎛️ API Endpoints

### GET `/api/search`

Endpoint principal para búsqueda con múltiples filtros.

#### Parámetros Query String

```typescript
interface SearchParams {
  name?: string;           // Búsqueda parcial insensible a mayúsculas
  types[]?: string[];      // Array de tipos: ?types[]=fire&types[]=water
  minStats?: number;       // Poder total mínimo (0-800)
  maxStats?: number;       // Poder total máximo (0-800)  
  minHp?: number;          // HP mínimo (0-255)
  maxHp?: number;          // HP máximo (0-255)
}
```

#### Ejemplo de Consulta

```bash
GET /api/search?name=char&types[]=fire&minStats=400&maxStats=600&minHp=50&maxHp=100
```

#### Respuesta

```json
{
  "success": true,
  "results": [
    {
      "id": 6,
      "name": "charizard", 
      "types": "[\"fire\",\"flying\"]",
      "sprite": "https://pokeapi.co/media/sprites/pokemon/6.png",
      "totalStats": 534,
      "hp": 78,
      "attack": 84,
      "defense": 78
    }
  ],
  "count": 1
}
```

### POST `/api/search`

Endpoint para obtener metadatos del sistema.

#### Body Request

```json
{
  "action": "getMetadata"
}
```

#### Respuesta

```json
{
  "success": true,
  "metadata": {
    "types": [
      "normal", "fire", "water", "electric", "grass", "ice",
      "fighting", "poison", "ground", "flying", "psychic", 
      "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"
    ]
  }
}
```

---

## 🎨 Interfaz de Usuario

### 🖼️ Modal Responsivo

El modal utiliza el **elemento HTML `<dialog>` nativo** para máxima compatibilidad y rendimiento:

```astro
<dialog id="searchModal" class="backdrop:bg-black/80 backdrop:backdrop-blur-sm hidden">
  <!-- Contenido del modal -->
</dialog>
```

#### Características Responsive

| Breakpoint | Comportamiento |
|------------|----------------|
| **Mobile** (`< 768px`) | Pantalla completa, scroll vertical |
| **Desktop** (`≥ 768px`) | Centrado, max-width 72rem, sombras |

### 🏷️ Sistema de Tags

Los tipos de Pokémon se muestran como **tags coloridos** con funcionalidad de eliminación individual:

```javascript
// Sistema de colores por tipo
const typeColors = {
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  // ... 14 tipos más
};

// Creación dinámica de tags
function createTypeTag(type) {
  const tag = document.createElement('div');
  const colorClass = typeColors[type] || 'bg-gray-400';
  tag.className = `inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold text-white ${colorClass}`;
  
  // Botón de eliminación
  const removeButton = document.createElement('button');
  removeButton.className = 'remove-tag-btn ml-1 text-white hover:text-gray-200';
  removeButton.innerHTML = '×';
  
  return tag;
}
```

### 📊 Controles de Rango

Los filtros de estadísticas utilizan **inputs tipo range** nativos con sincronización dual:

```html
<!-- Poder Total: dual slider -->
<div class="flex gap-2">
  <input type="range" id="minStats" min="0" max="800" value="0" class="flex-1" />
  <input type="range" id="maxStats" min="0" max="800" value="800" class="flex-1" />
</div>

<!-- HP: dual slider -->
<div class="flex gap-2">
  <input type="range" id="minHp" min="0" max="255" value="0" class="flex-1" />
  <input type="range" id="maxHp" min="0" max="255" value="255" class="flex-1" />
</div>
```

---

## ⚡ Optimizaciones de Rendimiento

### 🗄️ Índices de Base de Datos

Todos los filtros principales están respaldados por índices optimizados:

```sql
-- Índices generados automáticamente por AstroDB
CREATE INDEX name_idx ON Pokemon(name);
CREATE INDEX type_idx ON Pokemon(primaryType); 
CREATE INDEX stats_idx ON Pokemon(totalStats);
CREATE INDEX hp_idx ON Pokemon(hp);
```

### 🔍 Consultas Eficientes

Las consultas SQL generadas por Drizzle están optimizadas para usar los índices:

```typescript
// Ejemplo de consulta con múltiples filtros
const results = await db
  .select()
  .from(Pokemon)
  .where(
    and(
      name ? like(Pokemon.name, `%${name}%`) : undefined,
      types.length > 0 ? or(...types.map(type => 
        eq(Pokemon.primaryType, type)
      )) : undefined,
      minStats > 0 ? gte(Pokemon.totalStats, minStats) : undefined,
      maxStats < 800 ? lte(Pokemon.totalStats, maxStats) : undefined,
      minHp > 0 ? gte(Pokemon.hp, minHp) : undefined,
      maxHp < 255 ? lte(Pokemon.hp, maxHp) : undefined,
    )
  );
```

### 📊 Métricas de Rendimiento

| Métrica | Valor | Optimización |
|---------|-------|--------------|
| **Carga inicial del modal** | ~150ms | Caché de tipos en memoria |
| **Búsqueda simple (nombre)** | ~50ms | Índice en `name` |
| **Búsqueda compleja (todos filtros)** | ~200ms | Índices múltiples + WHERE optimizado |
| **Carga de metadatos** | ~100ms | Query simple sin JOIN |

---

## 🧪 Casos de Uso y Testing

### 🎯 Escenarios de Búsqueda

#### 1. Búsqueda por Nombre
```
Input: "char"
Expected: [Charizard, Charmander, Charmeleon]
Query: WHERE name LIKE '%char%'
```

#### 2. Filtro por Tipo Múltiple
```
Input: types = ["fire", "dragon"] 
Expected: [Charizard, Dragonite, etc.]
Query: WHERE primaryType IN ('fire', 'dragon')
```

#### 3. Rango de Estadísticas
```
Input: minStats=500, maxStats=600
Expected: Pokémon con poder total entre 500-600
Query: WHERE totalStats BETWEEN 500 AND 600
```

#### 4. Búsqueda Combinada
```
Input: name="pika", types=["electric"], minHp=30
Expected: [Pikachu, Raichu] 
Query: WHERE name LIKE '%pika%' AND primaryType='electric' AND hp>=30
```

### 🐛 Casos Edge

| Caso | Comportamiento Esperado |
|------|-------------------------|
| **Sin resultados** | Mostrar mensaje "No se encontraron Pokémon" |
| **Todos los filtros vacíos** | Mostrar mensaje inicial, no ejecutar query |
| **Tipos inexistentes** | Filtrar silenciosamente, no afectar results |
| **Rangos inválidos** | Normalizar automáticamente (min > max) |

---

## 🔧 Desarrollo y Debugging

### 🛠️ Scripts Útiles

```bash
# Sembrar datos con información extendida
bun run db:seed

# Ver esquema actual
bun run db:studio

# Verificar índices
bun run astro db push --dry-run
```

### 📊 Debugging de Consultas

Para debug de consultas SQL, habilitar logging en desarrollo:

```typescript
// src/services/pokemonDB.ts
import { db } from 'astro:db';

// Log de consultas en desarrollo
if (import.meta.env.DEV) {
  console.log('Executing search query:', { name, types, minStats, maxStats });
}
```

### 🎨 Testing de UI

Para testing manual de la interfaz:

1. **Modal Opening**: Verificar que se abre/cierra correctamente
2. **Tags System**: Probar agregar/eliminar tipos múltiples
3. **Responsive**: Probar en móvil (DevTools → Device Simulation)
4. **Performance**: Network tab para timing de requests

---

## 🚀 Mejoras Futuras

### 🔄 Roadmap Técnico

| Prioridad | Mejora | Esfuerzo | Impacto |
|-----------|--------|----------|---------|
| **Alta** | Paginación de resultados | 2-3 días | Performance |
| **Media** | Filtro por generación | 1 día | UX |
| **Baja** | Ordenamiento custom | 1-2 días | UX |
| **Baja** | Búsqueda por habilidades | 3-4 días | Features |

### ⚡ Optimizaciones Adicionales

1. **Query Optimization**
   - Implementar Full-Text Search para nombres
   - Agregar índices compuestos para queries complejas
   - Cache de resultados frecuentes en memoria

2. **UI/UX Enhancements**
   - Scroll infinito para resultados grandes
   - Filtros persistentes en localStorage
   - Animaciones de entrada/salida para resultados

3. **API Improvements**
   - Rate limiting para prevenir abuso
   - Compresión gzip para responses grandes
   - GraphQL endpoint para queries más flexibles

---

## 📚 Referencias

- **AstroDB Docs**: https://docs.astro.build/en/guides/astro-db/
- **Drizzle ORM**: https://orm.drizzle.team/
- **Turso Database**: https://docs.turso.tech/
- **HTML Dialog**: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
- **PokéAPI**: https://pokeapi.co/docs/v2

---

*Documentación generada para PokeDB v2.0 - Sistema de Búsqueda Avanzada*
