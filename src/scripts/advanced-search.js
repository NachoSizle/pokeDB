// 🔍 advanced-search.js - Funcionalidad del modal de búsqueda avanzada
// Separado para mejorar mantenibilidad y reutilización

// 🎛️ Variables globales
let selectedTypes = [];
let availableTypes = [];
let lastFocusedElement = null;

// 💾 Cache de elementos DOM para mejor rendimiento
let domCache = {};

// 🎨 Gradientes de tipos para las tarjetas
const typeGradients = {
	normal: { gradient: 'from-gray-400 to-gray-600' },
	fire: { gradient: 'from-red-500 to-orange-600' },
	water: { gradient: 'from-blue-500 to-cyan-600' },
	electric: { gradient: 'from-yellow-400 to-yellow-600' },
	grass: { gradient: 'from-green-500 to-emerald-600' },
	ice: { gradient: 'from-cyan-300 to-blue-400' },
	fighting: { gradient: 'from-orange-700 to-red-700' },
	poison: { gradient: 'from-purple-600 to-violet-700' },
	ground: { gradient: 'from-yellow-600 to-orange-700' },
	flying: { gradient: 'from-indigo-400 to-blue-500' },
	psychic: { gradient: 'from-pink-500 to-purple-600' },
	bug: { gradient: 'from-lime-500 to-green-600' },
	rock: { gradient: 'from-yellow-800 to-orange-800' },
	ghost: { gradient: 'from-indigo-800 to-purple-900' },
	dragon: { gradient: 'from-indigo-600 to-purple-700' },
	dark: { gradient: 'from-gray-800 to-gray-900' },
	steel: { gradient: 'from-gray-500 to-slate-600' },
	fairy: { gradient: 'from-pink-300 to-purple-400' },
};

// 🎨 Función para obtener colores y gradientes de tipos
function getTypeColors(type) {
	const typeGradients = {
		normal: { gradient: 'from-gray-400 to-gray-600' },
		fire: { gradient: 'from-red-500 to-orange-600' },
		water: { gradient: 'from-blue-500 to-blue-700' },
		electric: { gradient: 'from-yellow-400 to-yellow-600' },
		grass: { gradient: 'from-green-500 to-green-700' },
		ice: { gradient: 'from-cyan-300 to-cyan-500' },
		fighting: { gradient: 'from-orange-700 to-red-800' },
		poison: { gradient: 'from-purple-600 to-purple-800' },
		ground: { gradient: 'from-yellow-600 to-yellow-800' },
		flying: { gradient: 'from-indigo-400 to-indigo-600' },
		psychic: { gradient: 'from-pink-500 to-pink-700' },
		bug: { gradient: 'from-lime-500 to-green-600' },
		rock: { gradient: 'from-yellow-800 to-amber-900' },
		ghost: { gradient: 'from-indigo-800 to-purple-900' },
		dragon: { gradient: 'from-indigo-600 to-purple-700' },
		dark: { gradient: 'from-gray-800 to-gray-900' },
		steel: { gradient: 'from-gray-500 to-gray-700' },
		fairy: { gradient: 'from-pink-300 to-pink-500' },
	};
	
	return typeGradients[type] || { gradient: 'from-gray-400 to-gray-600' };
}

// 🎨 Función para obtener color de badge de tipo
function getTypeBadgeColor(type) {
	const typeColorMap = {
		normal: 'bg-gray-500',
		fire: 'bg-red-500',
		water: 'bg-blue-500',
		electric: 'bg-yellow-500',
		grass: 'bg-green-500',
		ice: 'bg-cyan-400',
		fighting: 'bg-orange-600',
		poison: 'bg-purple-600',
		ground: 'bg-yellow-700',
		flying: 'bg-indigo-500',
		psychic: 'bg-pink-500',
		bug: 'bg-lime-500',
		rock: 'bg-yellow-800',
		ghost: 'bg-indigo-700',
		dragon: 'bg-indigo-600',
		dark: 'bg-gray-700',
		steel: 'bg-gray-600',
		fairy: 'bg-pink-400',
	};
	return typeColorMap[type] || 'bg-gray-500';
}

// 🎯 Inicialización del módulo de búsqueda avanzada
export function initAdvancedSearch() {
	// 🎛️ Inicializar cache de elementos DOM
	initDOMCache();
	
	// 🔗 Configurar event listeners
	setupEventListeners();
	
	// 🎯 Inicialización inicial
	updateStatsDisplay();
	updateHpDisplay();
}

// 💾 Inicializar cache de elementos DOM
function initDOMCache() {
	const elementIds = [
		'openSearchModal', 'closeSearchModal', 'searchModal', 'searchName',
		'typesContainer', 'typesDropdown', 'selectedTypeTags', 'typesPlaceholder',
		'typesListContainer', 'minStats', 'maxStats', 'minHp', 'maxHp',
		'statsRangeDisplay', 'hpRangeDisplay', 'performSearch', 'clearFilters',
		'searchButtonText', 'loadingIndicator', 'resultsCount', 'noResults', 'resultsGrid'
	];
	
	elementIds.forEach(id => {
		domCache[id] = document.getElementById(id);
	});
}

// 🎯 Helper para obtener elemento del cache con validación
function getElement(id) {
	if (!domCache[id]) {
		domCache[id] = document.getElementById(id);
	}
	return domCache[id];
}

// 🔗 Configurar todos los event listeners
function setupEventListeners() {
	const {
		openSearchModal: openButton,
		closeSearchModal: closeButton,
		searchModal: modal,
		searchName: searchNameInput,
		typesContainer,
		typesDropdown,
		minStats: minStatsRange,
		maxStats: maxStatsRange,
		minHp: minHpRange,
		maxHp: maxHpRange,
		performSearch: performSearchButton,
		clearFilters: clearFiltersButton
	} = domCache;

	// 🎮 Modal controls
	if (openButton) openButton.addEventListener('click', openModal);
	if (closeButton) closeButton.addEventListener('click', closeModal);
	
	if (modal) {
		modal.addEventListener('click', handleModalBackdropClick);
		modal.addEventListener('keydown', handleModalKeydown);
	}

	// 🎨 Dropdown de tipos
	if (typesContainer) {
		typesContainer.addEventListener('click', handleTypesContainerClick);
		typesContainer.addEventListener('keydown', handleTypesContainerKeydown);
	}
	
	// 📱 Cerrar dropdown al hacer click fuera
	document.addEventListener('click', handleDocumentClick);

	// 🎛️ Range inputs listeners
	if (minStatsRange) minStatsRange.addEventListener('input', updateStatsDisplay);
	if (maxStatsRange) maxStatsRange.addEventListener('input', updateStatsDisplay);
	if (minHpRange) minHpRange.addEventListener('input', updateHpDisplay);
	if (maxHpRange) maxHpRange.addEventListener('input', updateHpDisplay);

	// 🎮 Action buttons
	if (performSearchButton) performSearchButton.addEventListener('click', performSearch);
	if (clearFiltersButton) clearFiltersButton.addEventListener('click', clearFilters);

	// ⌨️ Enter key para búsqueda
	if (searchNameInput) searchNameInput.addEventListener('keypress', handleSearchInputKeypress);
}

// 🎮 Event handlers separados para mejor organización
function handleModalBackdropClick(e) {
	if (e.target === getElement('searchModal')) closeModal();
}

function handleModalKeydown(e) {
	if (e.key === 'Escape') {
		closeModal();
	}
	
	// Mantener el foco dentro del modal
	if (e.key === 'Tab') {
		trapFocus(e);
	}
}

function handleTypesContainerClick(event) {
	// Verificar si el click fue en un botón de eliminar tag (×)
	if (event.target.closest('.remove-tag-btn')) {
		return; // No abrir dropdown si se clickeó en un botón de eliminar
	}
	toggleTypesDropdown();
}

function handleTypesContainerKeydown(e) {
	if (e.key === 'Enter' || e.key === ' ') {
		e.preventDefault();
		toggleTypesDropdown();
	}
}

function handleDocumentClick(e) {
	const typesDropdown = getElement('typesDropdown');
	const typesContainer = getElement('typesContainer');
	
	if (typesDropdown && !typesDropdown.contains(e.target) && !typesContainer?.contains(e.target)) {
		typesDropdown.classList.add('hidden');
	}
}

function handleSearchInputKeypress(e) {
	if (e.key === 'Enter') performSearch();
}

// 🔓 Abrir modal
async function openModal() {
	const modal = getElement('searchModal');
	const searchNameInput = getElement('searchName');
	
	if (!modal) {
		console.error('Modal de búsqueda no encontrado');
		return;
	}

	try {
		// 🔒 Guardar el elemento que tenía el foco antes de abrir el modal
		lastFocusedElement = document.activeElement;
		
		modal.classList.remove('hidden');
		if (modal.showModal) {
			modal.showModal();
		}
		
		// 🎯 Actualizar atributos ARIA
		modal.setAttribute('aria-hidden', 'false');
		
		// ✅ Manejar accesibilidad del resto de la página
		handlePageAccessibility(true);
		
		await loadAvailableTypes();
		updateStatsDisplay();
		updateHpDisplay();
		
		// 🎯 Enfocar el primer elemento interactivo
		if (searchNameInput) {
			searchNameInput.focus();
		}
	} catch (error) {
		console.error('Error al abrir modal:', error);
	}
}

// 🔒 Cerrar modal
function closeModal() {
	const modal = getElement('searchModal');
	
	if (!modal) return;

	try {
		if (modal.close) {
			modal.close();
		}
		modal.classList.add('hidden');
		
		// 🔒 Restaurar atributos ARIA
		modal.setAttribute('aria-hidden', 'true');
		
		// ✅ Restaurar accesibilidad de la página
		handlePageAccessibility(false);
		
		// 🎯 Restaurar el foco al elemento que abrió el modal
		if (lastFocusedElement) {
			lastFocusedElement.focus();
		}
	} catch (error) {
		console.error('Error al cerrar modal:', error);
	}
}

// ✅ Helper para manejar accesibilidad de la página
function handlePageAccessibility(isModalOpen) {
	const elements = [
		document.querySelector('header[role="banner"]'),
		document.querySelector('footer[role="contentinfo"]'),
		...document.querySelectorAll('main > section')
	].filter(Boolean);

	elements.forEach(element => {
		if (isModalOpen) {
			element.setAttribute('aria-hidden', 'true');
		} else {
			element.removeAttribute('aria-hidden');
		}
	});
}

// 🔒 Función para mantener el foco dentro del modal
function trapFocus(e) {
	const modal = document.getElementById('searchModal');
	const focusableElements = modal.querySelectorAll(
		'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
	);
	const firstFocusable = focusableElements[0];
	const lastFocusable = focusableElements[focusableElements.length - 1];

	if (e.shiftKey) {
		if (document.activeElement === firstFocusable) {
			lastFocusable.focus();
			e.preventDefault();
		}
	} else {
		if (document.activeElement === lastFocusable) {
			firstFocusable.focus();
			e.preventDefault();
		}
	}
}

// 🎨 Cargar tipos disponibles desde la API
async function loadAvailableTypes() {
	const typesListContainer = document.getElementById('typesListContainer');
	
	try {
		const response = await fetch('/api/search', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ action: 'getMetadata' })
		});
		
		// Verificar si la respuesta es válida
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}
		
		const data = await response.json();
		
		console.log('Respuesta de metadatos:', data); // Debug
		
		if (data.success && data.metadata && data.metadata.types && typesListContainer) {
			availableTypes = data.metadata.types;
			renderAvailableTypes();
			console.log('Tipos cargados desde API:', data.metadata.types); // Debug
		} else {
			console.warn('No se encontraron tipos en la respuesta:', data);
			useStaticTypes();
		}
	} catch (error) {
		console.error('Error cargando tipos desde API:', error);
		console.log('🔄 Usando tipos estáticos como fallback...');
		useStaticTypes();
	}
}

// 🎯 Fallback: usar tipos estáticos cuando la API falla
function useStaticTypes() {
	// Tipos comunes de Pokémon de la primera generación
	availableTypes = [
		'normal', 'fire', 'water', 'electric', 'grass', 'ice',
		'fighting', 'poison', 'ground', 'flying', 'psychic',
		'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
	];
	renderAvailableTypes();
	console.log('✅ Tipos estáticos cargados:', availableTypes);
}

// 🎨 Renderizar lista de tipos disponibles
function renderAvailableTypes() {
	const typesListContainer = document.getElementById('typesListContainer');
	if (!typesListContainer) return;
	
	typesListContainer.innerHTML = '';
	const unselectedTypes = availableTypes.filter(type => !selectedTypes.includes(type));
	
	unselectedTypes.forEach(function(type) {
		const typeOption = createTypeOption(type);
		typesListContainer.appendChild(typeOption);
	});
	
	// Mostrar mensaje si no hay tipos disponibles
	if (unselectedTypes.length === 0) {
		const emptyMessage = document.createElement('div');
		emptyMessage.className = 'text-center text-gray-500 dark:text-white py-2 text-sm';
		emptyMessage.textContent = 'Todos los tipos seleccionados';
		typesListContainer.appendChild(emptyMessage);
	}
}

// 🎨 Crear opción de tipo para el dropdown
function createTypeOption(type) {
	const container = document.createElement('div');
	container.className = 'flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500';
	container.setAttribute('role', 'option');
	container.setAttribute('tabindex', '0');
	container.setAttribute('aria-label', 'Seleccionar tipo ' + type);
	
	container.addEventListener('click', function() { selectType(type); });
	container.addEventListener('keydown', function(e) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			selectType(type);
		}
	});
	
	// 🎨 Badge de color para el tipo
	const colorClass = getTypeBadgeColor(type);
	const badge = document.createElement('span');
	badge.className = 'w-4 h-4 rounded-full ' + colorClass;
	badge.setAttribute('aria-hidden', 'true');
	
	const label = document.createElement('span');
	label.textContent = type.charAt(0).toUpperCase() + type.slice(1);
	label.className = 'text-sm capitalize flex-1';
	
	container.appendChild(badge);
	container.appendChild(label);
	
	return container;
}

// � Seleccionar un tipo
function selectType(type) {
	const typesDropdown = document.getElementById('typesDropdown');
	
	if (!selectedTypes.includes(type)) {
		selectedTypes.push(type);
		renderSelectedTags();
		renderAvailableTypes();
	}
	// Cerrar dropdown después de seleccionar
	if (typesDropdown) {
		typesDropdown.classList.add('hidden');
	}
}

// 🏷️ Renderizar tags de tipos seleccionados
function renderSelectedTags() {
	const selectedTypeTags = document.getElementById('selectedTypeTags');
	const typesPlaceholder = document.getElementById('typesPlaceholder');
	
	if (!selectedTypeTags || !typesPlaceholder) return;
	
	selectedTypeTags.innerHTML = '';
	selectedTypes.forEach(function(type) {
		const tag = createTypeTag(type);
		selectedTypeTags.appendChild(tag);
	});
	
	// Mostrar/ocultar placeholder según si hay tipos seleccionados
	if (selectedTypes.length === 0) {
		typesPlaceholder.style.display = 'block';
	} else {
		typesPlaceholder.style.display = 'none';
	}
}

// 🎨 Crear tag de tipo seleccionado
function createTypeTag(type) {
	const tag = document.createElement('div');
	const colorClass = getTypeBadgeColor(type);
	tag.className = 'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold text-white ' + colorClass;
	tag.setAttribute('aria-label', 'Tipo ' + type + ' seleccionado');
	
	const typeText = document.createElement('span');
	typeText.textContent = type.charAt(0).toUpperCase() + type.slice(1);
	typeText.className = 'capitalize';
	
	const removeButton = document.createElement('button');
	removeButton.type = 'button';
	removeButton.className = 'remove-tag-btn ml-1 text-white hover:text-gray-200 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white';
	removeButton.innerHTML = '×';
	removeButton.setAttribute('aria-label', 'Eliminar filtro de tipo ' + type);
	removeButton.addEventListener('click', function() { removeType(type); });
	
	tag.appendChild(typeText);
	tag.appendChild(removeButton);
	
	return tag;
}

// 🗑️ Remover un tipo seleccionado
function removeType(type) {
	selectedTypes = selectedTypes.filter(t => t !== type);
	renderSelectedTags();
	renderAvailableTypes();
}

// 🔽 Alternar dropdown de tipos
function toggleTypesDropdown() {
	const typesDropdown = document.getElementById('typesDropdown');
	const typesContainer = document.getElementById('typesContainer');
	
	if (typesDropdown) {
		const isHidden = typesDropdown.classList.contains('hidden');
		typesDropdown.classList.toggle('hidden');
		
		// 🎯 Actualizar aria-expanded
		if (typesContainer) {
			typesContainer.setAttribute('aria-expanded', !isHidden ? 'true' : 'false');
		}
		
		if (!typesDropdown.classList.contains('hidden')) {
			renderAvailableTypes(); // Actualizar lista al abrir
		}
	}
}

// 📊 Actualizar displays de rangos
function updateStatsDisplay() {
	const minStatsRange = document.getElementById('minStats');
	const maxStatsRange = document.getElementById('maxStats');
	const statsRangeDisplay = document.getElementById('statsRangeDisplay');
	
	const min = minStatsRange ? minStatsRange.value : '0';
	const max = maxStatsRange ? maxStatsRange.value : '800';
	if (statsRangeDisplay) {
		statsRangeDisplay.textContent = min + ' - ' + max;
	}
}

function updateHpDisplay() {
	const minHpRange = document.getElementById('minHp');
	const maxHpRange = document.getElementById('maxHp');
	const hpRangeDisplay = document.getElementById('hpRangeDisplay');
	
	const min = minHpRange ? minHpRange.value : '0';
	const max = maxHpRange ? maxHpRange.value : '255';
	if (hpRangeDisplay) {
		hpRangeDisplay.textContent = min + ' - ' + max;
	}
}

// 🔍 Realizar búsqueda con manejo optimizado
async function performSearch() {
	setLoading(true);
	
	try {
		// 🧹 Limpiar resultados anteriores
		const noResults = getElement('noResults');
		if (noResults) noResults.classList.add('hidden');

		// 📊 Recopilar parámetros de búsqueda de forma optimizada
		const params = collectSearchParams();

		// 📡 Realizar petición
		const response = await fetch(`/api/search?${params.toString()}`);
		
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}
		
		const data = await response.json();
		
		if (data.success) {
			displayResults(data.results);
		} else {
			console.error('Error en búsqueda:', data.error);
			displayResults([]);
			showSearchError('La búsqueda no está disponible temporalmente. API responde con error.');
		}
	} catch (error) {
		console.error('Error realizando búsqueda:', error);
		displayResults([]);
		showSearchError('La búsqueda avanzada no está disponible temporalmente. Esto puede deberse a problemas temporales del servidor.');
	} finally {
		setLoading(false);
	}
}

// 📊 Recopilar parámetros de búsqueda de forma optimizada
function collectSearchParams() {
	const params = new URLSearchParams();
	
	// 📝 Parámetro de nombre
	const searchName = getElement('searchName')?.value?.trim();
	if (searchName) params.append('name', searchName);
	
	// 🎨 Tipos múltiples
	selectedTypes.forEach(type => params.append('types[]', type));
	
	// 📊 Rangos numéricos con valores por defecto
	const ranges = [
		{ id: 'minStats', paramName: 'minStats', defaultValue: 0 },
		{ id: 'maxStats', paramName: 'maxStats', defaultValue: 800 },
		{ id: 'minHp', paramName: 'minHp', defaultValue: 0 },
		{ id: 'maxHp', paramName: 'maxHp', defaultValue: 255 }
	];
	
	ranges.forEach(({ id, paramName, defaultValue }) => {
		const element = getElement(id);
		if (element) {
			const value = parseInt(element.value) || defaultValue;
			if (value !== defaultValue) {
				params.append(paramName, value.toString());
			}
		}
	});

	return params;
}

// 🚨 Mostrar mensaje de error de búsqueda
function showSearchError(message) {
	const noResults = getElement('noResults');
	
	if (noResults) {
		noResults.classList.remove('hidden');
		const errorDiv = noResults.querySelector('h4');
		const errorDesc = noResults.querySelector('p');
		if (errorDiv) errorDiv.textContent = 'Búsqueda no disponible';
		if (errorDesc) errorDesc.textContent = message;
	}
}

// ✨ Crear tarjeta de Pokémon con template literals optimizado
function createPokemonCard(pokemon) {
	try {
		// 🔢 Formatear número de Pokédex
		const paddedNumber = pokemon.id.toString().padStart(3, '0');
		
		// 🎨 Validar y normalizar tipos - Mejorado para manejar strings JSON
		let pokemonTypes = [];
		
		// Caso 1: Si types es un array
		if (Array.isArray(pokemon.types)) {
			pokemonTypes = pokemon.types;
		} 
		// Caso 2: Si types es un string que podría ser JSON
		else if (typeof pokemon.types === 'string') {
			// Primero intentar parsear como JSON
			try {
				const parsedTypes = JSON.parse(pokemon.types);
				if (Array.isArray(parsedTypes)) {
					pokemonTypes = parsedTypes;
				} else {
					// Si no es array después del parse, tratarlo como tipo individual
					pokemonTypes = [pokemon.types];
				}
			} catch {
				// Si falla el parse, tratarlo como tipo individual
				pokemonTypes = [pokemon.types];
			}
		} 
		// Caso 3: Fallback al campo 'type'
		else if (pokemon.type) {
			pokemonTypes = Array.isArray(pokemon.type) ? pokemon.type : [pokemon.type];
		} 
		// Caso 4: Tipo por defecto
		else {
			pokemonTypes = ['normal'];
		}
		
		// Limpiar y validar cada tipo
		pokemonTypes = pokemonTypes
			.map(type => {
				if (typeof type === 'string') {
					return type.trim().toLowerCase();
				}
				return String(type).trim().toLowerCase();
			})
			.filter(type => type && type !== 'undefined' && type !== 'null');
		
		// Asegurar que tengamos al menos un tipo válido
		if (pokemonTypes.length === 0) {
			pokemonTypes = ['normal'];
		}
		
		// 🎨 Obtener colores del tipo principal
		const primaryType = pokemonTypes[0] || 'normal';
		const typeColors = getTypeColors(primaryType);
		
		// 🏷️ Crear badges de tipos como en la imagen - CORREGIDO
		const typesBadges = pokemonTypes
			.map(type => {
				const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
				const badgeColor = getTypeBadgeColor(type);
				
				return `<span class="inline-block ${badgeColor} text-white text-sm px-4 py-2 rounded-full font-semibold">
					${capitalizedType}
				</span>`;
			}).join('');
		
		// �️ Procesar imagen del Pokémon
		let pokemonImage = pokemon.image || pokemon.sprite || pokemon.img || '';
		if (!pokemonImage && pokemon.id) {
			// Fallback a imagen de PokeAPI oficial
			pokemonImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
		}
		
		// 📊 Procesar estadísticas con formato específico como en la imagen
		let statsDisplay = '';
		let totalPower = 0;
		
		if (pokemon.stats) {
			if (typeof pokemon.stats === 'string') {
				// Si es un string JSON, intentar parsearlo
				try {
					const parsedStats = JSON.parse(pokemon.stats);
					if (typeof parsedStats === 'object') {
						pokemon.stats = parsedStats;
					}
				} catch {
					// Si no se puede parsear, usar como está
				}
			}
			
			if (typeof pokemon.stats === 'object' && !Array.isArray(pokemon.stats)) {
				// Extraer estadísticas principales con emojis
				const hp = pokemon.stats.hp || pokemon.stats.HP || 0;
				const attack = pokemon.stats.attack || pokemon.stats.ATK || pokemon.stats['special-attack'] || 0;
				const defense = pokemon.stats.defense || pokemon.stats.DEF || pokemon.stats['special-defense'] || 0;
				const spAttack = pokemon.stats['special-attack'] || pokemon.stats['sp-attack'] || pokemon.stats.spAttack || 0;
				const spDefense = pokemon.stats['special-defense'] || pokemon.stats['sp-defense'] || pokemon.stats.spDefense || 0;
				const speed = pokemon.stats.speed || pokemon.stats.SPD || 0;
				
				// Calcular poder total
				totalPower = Object.values(pokemon.stats)
					.filter(val => typeof val === 'number' || !isNaN(Number(val)))
					.reduce((sum, val) => sum + Number(val), 0);
				
				// Formatear estadísticas en grid 3x2
				const statsArray = [];
				if (hp) statsArray.push(`<div class="text-center"><span class="block text-xs text-gray-300">❤️ HP</span><span class="font-bold">${hp}</span></div>`);
				if (attack) statsArray.push(`<div class="text-center"><span class="block text-xs text-gray-300">⚔️ ATK</span><span class="font-bold">${attack}</span></div>`);
				if (defense) statsArray.push(`<div class="text-center"><span class="block text-xs text-gray-300">🛡️ DEF</span><span class="font-bold">${defense}</span></div>`);
				if (spAttack) statsArray.push(`<div class="text-center"><span class="block text-xs text-gray-300">✨ SP.ATK</span><span class="font-bold">${spAttack}</span></div>`);
				if (spDefense) statsArray.push(`<div class="text-center"><span class="block text-xs text-gray-300">� SP.DEF</span><span class="font-bold">${spDefense}</span></div>`);
				if (speed) statsArray.push(`<div class="text-center"><span class="block text-xs text-gray-300">💨 VEL</span><span class="font-bold">${speed}</span></div>`);
				
				if (statsArray.length > 0) {
					statsDisplay = `<div class="grid grid-cols-3 gap-2 text-white text-sm">${statsArray.join('')}</div>`;
				}
			}
		}
		
		// Si no hay estadísticas específicas, usar mensaje por defecto
		if (!statsDisplay) {
			statsDisplay = 'Sin estadísticas disponibles';
		}
		
		// Debug para entender la estructura - MEJORADO
		console.log('🐛 Debug Pokémon completo:', {
			name: pokemon.name,
			id: pokemon.id,
			originalTypes: pokemon.types,
			typeOfTypes: typeof pokemon.types,
			processedTypes: pokemonTypes,
			originalStats: pokemon.stats,
			statsDisplay,
			totalPower,
			image: pokemonImage
		});
		
		// 🎴 Template que coincide exactamente con la imagen adjunta
		return `
			<article class="relative bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl 
							transform hover:scale-105 transition-all duration-300 
							overflow-hidden group p-6"
					 data-pokemon-id="${pokemon.id}"
					 tabindex="0"
					 role="button"
					 aria-label="Ver detalles de ${pokemon.name}">
				
				<!-- 🖼️ Imagen del Pokémon centrada -->
				<div class="text-center mb-4">
					${pokemonImage ? 
						`<img src="${pokemonImage}" 
							 alt="${pokemon.name}"
							 class="w-32 h-32 mx-auto object-contain drop-shadow-lg 
									group-hover:scale-110 transition-transform duration-300"
							 loading="lazy"
							 decoding="async"
							 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
						 <div class="w-32 h-32 mx-auto bg-gray-600 rounded-lg flex items-center justify-center text-gray-400 text-sm font-medium" style="display:none;">
							Sin imagen
						 </div>` :
						`<div class="w-32 h-32 mx-auto bg-gray-600 rounded-lg flex items-center justify-center text-gray-400 text-sm font-medium">
							Sin imagen
						 </div>`
					}
				</div>
				
				<!-- 🔢 Número de Pokédex -->
				<div class="text-center text-gray-400 text-sm font-medium mb-2">
					#${paddedNumber}
				</div>
				
				<!-- 📝 Nombre del Pokémon -->
				<h3 class="text-2xl font-bold text-white text-center capitalize mb-4">
					${pokemon.name}
				</h3>
				
				<!-- 🏷️ Tipos como badges horizontales -->
				<div class="flex justify-center gap-2 mb-4">
					${typesBadges}
				</div>
				
				<!-- � Poder Total -->
				${totalPower > 0 ? `
					<div class="text-center mb-4">
						<span class="text-yellow-400 font-bold text-lg">
							💪 Poder Total: ${totalPower}
						</span>
					</div>
				` : ''}
				
				<!-- 📊 Estadísticas en grid 3x2 -->
				<div class="text-center text-white mb-6">
					${statsDisplay}
				</div>
				
				<!-- 🎯 Botón "Ver detalles" -->
				<div class="text-center">
					<button class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 w-full">
						Ver detalles
					</button>
				</div>
			</article>
		`;
	} catch (error) {
		console.error('Error al crear tarjeta de Pokémon:', error);
		console.error('Datos del Pokémon:', pokemon); // Debug adicional
		return `
			<article class="bg-red-100 border border-red-300 rounded-lg p-4">
				<p class="text-red-700">Error al cargar Pokémon ${pokemon?.name || 'desconocido'}</p>
			</article>
		`;
	}
}

// 🧹 Limpiar filtros con DOM caching
function clearFilters() {
	// 🎯 Elementos de entrada
	const inputElements = [
		{ id: 'searchName', defaultValue: '' },
		{ id: 'minStats', defaultValue: '0' },
		{ id: 'maxStats', defaultValue: '800' },
		{ id: 'minHp', defaultValue: '0' },
		{ id: 'maxHp', defaultValue: '255' }
	];

	// 🧹 Limpiar inputs
	inputElements.forEach(({ id, defaultValue }) => {
		const element = getElement(id);
		if (element) element.value = defaultValue;
	});
	
	// 🎨 Limpiar tipos seleccionados
	selectedTypes = [];
	renderSelectedTags();
	renderAvailableTypes();
	
	// 📊 Actualizar displays
	updateStatsDisplay();
	updateHpDisplay();
	displayResults([]);
}

// ⏳ Estado de carga optimizado
function setLoading(loading) {
	const loadingElements = [
		{ id: 'loadingIndicator', showClass: 'flex', hideClass: 'hidden' },
		{ id: 'searchButtonText', textContent: loading ? 'Buscando...' : 'Buscar Pokémon' },
		{ id: 'performSearch', disabled: loading }
	];

	loadingElements.forEach(({ id, showClass, hideClass, textContent, disabled }) => {
		const element = getElement(id);
		if (!element) return;

		// 🎭 Manejar clases de visibilidad
		if (showClass && hideClass) {
			if (loading) {
				element.classList.remove(hideClass);
				element.classList.add(showClass);
			} else {
				element.classList.add(hideClass);
				element.classList.remove(showClass);
			}
		}

		// 📝 Manejar texto
		if (textContent !== undefined) {
			element.textContent = textContent;
		}

		// 🔒 Manejar estado deshabilitado
		if (disabled !== undefined) {
			element.disabled = disabled;
		}
	});
}

// 🎨 Mostrar resultados optimizado
function displayResults(results) {
	const resultsCount = getElement('resultsCount');
	const noResults = getElement('noResults');
	const resultsGrid = getElement('resultsGrid');
	
	// 📊 Actualizar contador
	if (resultsCount) resultsCount.textContent = results.length;
	
	if (results.length === 0) {
		// 🚫 Sin resultados
		if (noResults) noResults.classList.remove('hidden');
		if (resultsGrid) resultsGrid.innerHTML = '';
	} else {
		// ✅ Mostrar resultados
		if (noResults) noResults.classList.add('hidden');
		if (resultsGrid) {
			// 🎴 Generar tarjetas de forma eficiente
			const cardsHTML = results
				.map(pokemon => createPokemonCard(pokemon))
				.join('');
			
			resultsGrid.innerHTML = cardsHTML;
			
			// 🎯 Agregar event listeners a las nuevas tarjetas
			addCardEventListeners(resultsGrid);
		}
	}
}

// 🎯 Agregar listeners a las tarjetas optimizado
function addCardEventListeners(container) {
	const cards = container.querySelectorAll('[data-pokemon-id]');
	
	cards.forEach(card => {
		const pokemonId = card.dataset.pokemonId;
		
		// 🎯 Handler unificado para click y tecla
		const handleCardActivation = (event) => {
			if (event.type === 'keydown' && event.key !== 'Enter') return;
			
			event.preventDefault();
			window.location.href = `/pokemon/${pokemonId}`;
		};

		// 🖱️ Agregar listeners
		card.addEventListener('click', handleCardActivation);
		card.addEventListener('keydown', handleCardActivation);
	});
}
