// Componente de mapa interactivo usando Leaflet (servicio gratuito)
import L from 'leaflet';

// Inicializar mapa
export function initMap(containerId, onLocationSelected) {
    console.log('🗺️ initMap llamado para:', containerId);
    
    // Verificar que el contenedor existe
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`❌ Contenedor del mapa "${containerId}" no encontrado`);
        return null;
    }
    
    console.log('✅ Contenedor encontrado:', container);
    
    // Verificar que el contenedor está visible y tiene dimensiones
    const rect = container.getBoundingClientRect();
    console.log('📏 Dimensiones del contenedor:', rect);
    
    if (rect.width === 0 || rect.height === 0) {
        console.warn(`⚠️ Contenedor del mapa "${containerId}" no tiene dimensiones (${rect.width}x${rect.height})`);
        // Intentar de todas formas, a veces Leaflet puede manejar esto
    }
    
    // Limpiar contenedor
    container.innerHTML = '';
    
    // Coordenadas de Santa Cruz de la Sierra, Bolivia por defecto
    const defaultLat = -17.7833;
    const defaultLng = -63.1821;
    
    try {
        console.log('🌍 Creando mapa Leaflet...');
        // Crear mapa
        const map = L.map(containerId).setView([defaultLat, defaultLng], 13);
        console.log('✅ Mapa creado:', map);
    
    // Añadir capa de tiles (OpenStreetMap es gratuito)
    console.log('🗺️ Agregando capa de tiles...');
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    console.log('✅ Capa de tiles agregada');
    
    // Variable para el marcador
    let marker = null;
    
    // Intentar obtener ubicación actual del usuario
    if (navigator.geolocation) {
        console.log('📍 Solicitando ubicación del usuario...');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                console.log('✅ Ubicación obtenida:', lat, lng);
                map.setView([lat, lng], 15);
                
                // Agregar marcador en ubicación actual
                marker = L.marker([lat, lng]).addTo(map);
                marker.bindPopup('📍 Tu ubicación actual').openPopup();
                
                // Geocodificación reversa (convertir coordenadas a dirección)
                reverseGeocode(lat, lng).then(address => {
                    console.log('✅ Dirección obtenida:', address);
                    if (onLocationSelected) {
                        onLocationSelected({
                            lat,
                            lng,
                            address
                        });
                    }
                });
            },
            (error) => {
                console.warn('⚠️ No se pudo obtener la ubicación:', error.message);
                console.log('ℹ️ El usuario puede seleccionar manualmente en el mapa');
            }
        );
    } else {
        console.warn('⚠️ Geolocation no disponible en este navegador');
    }
    
    // Permitir clic en el mapa para seleccionar ubicación
        map.on('click', async (e) => {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            
            // Remover marcador anterior
            if (marker) {
                map.removeLayer(marker);
            }
            
            // Agregar nuevo marcador
            marker = L.marker([lat, lng]).addTo(map);
            marker.bindPopup('📍 Ubicación seleccionada').openPopup();
            
            // Obtener dirección
            const address = await reverseGeocode(lat, lng);
            
            if (onLocationSelected) {
                onLocationSelected({
                    lat,
                    lng,
                    address
                });
            }
        });
        
        return map;
        
    } catch (error) {
        console.error('Error inicializando mapa:', error);
        return null;
    }
}

// Geocodificación reversa usando Nominatim (servicio gratuito de OpenStreetMap)
async function reverseGeocode(lat, lng) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            {
                headers: {
                    'Accept-Language': 'es'
                }
            }
        );
        
        if (!response.ok) {
            throw new Error('Error en geocodificación');
        }
        
        const data = await response.json();
        
        // Construir dirección legible
        const address = data.address;
        const parts = [];
        
        if (address.road) parts.push(address.road);
        if (address.house_number) parts.push(address.house_number);
        if (address.suburb || address.neighbourhood) parts.push(address.suburb || address.neighbourhood);
        if (address.city || address.town || address.village) parts.push(address.city || address.town || address.village);
        if (address.postcode) parts.push(address.postcode);
        
        return parts.join(', ') || data.display_name;
        
    } catch (error) {
        console.error('Error en geocodificación reversa:', error);
        return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
}

// Buscar dirección y mover el mapa (geocodificación directa)
export async function searchAddress(address, map) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
            {
                headers: {
                    'Accept-Language': 'es'
                }
            }
        );
        
        if (!response.ok) {
            throw new Error('Error en búsqueda de dirección');
        }
        
        const data = await response.json();
        
        if (data && data.length > 0) {
            const result = data[0];
            const lat = parseFloat(result.lat);
            const lng = parseFloat(result.lon);
            
            // Mover mapa a la ubicación encontrada
            if (map) {
                map.setView([lat, lng], 16);
                
                // Agregar marcador
                const marker = L.marker([lat, lng]).addTo(map);
                marker.bindPopup('📍 ' + result.display_name).openPopup();
            }
            
            return {
                lat,
                lng,
                address: result.display_name
            };
        }
        
        return null;
        
    } catch (error) {
        console.error('Error en búsqueda de dirección:', error);
        return null;
    }
}

// Fix para los iconos de Leaflet en Vite
export function fixLeafletIcons() {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
}
