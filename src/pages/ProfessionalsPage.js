import { professionalService, loading, toast } from '../services/apiService.js';

let allProfessionals = [];

// Cargar profesionales desde la API
async function loadProfessionals() {
    try {
        loading.show('Cargando profesionales...');
        console.log('🔄 Iniciando carga de profesionales...');
        
        const response = await professionalService.getAll();
        console.log('📦 Respuesta completa del servidor:', response);
        
        // Extraer array de la respuesta
        const professionalsData = response.data || response;
        console.log('📋 Datos de profesionales extraídos:', professionalsData);
        console.log('📋 ¿Es array?:', Array.isArray(professionalsData));
        
        allProfessionals = Array.isArray(professionalsData) ? professionalsData : [];
        
        console.log('👥 Profesionales cargados:', allProfessionals.length);
        
        // Mostrar algunos ejemplos
        if (allProfessionals.length > 0) {
            console.log('📋 Primer profesional:', allProfessionals[0]);
            console.log('📋 Especialidades del primero:', allProfessionals[0].specialties);
        }
        
        loading.hide();
        return true;
    } catch (error) {
        loading.hide();
        console.error('❌ Error completo:', error);
        console.error('❌ Mensaje del error:', error.message);
        console.error('❌ Status del error:', error.status);
        toast.error('Error al cargar profesionales: ' + (error.message || 'Error desconocido'));
        allProfessionals = [];
        return false;
    }
}

export async function renderProfessionalsPage() {
    // Cargar profesionales de la API
    await loadProfessionals();
    
    // Obtener especialidades únicas
    const specialties = [...new Set(allProfessionals.flatMap(p => p.specialties || []))];
    
    return `
        <div class="bg-gradient-to-br from-marble-50 via-white to-olive-gold-50 min-h-screen py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Enhanced Header -->
                <div class="text-center mb-16">
                    <div class="inline-block px-6 py-3 bg-olive-gold-100 rounded-full text-olive-gold-700 text-sm font-semibold mb-8">
                        💅 Expertos en Belleza
                    </div>
                    <h1 class="text-4xl lg:text-6xl font-serif font-bold text-aegean-600 mb-6 leading-tight">
                        Encuentra tu <span class="text-olive-gold-600">profesional ideal</span>
                    </h1>
                    <p class="text-xl lg:text-2xl text-gray-600 font-sans font-light max-w-4xl mx-auto leading-relaxed">
                        Conecta con los mejores estilistas y especialistas en belleza de Santa Cruz. 
                        <span class="text-olive-gold-600 font-serif font-semibold">Elegancia mediterránea</span> en el corazón de Bolivia.
                    </p>
                </div>

                <!-- Enhanced Filters -->
                <div class="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-marble-200">
                    <div class="grid lg:grid-cols-4 gap-6">
                        <div class="lg:col-span-2">
                            <label class="block text-sm font-semibold text-aegean-600 mb-3">
                                <i class="fas fa-scissors mr-2 text-olive-gold-600"></i>
                                Especialidad
                            </label>
                            <select id="specialty-filter" class="w-full px-4 py-3 border border-marble-300 rounded-xl focus:ring-2 focus:ring-olive-gold-500 focus:border-olive-gold-500 transition-all">
                                <option value="">Todas las especialidades</option>
                                ${specialties.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-aegean-600 mb-3">
                                <i class="fas fa-clock mr-2 text-olive-gold-600"></i>
                                Disponibilidad
                            </label>
                            <select id="availability-filter" class="w-full px-4 py-3 border border-marble-300 rounded-xl focus:ring-2 focus:ring-olive-gold-500 focus:border-olive-gold-500 transition-all">
                                <option value="">Todos</option>
                                <option value="true">Disponibles ahora</option>
                            </select>
                        </div>
                        <div class="flex items-end">
                            <button onclick="applyFilters()" class="w-full group relative bg-gradient-mediterranean text-white font-semibold px-8 py-3 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <span class="flex items-center justify-center">
                                    <i class="fas fa-search mr-2"></i>
                                    Buscar Expertos
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Enhanced Professionals Grid -->
                <div id="professionals-grid" class="professionals-grid grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
                    ${allProfessionals.map(professional => renderProfessionalCard(professional)).join('')}
                </div>

                ${allProfessionals.length === 0 ? `
                    <div class="text-center py-20">
                        <div class="w-32 h-32 bg-gradient-to-br from-marble-200 to-olive-gold-100 rounded-full flex items-center justify-center mx-auto mb-8">
                            <i class="fas fa-user-friends text-4xl text-olive-gold-600"></i>
                        </div>
                        <h3 class="text-2xl font-serif font-bold text-aegean-600 mb-4">Próximamente más profesionales</h3>
                        <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">Estamos trabajando para traerte los mejores expertos en belleza de Santa Cruz</p>
                        <button onclick="router.navigate('/auth/register')" class="group relative bg-gradient-mediterranean text-white font-semibold px-8 py-4 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105">
                            <span class="flex items-center justify-center">
                                <i class="fas fa-user-plus mr-2"></i>
                                ¿Eres profesional? Únete a Kalos
                            </span>
                        </button>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function renderProfessionalCard(professional) {
    // Obtener ubicación
    const location = professional.serviceLocation?.salonAddress 
        ? `${professional.serviceLocation.salonAddress.city}` 
        : 'Santa Cruz';
    
    // Calcular rating
    const rating = professional.metrics?.averageRating || 4.8;
    const reviews = professional.metrics?.totalReviews || Math.floor(Math.random() * 50) + 10;
    
    // Imagen por defecto
    const image = professional.profileImage || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face';
    
    // Descripción corta
    const description = professional.description?.substring(0, 80) || 'Profesional de servicios de belleza especializado';
    
    const specialtiesText = professional.specialties && professional.specialties.length > 0 
        ? professional.specialties.slice(0, 2).join(', ') + (professional.specialties.length > 2 ? '...' : '')
        : 'Servicios de belleza';
    
    return `
        <div class="professional-card group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer hover:-translate-y-2 border border-marble-200 w-full max-w-sm mx-auto" 
             onclick="router.navigate('/pro/${professional._id}')">
            <div class="relative">
                <div class="relative w-full overflow-hidden">
                    <img 
                        src="${image}" 
                        alt="${professional.businessName || professional.name}" 
                        class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        onerror="this.src='https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face'"
                    >
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <!-- Hover overlay -->
                <div class="absolute inset-0 bg-gradient-mediterranean opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-center justify-center">
                    <div class="text-white text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <i class="fas fa-eye text-3xl mb-2"></i>
                        <div class="font-semibold">Ver Perfil Completo</div>
                    </div>
                </div>
            </div>
            
            <div class="p-6">
                <div class="mb-3">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="text-lg font-serif font-bold text-aegean-600 group-hover:text-olive-gold-600 transition-colors line-clamp-2 leading-tight">${professional.businessName || professional.name}</h3>
                        ${professional.isAvailable !== false ? `
                            <div class="flex items-center bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-1 rounded-full shrink-0 ml-2">
                                <i class="fas fa-circle text-emerald-500 mr-1 animate-pulse" style="font-size: 6px;"></i>
                                Disponible
                            </div>
                        ` : `
                            <div class="flex items-center bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-1 rounded-full shrink-0 ml-2">
                                <i class="fas fa-circle text-gray-400 mr-1" style="font-size: 6px;"></i>
                                Ocupado
                            </div>
                        `}
                    </div>
                </div>
                
                <div class="flex items-center mb-3">
                    <div class="w-2 h-2 bg-olive-gold-600 rounded-full mr-2"></div>
                    <p class="text-olive-gold-600 text-sm font-medium">${specialtiesText}</p>
                </div>
                
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center">
                        <div class="flex items-center mr-2">
                            ${[1,2,3,4,5].map(star => `
                                <i class="fas fa-star ${star <= Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'} text-sm"></i>
                            `).join('')}
                        </div>
                        <span class="text-sm font-medium text-gray-600">${rating.toFixed(1)}</span>
                    </div>
                    <span class="text-xs text-gray-500">${reviews} reseñas</span>
                </div>
                
                <p class="text-gray-600 text-sm mb-4 leading-relaxed">${description}${description.length >= 80 ? '...' : ''}</p>
                
                <div class="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div class="flex items-center">
                        <i class="fas fa-map-marker-alt mr-2 text-olive-gold-600"></i>
                        <span class="truncate">${location}</span>
                    </div>
                    ${professional.experience?.years ? `
                        <div class="flex items-center shrink-0 ml-2">
                            <i class="fas fa-medal mr-1 text-terracotta-500"></i>
                            <span class="font-medium">${professional.experience.years}+ años</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="flex items-center justify-between mt-6 gap-3">
                    <div class="flex -space-x-2 shrink-0">
                        <!-- Simulated client avatars -->
                        <div class="w-7 h-7 bg-gradient-to-br from-aegean-400 to-aegean-600 rounded-full border-2 border-white"></div>
                        <div class="w-7 h-7 bg-gradient-to-br from-olive-gold-400 to-olive-gold-600 rounded-full border-2 border-white"></div>
                        <div class="w-7 h-7 bg-gradient-to-br from-terracotta-400 to-terracotta-600 rounded-full border-2 border-white flex items-center justify-center">
                            <span class="text-white text-xs font-bold">+${Math.floor(reviews/10)}</span>
                        </div>
                    </div>
                    <button onclick="event.stopPropagation(); router.navigate('/booking/new?pro=${professional._id}')" 
                            class="group/btn relative bg-gradient-to-r from-aegean-600 to-olive-gold-600 text-white font-semibold px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm flex-1 max-w-[140px] ${professional.isAvailable === false ? 'opacity-50 cursor-not-allowed' : ''}"
                            ${professional.isAvailable === false ? 'disabled' : ''}>
                        <span class="flex items-center justify-center">
                            <i class="fas fa-calendar-check mr-2"></i>
                            ${professional.isAvailable !== false ? 'Reservar' : 'No disponible'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Función global para aplicar filtros
window.applyFilters = function() {
    const specialty = document.getElementById('specialty-filter').value;
    const availability = document.getElementById('availability-filter').value;
    
    let filteredProfessionals = [...allProfessionals];
    
    // Filtrar por especialidad
    if (specialty) {
        filteredProfessionals = filteredProfessionals.filter(p => 
            p.specialties && p.specialties.includes(specialty)
        );
    }
    
    // Filtrar por disponibilidad
    if (availability === 'true') {
        filteredProfessionals = filteredProfessionals.filter(p => p.isAvailable === true);
    }
    
    const grid = document.getElementById('professionals-grid');
    
    if (filteredProfessionals.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-user-slash text-4xl text-gray-400 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">No se encontraron profesionales</h3>
                <p class="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
            </div>
        `;
    } else {
        grid.innerHTML = filteredProfessionals.map(professional => renderProfessionalCard(professional)).join('');
    }
};