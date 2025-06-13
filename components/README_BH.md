# 🌀 Sistema de Agujeros Negros para Leaflet

## Instalación

1. Incluye los archivos en tu HTML:
```html
<link rel="stylesheet" href="blackhole.css">
<script src="blackhole.js"></script>
```

2. Inicializa después de crear tu mapa:
```javascript
BlackHoleSystem.init(map);
```

## Uso Básico

### Opción 1: Agujeros Negros Interactivos

```javascript
// Agujero negro simple
BlackHoleSystem.create(lat, lng, size, color);

// Agujero negro clickeable con popup
BlackHoleSystem.create(20, -10, 150, 'red', {
    clickable: true,
    popup: '<b>Mi Agujero Negro</b>',
    onClick: function(bh) {
        console.log('Clickeado!', bh);
    }
});
```

### Opción 2: Como Markers de Leaflet

```javascript
// Crear como marker nativo
const marker = BlackHoleSystem.createAsMarker(lat, lng, size, color);

// Usar todas las funciones de Leaflet
marker.bindPopup('Contenido del popup');
marker.on('click', function(e) { /* ... */ });
marker.addTo(map);

// Marker arrastrable
const draggable = BlackHoleSystem.createAsMarker(0, 0, 200, 'blue', {
    draggable: true
});
draggable.addTo(map);
```

## API Completa

### Métodos Principales
- `init(map, containerId)` - Inicializar sistema
- `create(lat, lng, size, color, options)` - Crear agujero negro
- `createAsMarker(lat, lng, size, color, markerOptions)` - Crear como marker
- `remove(id)` - Eliminar uno
- `removeAll()` - Eliminar todos

### Métodos de Manipulación
- `move(id, lat, lng)` - Mover posición
- `setSize(id, size)` - Cambiar tamaño
- `setColor(id, color)` - Cambiar color ('red', 'blue', 'green')
- `setPopup(id, content)` - Establecer/actualizar popup
- `showPopup(id)` - Mostrar popup

### Métodos de Consulta
- `get(id)` - Obtener info de uno
- `getAll()` - Obtener todos

## Ejemplos de Uso

### Mapa Corrupto (como Waterdeep)
```javascript
// Agujero negro que tiembla la pantalla al clickear
BlackHoleSystem.create(0, 0, 200, 'red', {
    clickable: true,
    popup: '⚠️ NO TOCAR ⚠️',
    onClick: function() {
        document.body.classList.add('shake-effect');
        setTimeout(() => document.body.classList.remove('shake-effect'), 500);
    }
});
```

### Sistema de Portales
```javascript
// Portal de entrada
const portal1 = BlackHoleSystem.create(10, 20, 150, 'blue', {
    clickable: true,
    popup: 'Portal A → B',
    onClick: function() {
        map.setView([30, 40], 5); // Teletransportar vista
    }
});

// Portal de salida
const portal2 = BlackHoleSystem.create(30, 40, 150, 'blue', {
    clickable: true,
    popup: 'Portal B → A'
});
```

### Agujeros Negros Dinámicos
```javascript
// Agujero que crece con el tiempo
const growing = BlackHoleSystem.create(0, 0, 50, 'green');
let size = 50;

setInterval(() => {
    size += 5;
    if (size > 300) size = 50;
    BlackHoleSystem.setSize(growing.id, size);
}, 100);
```

## Colores Disponibles
- `'red'` - Rojo corrupto (default)
- `'blue'` - Azul dimensional  
- `'green'` - Verde tóxico

## Notas
- Los agujeros negros usan `backdrop-filter` para el efecto de distorsión
- Compatible con todos los navegadores modernos
- El rendimiento es bueno hasta ~20-30 agujeros negros simultáneos
- Los markers nativos son más eficientes para grandes cantidades