import { serviceService, professionalService, toast, loading } from '../services/apiService.js';

let allServices = [];
let allProfessionals = [];
let currentCategory = '';

async function loadServicesData() {
    try {
        loading.show('Cargando servicios...');
        
        const [servicesRes, professionalsRes] = await Promise.all([
            serviceService.getAll(),
            professionalService.getAll()
        ]);
        
        // Extraer arrays de las respuestas
        const servicesData = servicesRes.data || servicesRes;
        const professionalsData = professionalsRes.data || professionalsRes;
        
        allServices = Array.isArray(servicesData) ? servicesData : [];
        allProfessionals = Array.isArray(professionalsData) ? professionalsData : [];
        
        console.log('🛍️ Servicios cargados:', allServices.length);
        console.log('👥 Profesionales cargados:', allProfessionals.length);
        
        loading.hide();
        return true;
    } catch (error) {
        loading.hide();
        console.error('❌ Error cargando servicios:', error);
        toast.error('Error al cargar servicios');
        allServices = [];
        allProfessionals = [];
        return false;
    }
}

export async function renderServicesPage() {
    // Cargar datos iniciales
    await loadServicesData();
    
    // Configurar listener después de renderizar
    setTimeout(() => {
        setupSearchListener();
    }, 100);
    
    return `
        <div class="bg-marble min-h-screen py-8">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Header -->
                <div class="text-center mb-12">
                    <h1 class="text-4xl font-serif font-bold text-aegean mb-4">Nuestros Servicios</h1>
                    <p class="text-xl text-gray-600 font-sans font-light max-w-3xl mx-auto">
                        Descubre servicios de belleza con <span class="text-olive-gold font-serif font-semibold">elegancia mediterránea</span>
                    </p>
                </div>

                <!-- Search Bar -->
                <div class="mb-8">
                    <div class="max-w-2xl mx-auto">
                        <input type="text" 
                               id="search-services" 
                               placeholder="🔍 Buscar servicios..."
                               class="w-full px-6 py-4 rounded-full border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-lg">
                    </div>
                </div>

                <!-- Categories Tabs -->
                <div id="categories-container" class="flex flex-wrap justify-center gap-2 mb-8">
                    <button onclick="window.filterByCategory('')" id="category-all" 
                            class="category-tab px-6 py-3 rounded-full font-medium transition-colors bg-primary text-white">
                        Todos
                    </button>
                    <button onclick="window.filterByCategory('corte_cabello')" id="category-corte_cabello" 
                            class="category-tab px-6 py-3 rounded-full font-medium transition-colors bg-white text-gray-700 hover:bg-gray-100">
                        Corte de Cabello
                    </button>
                    <button onclick="window.filterByCategory('coloracion')" id="category-coloracion" 
                            class="category-tab px-6 py-3 rounded-full font-medium transition-colors bg-white text-gray-700 hover:bg-gray-100">
                        Coloración
                    </button>
                    <button onclick="window.filterByCategory('manicura_pedicura')" id="category-manicura_pedicura" 
                            class="category-tab px-6 py-3 rounded-full font-medium transition-colors bg-white text-gray-700 hover:bg-gray-100">
                        Manicura
                    </button>
                    <button onclick="window.filterByCategory('tratamiento_facial')" id="category-tratamiento_facial" 
                            class="category-tab px-6 py-3 rounded-full font-medium transition-colors bg-white text-gray-700 hover:bg-gray-100">
                        Tratamiento Facial
                    </button>
                    <button onclick="window.filterByCategory('masaje_relajante')" id="category-masaje_relajante" 
                            class="category-tab px-6 py-3 rounded-full font-medium transition-colors bg-white text-gray-700 hover:bg-gray-100">
                        Masajes
                    </button>
                </div>

                <!-- Services Grid -->
                <div id="services-grid" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    ${allServices.length > 0 ? allServices.map(service => renderServiceCard(service)).join('') : `
                        <div class="col-span-full text-center py-12">
                            <div class="text-6xl mb-4">📦</div>
                            <h3 class="text-2xl font-bold text-gray-900 mb-2">No hay servicios disponibles</h3>
                            <p class="text-gray-600">Aún no se han agregado servicios a la plataforma</p>
                        </div>
                    `}
                </div>

                <!-- Empty State -->
                <div id="empty-state" class="hidden text-center py-12">
                    <div class="text-6xl mb-4">🔍</div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-2">No se encontraron servicios</h3>
                    <p class="text-gray-600">Intenta con otros términos de búsqueda</p>
                </div>

                <!-- CTA Section -->
                <div class="text-center mt-16 bg-gradient-to-br from-aegean-50 via-white to-olive-gold-50 rounded-2xl p-12 border-2 border-aegean-200 shadow-lg">
                    <h2 class="text-3xl font-bold mb-4 text-aegean-700">¿No encuentras lo que buscas?</h2>
                    <p class="text-xl text-gray-700 mb-6 max-w-2xl mx-auto">
                        Explora nuestros profesionales y descubre más servicios personalizados
                    </p>
                    <button onclick="window.router.navigate('/profesionales')" 
                            class="px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
                            style="background: linear-gradient(135deg, rgb(27, 75, 122) 0%, rgb(184, 134, 11) 100%) !important; color: white !important; border: none !important;">
                        <i class="fas fa-users mr-2"></i>
                        Ver todos los profesionales
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Helper function para renderizar la tarjeta de servicio
function renderServiceCard(service) {
    const professional = allProfessionals.find(p => p._id === service.professional?._id || p._id === service.professional);
    
    return `
        <div class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-purple-200">
            <div class="p-6">
                <!-- Header with Category and Price -->
                <div class="flex items-start justify-between mb-4">
                    <div class="flex flex-col">
                        <span class="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium w-fit mb-2">
                            ${formatCategory(service.category)}
                        </span>
                    </div>
                    <div class="text-right">
                        <span class="text-2xl font-bold text-primary">€${service.pricing?.basePrice || 'N/A'}</span>
                        ${service.duration?.estimated ? `
                            <p class="text-xs text-gray-500">⏱️ ${service.duration.estimated} min</p>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Service Info -->
                <h3 class="text-xl font-semibold text-gray-900 mb-2">${service.name}</h3>
                
                <!-- Professional Info -->
                ${professional ? `
                    <div class="flex items-center gap-2 mb-3 text-sm">
                        <span class="text-gray-600">Por:</span>
                        <a href="/pro/${professional._id}" 
                           onclick="event.preventDefault(); window.router.navigate('/pro/${professional._id}')"
                           class="text-purple-600 hover:underline font-medium">
                            ${professional.businessName || 'Profesional'}
                        </a>
                    </div>
                ` : ''}
                
                <!-- Description -->
                <p class="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                    ${service.description || 'Servicio profesional de alta calidad'}
                </p>
                
                <!-- Actions -->
                <div class="flex gap-2">
                    ${professional ? `
                        <button onclick="window.router.navigate('/pro/${professional._id}')" 
                                class="flex-1 bg-gradient-to-r from-aegean-600 to-aegean-700 text-white py-3 px-4 rounded-lg hover:from-aegean-700 hover:to-aegean-800 transition-all duration-300 font-semibold text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                style="background: linear-gradient(to right, rgb(27, 75, 122), rgb(20, 60, 98)) !important; color: white !important; border: none !important;">
                            <i class="fas fa-user-circle"></i>
                            <span>Ver Perfil</span>
                        </button>
                        <button onclick="window.router.navigate('/booking/new?pro=${professional._id}&service=${service._id}')" 
                                class="bg-gradient-to-r from-olive-gold-600 to-olive-gold-700 text-white py-3 px-6 rounded-lg hover:from-olive-gold-700 hover:to-olive-gold-800 transition-all duration-300 font-bold text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                style="background: linear-gradient(to right, rgb(184, 134, 11), rgb(160, 115, 8)) !important; color: white !important; border: none !important;">
                            <i class="fas fa-calendar-check"></i>
                            <span>Reservar</span>
                        </button>
                    ` : `
                        <button onclick="window.router.navigate('/profesionales')" 
                                class="w-full bg-gradient-to-r from-aegean-600 to-olive-gold-600 text-white py-3 px-4 rounded-lg hover:from-aegean-700 hover:to-olive-gold-700 transition-all duration-300 font-semibold text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                style="background: linear-gradient(to right, rgb(27, 75, 122), rgb(184, 134, 11)) !important; color: white !important; border: none !important;">
                            <i class="fas fa-search"></i>
                            <span>Buscar Profesional</span>
                        </button>
                    `}
                </div>
            </div>
        </div>
    `;
}

function formatCategory(category) {
    const categories = {
        'corte_cabello': 'Corte de Cabello',
        'coloracion': 'Coloración',
        'manicura': 'Manicura',
        'pedicura': 'Pedicura',
        'manicura_pedicura': 'Manicura/Pedicura',
        'unas_gel': 'Uñas de Gel',
        'tratamiento_facial': 'Tratamiento Facial',
        'facial_hidratante': 'Tratamiento Facial',
        'masaje_relajante': 'Masaje Relajante',
        'masaje': 'Masaje',
        'peinado': 'Peinado',
        'depilacion': 'Depilación',
        'maquillaje': 'Maquillaje',
        'otro': 'Otros Servicios'
    };
    return categories[category] || category.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function renderServicesGrid() {
    const grid = document.getElementById('services-grid');
    const emptyState = document.getElementById('empty-state');
    
    if (!grid) {
        console.warn('⚠️ Grid element not found');
        return;
    }
    
    let filteredServices = allServices;
    
    // Filtrar por categoría
    if (currentCategory) {
        filteredServices = allServices.filter(s => {
            // Normalizar categorías similares
            const category = s.category?.toLowerCase() || '';
            const filterCategory = currentCategory.toLowerCase();
            
            // Coincidencia exacta
            if (category === filterCategory) return true;
            
            // Coincidencias por variantes
            if (filterCategory === 'manicura_pedicura' && (category.includes('manicura') || category.includes('pedicura'))) return true;
            if (filterCategory === 'tratamiento_facial' && category.includes('facial')) return true;
            if (filterCategory === 'masaje_relajante' && category.includes('masaje')) return true;
            
            return false;
        });
    }
    
    // Filtrar por búsqueda
    const searchInput = document.getElementById('search-services');
    if (searchInput && searchInput.value) {
        const searchTerm = searchInput.value.toLowerCase();
        filteredServices = filteredServices.filter(s => {
            const name = (s.name || '').toLowerCase();
            const description = (s.description || '').toLowerCase();
            const category = formatCategory(s.category).toLowerCase();
            const professionalName = (allProfessionals.find(p => p._id === (s.professional?._id || s.professional))?.businessName || '').toLowerCase();
            
            return name.includes(searchTerm) ||
                   description.includes(searchTerm) ||
                   category.includes(searchTerm) ||
                   professionalName.includes(searchTerm);
        });
    }
    
    if (filteredServices.length === 0) {
        grid.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }
    
    grid.classList.remove('hidden');
    emptyState.classList.add('hidden');
    grid.innerHTML = filteredServices.map(service => renderServiceCard(service)).join('');
}

function setupSearchListener() {
    const searchInput = document.getElementById('search-services');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            renderServicesGrid();
        });
    }
}

// Exponer funciones globalmente
window.renderServicesGrid = renderServicesGrid;

// Función global para filtrar por categoría
window.filterByCategory = function(category) {
    currentCategory = category;
    renderServicesGrid();
    
    // Update active tab
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.remove('bg-primary', 'text-white');
        tab.classList.add('bg-white', 'text-gray-700', 'hover:bg-gray-100');
    });
    
    const activeTab = category ? 
        document.getElementById(`category-${category}`) : 
        document.getElementById('category-all');
    
    if (activeTab) {
        activeTab.classList.remove('bg-white', 'text-gray-700', 'hover:bg-gray-100');
        activeTab.classList.add('bg-primary', 'text-white');
    }
};