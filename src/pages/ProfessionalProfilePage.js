import { professionalService, serviceService, loading, toast } from '../services/apiService.js';

let professionalData = null;
let professionalServices = [];

async function loadProfessionalData(professionalId) {
    try {
        loading.show('Cargando perfil...');
        
        // Cargar datos del profesional y sus servicios en paralelo
        const [professionalResponse, servicesResponse] = await Promise.all([
            professionalService.getById(professionalId),
            serviceService.getAll()
        ]);
        
        // Extraer los datos de las respuestas
        professionalData = professionalResponse.data || professionalResponse;
        const allServices = servicesResponse.data || servicesResponse;
        
        // Debug: verificar portafolio
        console.log('📸 Portfolio del profesional:', professionalData.portfolio);
        console.log('📋 Datos completos del profesional:', professionalData);
        
        // Filtrar servicios del profesional (asegurar que allServices sea un array)
        professionalServices = Array.isArray(allServices) 
            ? allServices.filter(s => s.professional?._id === professionalId || s.professional === professionalId)
            : [];
        
        loading.hide();
        return true;
    } catch (error) {
        loading.hide();
        toast.error('Error al cargar el perfil del profesional');
        console.error(error);
        return false;
    }
}

export async function renderProfessionalProfilePage(params) {
    // Cargar datos del backend
    const loaded = await loadProfessionalData(params.id);
    
    if (!loaded || !professionalData) {
        return `
            <div class="min-h-screen flex items-center justify-center">
                <div class="text-center">
                    <h1 class="text-2xl font-bold text-gray-900 mb-4">Profesional no encontrado</h1>
                    <button onclick="router.navigate('/profesionales')" class="bg-primary text-white px-6 py-2 rounded-lg">
                        Volver a profesionales
                    </button>
                </div>
            </div>
        `;
    }
    
    const professional = professionalData;

    return `
        <div class="bg-gray-50 min-h-screen">
            <!-- Header con imagen de fondo mejorado -->
            <div class="bg-gradient-to-br from-aegean-600 via-aegean-700 to-olive-gold-600 relative overflow-hidden" style="min-height: 320px;">
                <!-- Patrón decorativo de fondo -->
                <div class="absolute inset-0 opacity-10">
                    <div class="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
                    <div class="absolute bottom-0 right-0 w-96 h-96 bg-olive-gold-300 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
                </div>
                
                <!-- Overlay oscuro -->
                <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50"></div>
                
                <!-- Contenido del header -->
                <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
                    <!-- Botón volver -->
                    <button onclick="window.history.back()" class="inline-flex items-center text-white/90 hover:text-white mb-8 transition-colors group">
                        <i class="fas fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i>
                        <span class="font-medium">Volver</span>
                    </button>
                    
                    <!-- Información principal -->
                    <div class="flex flex-col md:flex-row items-start md:items-end gap-6">
                        <!-- Foto de perfil con efecto -->
                        <div class="relative group">
                            <div class="absolute inset-0 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                            <img src="${professional.profileImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(professional.businessName) + '&background=1B4B7A&color=fff&size=256'}" 
                                 alt="${professional.businessName}" 
                                 class="relative w-40 h-40 rounded-full border-4 border-white shadow-2xl object-cover ring-4 ring-white/20">
                            ${professional.isAvailable !== false ? `
                                <div class="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white shadow-lg">
                                    <span class="flex h-full w-full items-center justify-center">
                                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                    </span>
                                </div>
                            ` : ''}
                        </div>
                        
                        <!-- Información del perfil -->
                        <div class="flex-1 text-white space-y-4">
                            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h1 class="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">${professional.businessName}</h1>
                                    <div class="flex flex-wrap items-center gap-2 mb-3">
                                        ${professional.specialties.map(specialty => `
                                            <span class="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium border border-white/30 hover:bg-white/30 transition-colors">${specialty}</span>
                                        `).join('')}
                                    </div>
                                    ${professional.experience?.years ? `
                                        <p class="text-olive-gold-100 text-lg flex items-center gap-2">
                                            <i class="fas fa-award"></i>
                                            <span>${professional.experience.years} años de experiencia profesional</span>
                                        </p>
                                    ` : ''}
                                </div>
                                
                                <!-- Badge de disponibilidad -->
                                ${professional.isAvailable !== false ? `
                                    <div class="inline-flex items-center bg-emerald-500/90 backdrop-blur-md text-white px-5 py-3 rounded-xl font-semibold shadow-lg border border-emerald-400/30 hover:bg-emerald-600/90 transition-all">
                                        <div class="flex items-center">
                                            <span class="flex h-3 w-3 relative mr-3">
                                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                                                <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-100"></span>
                                            </span>
                                            <span class="text-base">Disponible ahora</span>
                                        </div>
                                    </div>
                                ` : `
                                    <div class="inline-flex items-center bg-gray-600/80 backdrop-blur-md text-white px-5 py-3 rounded-xl font-semibold shadow-lg border border-gray-500/30">
                                        <i class="fas fa-clock mr-2 text-gray-300"></i>
                                        <span class="text-base">No disponible</span>
                                    </div>
                                `}
                            </div>
                            
                            <!-- Rating y estadísticas -->
                            <div class="flex flex-wrap items-center gap-6 pt-2">
                                <!-- Rating -->
                                <div class="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
                                    <div class="flex items-center gap-1">
                                        ${Array.from({length: 5}, (_, i) => 
                                            `<i class="fas fa-star text-lg ${i < Math.floor(professional.metrics?.averageRating || 0) ? 'text-yellow-400' : 'text-white/30'}"></i>`
                                        ).join('')}
                                    </div>
                                    <span class="text-white font-bold text-lg">${(professional.metrics?.averageRating || 0).toFixed(1)}</span>
                                    <span class="text-white/70">·</span>
                                    <span class="text-white/90">${professional.metrics?.totalReviews || 0} reseñas</span>
                                </div>
                                
                                <!-- Servicios completados -->
                                ${professional.metrics?.totalBookings ? `
                                    <div class="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
                                        <i class="fas fa-check-circle text-emerald-400 text-lg"></i>
                                        <span class="text-white font-semibold">${professional.metrics.totalBookings}</span>
                                        <span class="text-white/90">servicios</span>
                                    </div>
                                ` : ''}
                                
                                <!-- Ubicación -->
                                ${professional.serviceLocation?.salonAddress?.city ? `
                                    <div class="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
                                        <i class="fas fa-map-marker-alt text-red-400 text-lg"></i>
                                        <span class="text-white/90">${professional.serviceLocation.salonAddress.city}</span>
                                    </div>
                                ` : professional.serviceLocation?.type === 'home_service' ? `
                                    <div class="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
                                        <i class="fas fa-home text-blue-400 text-lg"></i>
                                        <span class="text-white/90">A domicilio</span>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="grid lg:grid-cols-5 gap-8">
                    <!-- Información principal -->
                    <div class="lg:col-span-3 space-y-8">
                        <!-- Sobre mí -->
                        <div class="bg-white rounded-lg shadow-sm p-6">
                            <h2 class="text-2xl font-bold text-gray-900 mb-4">Sobre mí</h2>
                            <p class="text-gray-700 leading-relaxed mb-4">${professional.description || 'Profesional dedicado a ofrecer servicios de calidad.'}</p>
                            ${professional.experience?.years ? `
                                <p class="text-gray-700">
                                    Con ${professional.experience.years} años de experiencia en el sector, 
                                    especializado en ${professional.specialties.join(', ').toLowerCase()}. 
                                    ${professional.experience.description || 'Me apasiona ayudar a mis clientes a sentirse mejor consigo mismos.'}
                                </p>
                            ` : ''}
                        </div>

                        <!-- Portafolio -->
                        <div class="bg-white rounded-lg shadow-sm p-6">
                            <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <i class="fas fa-images text-purple-600 mr-2"></i>
                                Portafolio
                            </h2>
                            ${professional.portfolio && professional.portfolio.length > 0 ? `
                                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    ${professional.portfolio.map(item => `
                                        <div class="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer bg-gray-100">
                                            <img src="${item.imageUrl}" 
                                                 alt="${item.title || 'Imagen de portafolio'}" 
                                                 class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                                                 onerror="this.src='https://via.placeholder.com/400x300?text=Imagen+No+Disponible'"
                                                 loading="lazy">
                                            <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
                                                    <h3 class="font-semibold text-sm mb-1">${item.title || 'Sin título'}</h3>
                                                    ${item.category ? `<span class="text-xs bg-purple-600 px-2 py-1 rounded">${item.category}</span>` : ''}
                                                    ${item.description ? `<p class="text-xs mt-2 line-clamp-2">${item.description}</p>` : ''}
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : `
                                <div class="text-center py-12">
                                    <i class="fas fa-images text-6xl text-gray-300 mb-4"></i>
                                    <p class="text-gray-500 text-lg">Este profesional aún no ha agregado imágenes a su portafolio</p>
                                </div>
                            `}
                        </div>

                        <!-- Servicios -->
                        <div class="bg-white rounded-lg shadow-sm p-6">
                            <h2 class="text-2xl font-bold text-gray-900 mb-6">Servicios</h2>
                            ${professionalServices.length > 0 ? `
                                <div class="grid md:grid-cols-2 gap-4">
                                    ${professionalServices.map(service => `
                                        <div class="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                                            <h3 class="font-semibold text-gray-900 mb-2">${service.name}</h3>
                                            <p class="text-sm text-gray-600 mb-3">
                                                ${service.description || 'Servicio profesional con productos de calidad premium.'}
                                            </p>
                                            <div class="flex justify-between items-center">
                                                <div>
                                                    <span class="font-semibold text-primary">${service.pricing.basePrice}€</span>
                                                    <span class="text-xs text-gray-500 ml-1">/ ${service.duration.estimated}min</span>
                                                </div>
                                                <button onclick="router.navigate('/booking/new?pro=${professional._id}&service=${service._id}')" 
                                                        class="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors ${!professional.isAvailable ? 'opacity-50 cursor-not-allowed' : ''}"
                                                        ${!professional.isAvailable ? 'disabled' : ''}>
                                                    Reservar
                                                </button>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : `
                                <p class="text-gray-600 text-center py-8">Este profesional aún no ha publicado servicios.</p>
                            `}
                        </div>

                        <!-- Reseñas -->
                        <div class="bg-white rounded-lg shadow-sm p-6">
                            <h2 class="text-2xl font-bold text-gray-900 mb-6">Reseñas de clientes</h2>
                            ${professional.metrics?.totalReviews > 0 ? `
                                <div class="space-y-6">
                                    <!-- Las reseñas se cargarán cuando se implemente el sistema de reseñas -->
                                    <p class="text-gray-600 text-center py-8">
                                        Este profesional tiene ${professional.metrics.totalReviews} reseñas con una calificación promedio de ${professional.metrics.averageRating}/5
                                    </p>
                                </div>
                            ` : `
                                <p class="text-gray-600 text-center py-8">Este profesional aún no tiene reseñas.</p>
                            `}
                        </div>
                    </div>

                    <!-- Sidebar -->
                    <div class="lg:col-span-2 space-y-6">
                        <!-- Información de contacto -->
                        <div class="bg-white rounded-lg shadow-sm p-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Información</h3>
                            <div class="space-y-3">
                                ${professional.serviceLocation?.salonAddress?.street ? `
                                    <div class="flex items-center space-x-3">
                                        <i class="fas fa-map-marker-alt text-gray-400"></i>
                                        <span class="text-gray-700">${professional.serviceLocation.salonAddress.street}, ${professional.serviceLocation.salonAddress.city}</span>
                                    </div>
                                ` : professional.serviceLocation?.type === 'home_service' ? `
                                    <div class="flex items-center space-x-3">
                                        <i class="fas fa-home text-gray-400"></i>
                                        <span class="text-gray-700">Servicio a domicilio (${professional.serviceLocation.serviceRadius || 10} km de radio)</span>
                                    </div>
                                ` : ''}
                                ${professional.contactInfo?.businessPhone ? `
                                    <div class="flex items-center space-x-3">
                                        <i class="fas fa-phone text-gray-400"></i>
                                        <span class="text-gray-700">${professional.contactInfo.businessPhone}</span>
                                    </div>
                                ` : ''}
                                <div class="flex items-center space-x-3">
                                    <i class="fas fa-certificate text-gray-400"></i>
                                    <span class="text-gray-700">${professional.specialties.join(', ')}</span>
                                </div>
                                ${professional.experience?.years ? `
                                    <div class="flex items-center space-x-3">
                                        <i class="fas fa-award text-gray-400"></i>
                                        <span class="text-gray-700">${professional.experience.years} años de experiencia</span>
                                    </div>
                                ` : ''}
                            </div>
                        </div>

                        <!-- Reservar cita -->
                        <div class="bg-white rounded-lg shadow-sm p-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Reservar cita</h3>
                            <p class="text-gray-600 text-sm mb-4">
                                Selecciona un servicio y reserva tu cita de forma rápida y sencilla.
                            </p>
                            <button onclick="router.navigate('/booking/new?pro=${professional._id}')" 
                                    class="w-full bg-gradient-to-r from-aegean-600 to-olive-gold-600 hover:from-aegean-700 hover:to-olive-gold-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${!professional.isAvailable ? 'opacity-50 cursor-not-allowed' : ''}"
                                    ${!professional.isAvailable ? 'disabled' : ''}>
                                <i class="fas fa-calendar-plus mr-2"></i>
                                ${professional.isAvailable !== false ? 'Reservar ahora' : 'No disponible'}
                            </button>
                            
                            ${!professional.isAvailable ? `
                                <p class="text-sm text-red-600 mt-2 text-center">
                                    Este profesional no está disponible en este momento
                                </p>
                            ` : ''}
                        </div>

                        <!-- Horarios -->
                        ${professional.availability?.schedule ? `
                            <div class="bg-white rounded-lg shadow-sm p-6">
                                <h3 class="text-lg font-semibold text-gray-900 mb-4">Horarios</h3>
                                <div class="space-y-2 text-sm">
                                    ${Object.entries(professional.availability.schedule).map(([day, schedule]) => {
                                        const dayNames = {
                                            monday: 'Lunes',
                                            tuesday: 'Martes',
                                            wednesday: 'Miércoles',
                                            thursday: 'Jueves',
                                            friday: 'Viernes',
                                            saturday: 'Sábado',
                                            sunday: 'Domingo'
                                        };
                                        return `
                                            <div class="flex justify-between">
                                                <span class="text-gray-600">${dayNames[day] || day}</span>
                                                <span class="text-gray-900">${schedule.available ? `${schedule.hours.start} - ${schedule.hours.end}` : 'Cerrado'}</span>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}