/**
 * ========================================
 * SISTEMA DE AGUJEROS NEGROS
 * ========================================
 * 
 * Uso básico:
 * 1. Incluir blackhole.css y blackhole.js en tu HTML
 * 2. Inicializar: BlackHoleSystem.init(map)
 * 3. Crear agujeros: BlackHoleSystem.create(lat, lng, size, color)
 */

const BlackHoleSystem = {
    // Array para almacenar todos los agujeros negros
    blackHoles: [],
    
    // Referencia al mapa de Leaflet
    map: null,
    
    // Contenedor donde se crearán los agujeros negros
    container: null,
    
    /**
     * Inicializa el sistema de agujeros negros
     * @param {L.Map} leafletMap - Instancia del mapa de Leaflet
     * @param {string} containerId - ID del contenedor (por defecto 'map-container')
     */
    init: function(leafletMap, containerId = 'map-container') {
        this.map = leafletMap;
        this.container = document.getElementById(containerId);
        
        if (!this.container) {
            console.error('BlackHoleSystem: No se encontró el contenedor');
            return false;
        }
        
        // Configurar listeners del mapa
        this.map.on('move zoom', () => {
            this.updateAllPositions();
        });
        
        console.log('BlackHoleSystem inicializado');
        return true;
    },
    
    /**
     * Crea un nuevo agujero negro
     * @param {number} lat - Latitud
     * @param {number} lng - Longitud
     * @param {number} size - Tamaño en píxeles (default: 150)
     * @param {string} color - Variante de color: 'red', 'blue', 'green' (default: 'red')
     * @param {object} options - Opciones adicionales {clickable, popup, onClick}
     * @returns {object} Objeto con información del agujero negro creado
     */
    create: function(lat, lng, size = 150, color = 'red', options = {}) {
        if (!this.map || !this.container) {
            console.error('BlackHoleSystem: Sistema no inicializado. Llama a init() primero.');
            return null;
        }
        
        const blackHoleId = 'black-hole-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        
        // Crear el HTML del agujero negro
        const blackHoleHTML = `
            <div id="${blackHoleId}" class="black-hole ${color}" data-lat="${lat}" data-lng="${lng}">
                <div class="black-hole-core">
                    <div class="gravity-well"></div>
                    <div class="accretion-disk"></div>
                    <div class="event-horizon"></div>
                    <!-- Partículas siendo absorbidas -->
                    <div class="black-hole-particle" style="top: 50%; left: 0;"></div>
                    <div class="black-hole-particle" style="top: 0; left: 50%; animation-delay: 0.5s;"></div>
                    <div class="black-hole-particle" style="top: 50%; right: 0; animation-delay: 1s;"></div>
                    <div class="black-hole-particle" style="bottom: 0; left: 50%; animation-delay: 1.5s;"></div>
                    <div class="black-hole-particle" style="top: 25%; left: 25%; animation-delay: 2s;"></div>
                    <div class="black-hole-particle" style="top: 75%; right: 25%; animation-delay: 2.5s;"></div>
                </div>
            </div>
        `;
        
        // Agregar al contenedor
        this.container.insertAdjacentHTML('beforeend', blackHoleHTML);
        
        // Obtener referencia al elemento creado
        const blackHoleElement = document.getElementById(blackHoleId);
        
        // Configurar tamaño
        blackHoleElement.style.width = size + 'px';
        blackHoleElement.style.height = size + 'px';
        blackHoleElement.style.setProperty('--size', size + 'px');
        
        // Agregar variación aleatoria a las animaciones
        const randomDelay = Math.random() * 3;
        blackHoleElement.querySelector('.event-horizon').style.animationDelay = randomDelay + 's';
        blackHoleElement.querySelector('.accretion-disk').style.animationDelay = (randomDelay * 0.5) + 's';
        blackHoleElement.querySelector('.gravity-well').style.animationDelay = (randomDelay * 0.7) + 's';
        
        // Configurar interactividad si está habilitada
        if (options.clickable) {
            blackHoleElement.style.pointerEvents = 'auto';
            blackHoleElement.style.cursor = 'pointer';
            
            // Agregar evento de click
            blackHoleElement.addEventListener('click', (e) => {
                e.stopPropagation();
                if (options.onClick) {
                    options.onClick(blackHoleObj);
                }
                if (blackHoleObj.popup) {
                    this.showPopup(blackHoleId);
                }
            });
        }
        
        // Posicionar
        this.updatePosition(blackHoleElement);
        
        // Crear objeto de referencia
        const blackHoleObj = {
            id: blackHoleId,
            element: blackHoleElement,
            lat: lat,
            lng: lng,
            size: size,
            color: color,
            options: options,
            popup: null,
            popupContent: options.popup || null
        };
        
        // Agregar a la lista
        this.blackHoles.push(blackHoleObj);
        
        console.log(`Agujero negro creado: ${blackHoleId}`);
        return blackHoleObj;
    },
    
    /**
     * Actualiza la posición de un agujero negro en el mapa
     * @param {HTMLElement} blackHoleElement - Elemento del agujero negro
     */
    updatePosition: function(blackHoleElement) {
        const lat = parseFloat(blackHoleElement.dataset.lat);
        const lng = parseFloat(blackHoleElement.dataset.lng);
        const point = this.map.latLngToContainerPoint(L.latLng(lat, lng));
        const size = parseInt(blackHoleElement.style.width) || 150;
        blackHoleElement.style.left = (point.x - size/2) + 'px';
        blackHoleElement.style.top = (point.y - size/2) + 'px';
    },
    
    /**
     * Actualiza las posiciones de todos los agujeros negros
     */
    updateAllPositions: function() {
        this.blackHoles.forEach(bh => {
            this.updatePosition(bh.element);
        });
    },
    
    /**
     * Elimina un agujero negro específico
     * @param {string} blackHoleId - ID del agujero negro a eliminar
     */
    remove: function(blackHoleId) {
        const index = this.blackHoles.findIndex(bh => bh.id === blackHoleId);
        if (index !== -1) {
            this.blackHoles[index].element.remove();
            this.blackHoles.splice(index, 1);
            console.log(`Agujero negro eliminado: ${blackHoleId}`);
        }
    },
    
    /**
     * Elimina todos los agujeros negros
     */
    removeAll: function() {
        this.blackHoles.forEach(bh => bh.element.remove());
        this.blackHoles.length = 0;
        console.log('Todos los agujeros negros eliminados');
    },
    
    /**
     * Cambia el tamaño de un agujero negro
     * @param {string} blackHoleId - ID del agujero negro
     * @param {number} size - Nuevo tamaño en píxeles
     */
    setSize: function(blackHoleId, size) {
        const blackHole = this.blackHoles.find(bh => bh.id === blackHoleId);
        if (blackHole) {
            blackHole.size = size;
            blackHole.element.style.width = size + 'px';
            blackHole.element.style.height = size + 'px';
            blackHole.element.style.setProperty('--size', size + 'px');
            this.updatePosition(blackHole.element);
        }
    },
    
    /**
     * Mueve un agujero negro a nuevas coordenadas
     * @param {string} blackHoleId - ID del agujero negro
     * @param {number} lat - Nueva latitud
     * @param {number} lng - Nueva longitud
     */
    move: function(blackHoleId, lat, lng) {
        const blackHole = this.blackHoles.find(bh => bh.id === blackHoleId);
        if (blackHole) {
            blackHole.lat = lat;
            blackHole.lng = lng;
            blackHole.element.dataset.lat = lat;
            blackHole.element.dataset.lng = lng;
            this.updatePosition(blackHole.element);
        }
    },
    
    /**
     * Obtiene información de un agujero negro
     * @param {string} blackHoleId - ID del agujero negro
     * @returns {object|null} Información del agujero negro o null si no existe
     */
    get: function(blackHoleId) {
        return this.blackHoles.find(bh => bh.id === blackHoleId) || null;
    },
    
    /**
     * Obtiene todos los agujeros negros
     * @returns {array} Array con todos los agujeros negros
     */
    getAll: function() {
        return this.blackHoles;
    },
    
    /**
     * Cambia el color de un agujero negro
     * @param {string} blackHoleId - ID del agujero negro
     * @param {string} color - Nuevo color ('red', 'blue', 'green')
     */
    setColor: function(blackHoleId, color) {
        const blackHole = this.blackHoles.find(bh => bh.id === blackHoleId);
        if (blackHole) {
            // Remover color anterior
            blackHole.element.classList.remove('red', 'blue', 'green');
            // Agregar nuevo color
            blackHole.element.classList.add(color);
            blackHole.color = color;
        }
    },
    
    /**
     * Establece o actualiza el contenido del popup
     * @param {string} blackHoleId - ID del agujero negro
     * @param {string} content - Contenido HTML del popup
     */
    setPopup: function(blackHoleId, content) {
        const blackHole = this.blackHoles.find(bh => bh.id === blackHoleId);
        if (blackHole) {
            blackHole.popupContent = content;
        }
    },
    
    /**
     * Muestra el popup de un agujero negro
     * @param {string} blackHoleId - ID del agujero negro
     */
    showPopup: function(blackHoleId) {
        const blackHole = this.blackHoles.find(bh => bh.id === blackHoleId);
        if (blackHole && blackHole.popupContent) {
            // Si ya existe un popup, eliminarlo
            if (blackHole.popup) {
                blackHole.popup.remove();
            }
            
            // Crear popup estilo Leaflet
            const popup = L.popup({
                closeButton: true,
                autoClose: false,
                closeOnClick: false,
                className: 'black-hole-popup'
            })
            .setLatLng([blackHole.lat, blackHole.lng])
            .setContent(blackHole.popupContent)
            .openOn(this.map);
            
            blackHole.popup = popup;
        }
    },
    
    /**
     * Crea un agujero negro como marker nativo de Leaflet
     * @param {number} lat - Latitud
     * @param {number} lng - Longitud
     * @param {number} size - Tamaño en píxeles (default: 150)
     * @param {string} color - Variante de color: 'red', 'blue', 'green' (default: 'red')
     * @param {object} markerOptions - Opciones del marker de Leaflet
     * @returns {L.Marker} Marker de Leaflet con apariencia de agujero negro
     */
    createAsMarker: function(lat, lng, size = 150, color = 'red', markerOptions = {}) {
        // Crear el HTML del agujero negro
        const blackHoleHTML = `
            <div class="black-hole ${color}" style="width: ${size}px; height: ${size}px;">
                <div class="black-hole-core">
                    <div class="gravity-well"></div>
                    <div class="accretion-disk"></div>
                    <div class="event-horizon"></div>
                    <div class="black-hole-particle" style="top: 50%; left: 0;"></div>
                    <div class="black-hole-particle" style="top: 0; left: 50%; animation-delay: 0.5s;"></div>
                    <div class="black-hole-particle" style="top: 50%; right: 0; animation-delay: 1s;"></div>
                    <div class="black-hole-particle" style="bottom: 0; left: 50%; animation-delay: 1.5s;"></div>
                    <div class="black-hole-particle" style="top: 25%; left: 25%; animation-delay: 2s;"></div>
                    <div class="black-hole-particle" style="top: 75%; right: 25%; animation-delay: 2.5s;"></div>
                </div>
            </div>
        `;
        
        // Crear DivIcon
        const blackHoleIcon = L.divIcon({
            html: blackHoleHTML,
            iconSize: [size, size],
            iconAnchor: [size/2, size/2],
            popupAnchor: [0, -size/2],
            className: 'black-hole-marker'
        });
        
        // Crear y retornar el marker
        const marker = L.marker([lat, lng], {
            icon: blackHoleIcon,
            ...markerOptions
        });
        
        // Agregar referencia para tracking interno si es necesario
        marker.blackHoleType = 'marker';
        marker.blackHoleColor = color;
        marker.blackHoleSize = size;
        
        return marker;
    }
};