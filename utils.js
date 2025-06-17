function createMarker(colour, size = 1, shape = 'teardrop') {
    // Si el color es una key del objeto MARKER_COLORS, usar el valor hex
    const finalColor = MARKER_COLORS[colour] || colour;
    
    const baseSize = size;
    const halfSize = baseSize / 2;
    
    let shapeStyles = '';
    let iconAnchorX = baseSize * 8;
    let iconAnchorY = baseSize * 8;
    
    switch(shape) {
        case 'teardrop':
            shapeStyles = `
                border-radius: ${baseSize * 3}rem ${baseSize * 3}rem 0;
                transform: rotate(45deg);
            `;
            break;
            
        case 'pin':
            shapeStyles = `
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
            `;
            iconAnchorY = baseSize * 12;
            break;
            
        case 'diamond':
            shapeStyles = `
                border-radius: 0;
                transform: rotate(45deg);
            `;
            break;
            
        case 'balloon':
            shapeStyles = `
                border-radius: ${baseSize * 2}rem ${baseSize * 2}rem ${baseSize * 0.5}rem ${baseSize * 2}rem;
                transform: rotate(45deg);
            `;
            break;
            
        case 'arrow':
            shapeStyles = `
                border-radius: 0 ${baseSize * 3}rem 0 0;
                transform: rotate(45deg);
            `;
            break;
            
        case 'cross':
            // Estrella de 4 puntas usando clip-path
            shapeStyles = `
                border-radius: 0;
                transform: rotate(45deg);
                clip-path: polygon(
                    50% 0%, 
                    65% 35%, 
                    100% 50%, 
                    65% 65%, 
                    50% 100%, 
                    35% 65%, 
                    0% 50%, 
                    35% 35%
                );
            `;
            break;
    }
    
    const marker = `
        background-color: ${finalColor};
        width: ${baseSize}rem;
        height: ${baseSize}rem;
        display: block;
        left: -${halfSize}rem;
        top: -${halfSize}rem;
        position: relative;
        ${shapeStyles}
        border: 1px solid #FFFFFF;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    `;

    return L.divIcon({
        className: "my-custom-pin",
        iconAnchor: [iconAnchorX, iconAnchorY],
        labelAnchor: [0, 0],
        popupAnchor: [0, -iconAnchorY - 4],
        html: `<span style="${marker}" />`
    });
}

const MARKER_COLORS = {
    purple: '#583470',
    green: '#4CAF50',
    blue: '#2196F3',
    red: '#F44336',
    orange: '#FF9800',
    yellow: '#FFEB3B',
    pink: '#E91E63',
    brown: '#795548',
    grey: '#9E9E9E',
    black: '#000000',
    white: '#FFFFFF',
    teal: '#009688',
    cyan: '#00BCD4',
    indigo: '#3F51B5',
    lime: '#CDDC39',
    lightBlue: '#03A9F4',
    lightGreen: '#8BC34A',
    deepOrange: '#FF5722',
    deepPurple: '#673AB7',
    amber: '#FFC107',
    lightPink: '#F8BBD0',
    lightGrey: '#F5F5F5',
    darkGrey: '#616161',
    darkBlue: '#303F9F',
    darkGreen: '#388E3C',
    darkRed: '#D32F2F',
    darkOrange: '#F57C00',
    darkCyan: '#00796B',
    darkTeal: '#004D40',
    darkIndigo: '#303F9F',
    darkLime: '#AFB42B',
    darkPink: '#C2185B',
    darkBrown: '#5D4037',
    darkerRed: '#B71C1C',
    darkerBlue: '#1A237E',
    darkerGreen: '#1B5E20',
    darkerOrange: '#E65100',
    darkerPurple: '#4A148C',    
};

function showSidebarText(title, text) {
    const titleHTML = `<h2>${title}</h2>`;
    const contentHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
    document.getElementById('sidebar-content').innerHTML = titleHTML + contentHTML;
    document.getElementById('sidebar').style.display = 'block';
}

function showSidebarFromFile(filePath, cityName, regionName) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            // Create a title from cityName and add it before the markdown content
            marked.setOptions({ breaks: true }); // Habilitar saltos de línea
            const titleHTML = `<h2>${cityName}</h2>`;
            document.getElementById('sidebar-content').innerHTML = titleHTML + marked.parse(data);
            
            if (cityName && regionName) {
                const cityEncoded = encodeURIComponent(cityName);
                const regionEncoded = encodeURIComponent(regionName);

            } else {
                console.error("Error: Parámetros de ciudad o región no definidos.");
            }

            document.getElementById('sidebar').style.display = 'block';
        })
        .catch(error => {
            console.error('Error loading content:', error);
            document.getElementById('sidebar-content').innerHTML = '<p>Error loading content.</p>';
            document.getElementById('sidebar').style.display = 'block';
        });
}