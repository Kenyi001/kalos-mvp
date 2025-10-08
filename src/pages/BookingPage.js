import { authService, professionalService, serviceService, bookingService, loading, toast, formatDate, formatPrice, formatTime } from '../services/apiService.js';
import { initMap, fixLeafletIcons } from '../components/ui/MapSelector.js';

let bookingState = {
    step: 1,
    professional: null,
    service: null,
    date: null,
    time: null,
    notes: '',
    location: 'professional',
    clientAddress: '',
    clientCoordinates: null,
    allProfessionals: [],
    allServices: []
};

// Cargar datos iniciales
async function loadInitialData() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const proId = urlParams.get('pro');
        const serviceId = urlParams.get('service');
        
        loading.show('Cargando...');
        
        // Cargar profesionales y servicios
        const [professionalsResponse, servicesResponse] = await Promise.all([
            professionalService.getAll(),
            serviceService.getAll()
        ]);
        
        // Extraer arrays de las respuestas
        const professionals = professionalsResponse.data || professionalsResponse;
        const services = servicesResponse.data || servicesResponse;
        
        // Asegurar que sean arrays
        bookingState.allProfessionals = Array.isArray(professionals) ? professionals : [];
        bookingState.allServices = Array.isArray(services) ? services : [];
        
        console.log('📋 Profesionales cargados:', bookingState.allProfessionals.length);
        console.log('🛍️ Servicios cargados:', bookingState.allServices.length);
        console.log('🛍️ Servicios completos:', bookingState.allServices.map(s => ({
            id: s._id,
            name: s.name,
            professionalId: s.professional?._id || s.professional,
            isActive: s.isActive
        })));
        
        // Si hay parámetros en URL, preseleccionar
        if (proId) {
            bookingState.professional = professionals.find(p => p._id === proId);
        }
        
        if (serviceId) {
            bookingState.service = services.find(s => s._id === serviceId);
        }
        
        loading.hide();
        return true;
    } catch (error) {
        loading.hide();
        toast.error('Error al cargar datos');
        console.error(error);
        return false;
    }
}

export async function renderBookingPage() {
    // Verificar autenticación
    if (!authService.isAuthenticated()) {
        return `
            <div class="min-h-screen flex items-center justify-center bg-gray-50">
                <div class="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
                    <i class="fas fa-lock text-4xl text-purple-600 mb-4"></i>
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">Inicia sesión para continuar</h2>
                    <p class="text-gray-600 mb-6">Necesitas una cuenta para hacer una reserva</p>
                    <button onclick="router.navigate('/auth/login')" 
                            class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                        Iniciar sesión
                    </button>
                </div>
            </div>
        `;
    }

    // VALIDACIÓN: Prevenir auto-reserva SIEMPRE (no solo en loadInitialData)
    const urlParams = new URLSearchParams(window.location.search);
    const proId = urlParams.get('pro');
    const currentUser = authService.getCurrentUser();
    
    if (proId && currentUser && currentUser.role === 'professional' && currentUser.professionalId === proId) {
        toast.error('No puedes hacer una reserva contigo mismo');
        setTimeout(() => {
            window.router.navigate('/profesionales');
        }, 1500);
        return `
            <div class="min-h-screen flex items-center justify-center bg-gray-50">
                <div class="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
                    <i class="fas fa-exclamation-circle text-4xl text-red-600 mb-4"></i>
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">No puedes reservar contigo mismo</h2>
                    <p class="text-gray-600 mb-6">Redirigiendo...</p>
                    <div class="spinner mx-auto"></div>
                </div>
            </div>
        `;
    }

    // Cargar datos si es necesario
    if (bookingState.allProfessionals.length === 0) {
        const loaded = await loadInitialData();
        if (!loaded) {
            return `
                <div class="min-h-screen flex items-center justify-center bg-gray-50">
                    <div class="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
                        <i class="fas fa-exclamation-triangle text-4xl text-yellow-600 mb-4"></i>
                        <h2 class="text-2xl font-bold text-gray-900 mb-4">Error al cargar datos</h2>
                        <p class="text-gray-600 mb-6">Por favor, intenta de nuevo</p>
                        <button onclick="router.navigate('/profesionales')" 
                                class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                            Volver a profesionales
                        </button>
                    </div>
                </div>
            `;
        }
    }

    return `
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Progress Bar -->
                <div class="mb-8">
                    <div class="flex items-center justify-between mb-4">
                        <h1 class="text-3xl font-bold text-gray-900">Nueva Reserva</h1>
                        <button onclick="router.navigate('/')" class="text-gray-600 hover:text-gray-800">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <div class="flex items-center space-x-4">
                        
                            <div class="flex items-center">
                                <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                                    1 <= bookingState.step ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                                }">
                                    1
                                </div>
                                <span class="ml-2 text-sm ${
                                    1 <= bookingState.step ? 'text-primary font-medium' : 'text-gray-600'
                                }">
                                    Servicio
                                </span>
                                <i class="fas fa-chevron-right text-gray-400 ml-4"></i>
                            </div>
                        
                            <div class="flex items-center">
                                <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                                    2 <= bookingState.step ? 'bg-primary text-white' : 
                                    2 === bookingState.step ? 'bg-gray-200 text-gray-600' : 'bg-gray-100 text-gray-400'
                                }">
                                    2
                                </div>
                                <span class="ml-2 text-sm ${
                                    2 <= bookingState.step ? 'text-primary font-medium' : 'text-gray-600'
                                }">
                                    Fecha y Hora
                                </span>
                                <i class="fas fa-chevron-right text-gray-400 ml-4"></i>
                            </div>
                        
                            <div class="flex items-center">
                                <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                                    3 <= bookingState.step ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                                }">
                                    3
                                </div>
                                <span class="ml-2 text-sm ${
                                    3 <= bookingState.step ? 'text-primary font-medium' : 'text-gray-600'
                                }">
                                    Confirmación
                                </span>
                                
                            </div>
                        
                    </div>
                </div>

                <!-- Step Content -->
                <div class="bg-white rounded-lg shadow-sm overflow-hidden" id="booking-content">
                    ${renderBookingStep()}
                </div>
            </div>
        </div>
    `;
}

function renderBookingStep() {
    switch (bookingState.step) {
        case 1:
            return renderStep1();
        case 2:
            return renderStep2();
        case 3:
            return renderStep3();
        default:
            return renderStep1();
    }
}

// Paso 1: Selección de servicio
function renderStep1() {
    // Asegurar que allServices sea un array
    const allServices = Array.isArray(bookingState.allServices) ? bookingState.allServices : [];
    const currentUser = authService.getCurrentUser();
    
    console.log('🔍 DEBUG - allServices:', allServices.length);
    console.log('🔍 DEBUG - professional seleccionado:', bookingState.professional?._id);
    
    let services = bookingState.professional 
        ? allServices.filter(s => {
            const profId = s.professional?._id || s.professional;
            const matches = profId === bookingState.professional._id;
            console.log(`  - Servicio "${s.name}": profId=${profId}, matches=${matches}, isActive=${s.isActive}`);
            return s.professional && profId === bookingState.professional._id;
        })
        : allServices;
    
    // Filtrar servicios propios si el usuario es profesional
    if (currentUser && currentUser.role === 'professional' && currentUser.professionalId) {
        services = services.filter(s => {
            const serviceProfId = s.professional?._id || s.professional;
            return serviceProfId !== currentUser.professionalId;
        });
    }
    
    console.log('🔍 Servicios a mostrar:', services.length);
    
    return `
        <div class="p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Selecciona un servicio</h2>
            
            ${bookingState.professional ? `
                <div class="mb-6 p-4 bg-purple-50 rounded-lg">
                    <p class="text-sm text-gray-600">Profesional seleccionado:</p>
                    <p class="font-semibold text-purple-900">${bookingState.professional.businessName}</p>
                </div>
            ` : ''}
            
            <div class="grid gap-4">
                ${services.length > 0 ? services.map(service => `
                    <div class="border rounded-lg p-4 hover:border-purple-300 transition-colors cursor-pointer ${bookingState.service?._id === service._id ? 'border-purple-500 bg-purple-50' : ''}">
                        <div class="flex justify-between items-start">
                            <div class="flex-1">
                                <h3 class="font-semibold text-lg mb-1">${service.name}</h3>
                                <p class="text-sm text-gray-600 mb-2">${service.description}</p>
                                <div class="flex items-center space-x-4 text-sm text-gray-500">
                                    <span><i class="fas fa-clock mr-1"></i>${service.duration.estimated} min</span>
                                    <span><i class="fas fa-map-marker-alt mr-1"></i>${service.serviceConfig?.location === 'both' ? 'Salón y domicilio' : service.serviceConfig?.location === 'salon' ? 'Solo en salón' : 'Solo a domicilio'}</span>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="text-2xl font-bold text-purple-600 mb-3">${formatPrice(service.pricing.basePrice)}</p>
                                <button onclick="selectService('${service._id}')" 
                                        class="text-sm inline-flex items-center"
                                        style="background: linear-gradient(to right, rgb(124, 58, 237), rgb(109, 40, 217)) !important; color: white !important; font-weight: 600 !important; padding: 0.625rem 1.5rem !important; border-radius: 0.5rem !important; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important; transition: all 0.3s ease !important;"
                                        onmouseover="this.style.background='linear-gradient(to right, rgb(109, 40, 217), rgb(91, 33, 182))'; this.style.boxShadow='0 10px 15px -3px rgba(0, 0, 0, 0.1)'; this.style.transform='scale(1.05)';"
                                        onmouseout="this.style.background='linear-gradient(to right, rgb(124, 58, 237), rgb(109, 40, 217))'; this.style.boxShadow='0 4px 6px -1px rgba(0, 0, 0, 0.1)'; this.style.transform='scale(1)';">
                                    <i class="fas fa-check-circle mr-2"></i>
                                    Seleccionar
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('') : `
                    <div class="text-center py-12">
                        <i class="fas fa-inbox text-4xl text-gray-300 mb-4"></i>
                        <p class="text-gray-600 mb-4">No hay servicios disponibles</p>
                        <button onclick="router.navigate('/profesionales')" 
                                class="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                            Ver profesionales
                        </button>
                    </div>
                `}
            </div>
        </div>
    `;
}

// Paso 2: Selección de fecha y hora
function renderStep2() {
    const service = bookingState.service;
    const professional = bookingState.allProfessionals.find(p => p._id === service.professional._id);
    
    // Generar próximos 7 días
    const dates = [];
    for (let i = 1; i <= 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        dates.push(date);
    }
    
    // Horarios disponibles (9:00 - 18:00)
    const times = [];
    for (let hour = 9; hour <= 18; hour++) {
        times.push(`${hour.toString().padStart(2, '0')}:00`);
        times.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    
    return `
        <div class="p-6 md:p-8 max-w-5xl mx-auto">
            <!-- Botón volver mejorado -->
            <button onclick="goToStep(1)" class="inline-flex items-center text-aegean-600 hover:text-aegean-700 mb-6 font-medium transition-all group">
                <i class="fas fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i>
                <span>Volver a servicios</span>
            </button>
            
            <!-- Header mejorado -->
            <div class="mb-8">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                    <span class="w-10 h-10 bg-gradient-to-br from-aegean-600 to-olive-gold-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg">2</span>
                    Fecha, Hora y Ubicación
                </h2>
                <p class="text-gray-600 text-lg">Selecciona cuándo y dónde deseas recibir el servicio</p>
            </div>
            
            <!-- Resumen del servicio mejorado -->
            <div class="mb-8 p-5 bg-gradient-to-br from-aegean-50 to-olive-gold-50 border-2 border-aegean-200 rounded-xl shadow-sm">
                <div class="flex items-center gap-4">
                    <div class="w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-md">
                        <i class="fas fa-spa text-2xl text-aegean-600"></i>
                    </div>
                    <div class="flex-1">
                        <p class="text-xs font-medium text-aegean-600 uppercase tracking-wide mb-1">Servicio seleccionado</p>
                        <h3 class="font-bold text-xl text-gray-900">${service.name}</h3>
                        <div class="flex items-center gap-3 text-sm text-gray-600 mt-1">
                            <span class="flex items-center gap-1">
                                <i class="fas fa-user-circle text-aegean-600"></i>
                                ${professional.businessName}
                            </span>
                            <span class="text-gray-300">•</span>
                            <span class="flex items-center gap-1 font-semibold text-olive-gold-700">
                                <i class="fas fa-tag"></i>
                                ${formatPrice(service.pricing.basePrice)}
                            </span>
                            <span class="text-gray-300">•</span>
                            <span class="flex items-center gap-1">
                                <i class="fas fa-clock"></i>
                                ${service.duration.estimated} min
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Selección de fecha mejorada -->
            <div class="mb-10">
                <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <i class="fas fa-calendar-alt text-aegean-600"></i>
                    Selecciona la fecha
                </h3>
                <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
                    ${dates.map(date => {
                        const dateStr = date.toISOString().split('T')[0];
                        const isSelected = bookingState.date === dateStr;
                        const isToday = new Date().toDateString() === date.toDateString();
                        return `
                            <button onclick="selectDate('${dateStr}')" 
                                    class="group relative p-4 border-2 rounded-xl text-center transition-all duration-300 transform hover:scale-105 ${
                                        isSelected 
                                        ? 'border-aegean-500 bg-gradient-to-br from-aegean-50 to-aegean-100 shadow-xl scale-105' 
                                        : 'border-gray-200 hover:border-aegean-300 hover:bg-aegean-50 shadow-sm hover:shadow-md'
                                    }">
                                ${isToday ? '<div class="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-olive-gold-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">Hoy</div>' : ''}
                                <div class="text-xs font-medium uppercase tracking-wide mb-1 ${isSelected ? 'text-aegean-700' : 'text-gray-500'}">${date.toLocaleDateString('es-ES', { weekday: 'short' })}</div>
                                <div class="font-bold text-2xl mb-1 ${isSelected ? 'text-aegean-800' : 'text-gray-900'}">${date.getDate()}</div>
                                <div class="text-xs font-medium ${isSelected ? 'text-aegean-700' : 'text-gray-500'}">${date.toLocaleDateString('es-ES', { month: 'short' })}</div>
                                ${isSelected ? '<div class="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-2xl" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border: 3px solid white;"><span style="color: white !important; font-size: 18px; font-weight: bold; line-height: 1;">✓</span></div>' : ''}
                            </button>
                        `;
                    }).join('')}
                </div>
            </div>
            
            <!-- Selección de hora mejorada -->
            <div class="mb-10">
                <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <i class="fas fa-clock text-aegean-600"></i>
                    Selecciona la hora
                </h3>
                
                <!-- Horarios de Mañana -->
                <div class="mb-6">
                    <div class="flex items-center gap-2 mb-4">
                        <span class="text-2xl">🌅</span>
                        <h4 class="text-lg font-semibold text-gray-700">Mañana</h4>
                        <span class="text-sm text-gray-500 ml-auto">${times.filter(t => parseInt(t.split(':')[0]) < 13).length} horarios disponibles</span>
                    </div>
                    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        ${times.filter(t => parseInt(t.split(':')[0]) < 13).map(time => `
                            <button onclick="selectTime('${time}')" 
                                    class="py-3.5 px-4 border-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                                        bookingState.time === time 
                                        ? 'border-olive-gold-500 bg-gradient-to-br from-olive-gold-500 to-olive-gold-600 text-white shadow-lg scale-105' 
                                        : 'border-gray-200 hover:border-olive-gold-300 hover:bg-olive-gold-50 text-gray-700 shadow-sm hover:shadow-md'
                                    }">
                                <i class="fas fa-clock mr-1 text-xs"></i>
                                ${time}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Horarios de Tarde -->
                <div>
                    <div class="flex items-center gap-2 mb-4">
                        <span class="text-2xl">☀️</span>
                        <h4 class="text-lg font-semibold text-gray-700">Tarde</h4>
                        <span class="text-sm text-gray-500 ml-auto">${times.filter(t => parseInt(t.split(':')[0]) >= 13).length} horarios disponibles</span>
                    </div>
                    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        ${times.filter(t => parseInt(t.split(':')[0]) >= 13).map(time => `
                            <button onclick="selectTime('${time}')" 
                                    class="py-3.5 px-4 border-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                                        bookingState.time === time 
                                        ? 'border-olive-gold-500 bg-gradient-to-br from-olive-gold-500 to-olive-gold-600 text-white shadow-lg scale-105' 
                                        : 'border-gray-200 hover:border-olive-gold-300 hover:bg-olive-gold-50 text-gray-700 shadow-sm hover:shadow-md'
                                    }">
                                <i class="fas fa-clock mr-1 text-xs"></i>
                                ${time}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <!-- Ubicación del servicio mejorada -->
            <div class="mb-10">
                <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <i class="fas fa-map-marker-alt text-aegean-600"></i>
                    Ubicación del servicio
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${service.serviceConfig?.location === 'salon' || service.serviceConfig?.location === 'both' ? `
                        <button onclick="selectLocation('professional')" 
                                class="group relative p-6 border-2 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                                    bookingState.location === 'professional' 
                                    ? 'border-aegean-500 bg-gradient-to-br from-aegean-50 to-aegean-100 shadow-xl scale-105' 
                                    : 'border-gray-200 hover:border-aegean-300 hover:bg-aegean-50 shadow-md hover:shadow-lg'
                                }">
                            <div class="flex items-start gap-4">
                                <div class="w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                                    bookingState.location === 'professional' 
                                    ? 'bg-gradient-to-br from-aegean-500 to-aegean-600 shadow-lg' 
                                    : 'bg-gray-100 group-hover:bg-aegean-200'
                                }">
                                    <i class="fas fa-store text-2xl ${
                                        bookingState.location === 'professional' ? 'text-white' : 'text-gray-500 group-hover:text-aegean-600'
                                    }"></i>
                                </div>
                                <div class="flex-1">
                                    <div class="flex items-center gap-2 mb-2">
                                        <span class="text-2xl">🏪</span>
                                        <h4 class="font-bold text-lg ${
                                            bookingState.location === 'professional' ? 'text-aegean-700' : 'text-gray-900 group-hover:text-aegean-700'
                                        }">En el local</h4>
                                    </div>
                                    <p class="text-sm text-gray-600 mb-2">Visita el establecimiento del profesional</p>
                                    <div class="flex items-start gap-1 text-sm ${bookingState.location === 'professional' ? 'text-aegean-600 font-medium' : 'text-gray-500'}">
                                        <i class="fas fa-map-marker-alt mt-0.5 flex-shrink-0"></i>
                                        <span class="line-clamp-2">${professional.serviceLocation?.salonAddress?.street || 'Dirección del profesional'}</span>
                                    </div>
                                </div>
                                ${bookingState.location === 'professional' ? '<i class="fas fa-check-circle text-emerald-500 text-2xl absolute top-4 right-4 bg-white rounded-full"></i>' : ''}
                            </div>
                        </button>
                    ` : ''}
                    ${service.serviceConfig?.location === 'home' || service.serviceConfig?.location === 'both' ? `
                        <button onclick="selectLocation('client')" 
                                class="group relative p-6 border-2 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                                    bookingState.location === 'client' 
                                    ? 'border-olive-gold-500 bg-gradient-to-br from-olive-gold-50 to-olive-gold-100 shadow-xl scale-105' 
                                    : 'border-gray-200 hover:border-olive-gold-300 hover:bg-olive-gold-50 shadow-md hover:shadow-lg'
                                }">
                            <div class="flex items-start gap-4">
                                <div class="w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                                    bookingState.location === 'client' 
                                    ? 'bg-gradient-to-br from-olive-gold-500 to-olive-gold-600 shadow-lg' 
                                    : 'bg-gray-100 group-hover:bg-olive-gold-200'
                                }">
                                    <i class="fas fa-home text-2xl ${
                                        bookingState.location === 'client' ? 'text-white' : 'text-gray-500 group-hover:text-olive-gold-600'
                                    }"></i>
                                </div>
                                <div class="flex-1">
                                    <div class="flex items-center gap-2 mb-2">
                                        <span class="text-2xl">🏡</span>
                                        <h4 class="font-bold text-lg ${
                                            bookingState.location === 'client' ? 'text-olive-gold-700' : 'text-gray-900 group-hover:text-olive-gold-700'
                                        }">A domicilio</h4>
                                    </div>
                                    <p class="text-sm text-gray-600 mb-2">El profesional va a tu dirección</p>
                                    <div class="flex items-start gap-1 text-sm ${bookingState.location === 'client' ? 'text-olive-gold-600 font-medium' : 'text-gray-500'}">
                                        <i class="fas fa-route mt-0.5 flex-shrink-0"></i>
                                        <span>Servicio a domicilio en tu ubicación</span>
                                    </div>
                                </div>
                                ${bookingState.location === 'client' ? '<i class="fas fa-check-circle text-emerald-500 text-2xl absolute top-4 right-4 bg-white rounded-full"></i>' : ''}
                            </div>
                        </button>
                    ` : ''}
                </div>
                
                <!-- Campo de dirección del cliente con MAPA (solo si selecciona A domicilio) -->
                ${bookingState.location === 'client' ? `
                    <div class="mt-6 space-y-5 animate-fadeIn">
                        <!-- Mapa interactivo mejorado -->
                        <div class="p-5 bg-gradient-to-br from-olive-gold-50 to-amber-50 border-2 border-olive-gold-200 rounded-xl shadow-lg">
                            <label class="flex items-center gap-2 font-bold text-gray-900 mb-4 text-lg">
                                <div class="w-8 h-8 bg-gradient-to-br from-olive-gold-500 to-olive-gold-600 rounded-lg flex items-center justify-center shadow-md">
                                    <i class="fas fa-map-marked-alt text-white text-sm"></i>
                                </div>
                                <span>Selecciona tu ubicación en el mapa</span>
                            </label>
                            
                            <!-- Contenedor del mapa -->
                            <div id="location-map" class="w-full rounded-xl border-2 border-olive-gold-300 mb-4 overflow-hidden shadow-xl" style="z-index: 1; height: 400px !important; width: 100% !important; display: block !important; position: relative !important;"></div>
                            
                            <div class="flex items-start gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-olive-gold-200">
                                <i class="fas fa-info-circle text-olive-gold-600 text-lg mt-0.5 flex-shrink-0"></i>
                                <div class="text-sm text-gray-700">
                                    <p class="font-semibold mb-1">¿Cómo usar el mapa?</p>
                                    <ul class="list-disc list-inside space-y-1 text-gray-600">
                                        <li>El mapa detectará tu ubicación automáticamente</li>
                                        <li>Haz clic en el mapa para cambiar la ubicación</li>
                                        <li>Arrastra el marcador para ajustar la posición exacta</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Campo de dirección (se autocompleta desde el mapa) -->
                        <div class="p-5 bg-white border-2 border-gray-200 rounded-xl shadow-md">
                            <label class="flex items-center gap-2 font-bold text-gray-900 mb-3 text-lg">
                                <div class="w-8 h-8 bg-gradient-to-br from-aegean-500 to-aegean-600 rounded-lg flex items-center justify-center shadow-md">
                                    <i class="fas fa-map-marker-alt text-white text-sm"></i>
                                </div>
                                <span>Dirección seleccionada</span>
                            </label>
                            <input 
                                type="text" 
                                id="client-address"
                                value="${bookingState.clientAddress || ''}"
                                oninput="updateClientAddress(this.value)"
                                class="w-full border-2 border-aegean-300 rounded-lg p-4 text-base focus:outline-none focus:ring-2 focus:ring-aegean-500 focus:border-transparent transition-all shadow-sm"
                                placeholder="Selecciona en el mapa o escribe tu dirección..."
                                required
                            />
                            <div class="mt-3 flex items-start gap-2 coords-info">
                                ${bookingState.clientCoordinates ? `
                                    <div class="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
                                        <i class="fas fa-check-circle"></i>
                                        <span class="font-medium">Ubicación confirmada</span>
                                    </div>
                                    <div class="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                        <i class="fas fa-crosshairs"></i>
                                        <span>Lat: ${bookingState.clientCoordinates.lat.toFixed(6)}, Lng: ${bookingState.clientCoordinates.lng.toFixed(6)}</span>
                                    </div>
                                ` : `
                                    <div class="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                                        <i class="fas fa-exclamation-circle"></i>
                                        <span class="font-medium">Por favor, selecciona tu ubicación en el mapa</span>
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
            
            <!-- Notas adicionales mejorado -->
            <div class="mb-8">
                <label class="flex items-center gap-2 font-bold text-gray-900 mb-3 text-lg">
                    <div class="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center shadow-md">
                        <i class="fas fa-comment-dots text-white text-sm"></i>
                    </div>
                    <span>Notas adicionales</span>
                    <span class="text-sm font-normal text-gray-500 ml-1">(opcional)</span>
                </label>
                <textarea id="booking-notes" 
                          onchange="updateNotes(this.value)"
                          class="w-full border-2 border-gray-200 rounded-xl p-4 text-base focus:outline-none focus:ring-2 focus:ring-aegean-500 focus:border-transparent transition-all shadow-sm resize-none"
                          rows="4"
                          placeholder="Escribe aquí si tienes alguna preferencia especial, alergias, o algún detalle que el profesional deba conocer...">${bookingState.notes}</textarea>
                <p class="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <i class="fas fa-lightbulb text-olive-gold-500"></i>
                    <span>Ejemplo: "Prefiero productos sin parabenos" o "Tengo el cabello sensible"</span>
                </p>
            </div>
            
            <!-- Botón continuar mejorado -->
            <div class="sticky bottom-0 -mx-6 md:-mx-8 px-6 md:px-8 py-4 bg-white border-t-2 border-gray-100 shadow-2xl mt-8">
                ${!bookingState.date || !bookingState.time || !bookingState.location ? `
                    <div class="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                        <i class="fas fa-exclamation-circle text-amber-600 mt-0.5"></i>
                        <div class="text-sm text-amber-700">
                            <p class="font-semibold mb-1">Completa los siguientes datos:</p>
                            <ul class="list-disc list-inside space-y-0.5 text-amber-600">
                                ${!bookingState.date ? '<li>Selecciona una fecha</li>' : ''}
                                ${!bookingState.time ? '<li>Selecciona una hora</li>' : ''}
                                ${!bookingState.location ? '<li>Elige la ubicación del servicio</li>' : ''}
                            </ul>
                        </div>
                    </div>
                ` : ''}
                
                <button onclick="goToStep(3)" 
                        ${!bookingState.date || !bookingState.time || !bookingState.location ? 'disabled' : ''}
                        class="w-full inline-flex items-center justify-center gap-3 text-lg font-bold py-4 rounded-xl transition-all duration-300 transform shadow-lg ${
                            !bookingState.date || !bookingState.time || !bookingState.location 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-aegean-600 to-olive-gold-600 hover:from-aegean-700 hover:to-olive-gold-700 text-white hover:shadow-2xl hover:scale-105 active:scale-100'
                        }"
                        style="${!bookingState.date || !bookingState.time || !bookingState.location ? '' : 'background: linear-gradient(to right, rgb(27, 75, 122), rgb(184, 134, 11)) !important; color: white !important; border: none !important;'}"
                        id="continue-button">
                    <span>Continuar a confirmación</span>
                    <i class="fas fa-arrow-right"></i>
                </button>
                
                ${bookingState.date && bookingState.time && bookingState.location ? `
                    <p class="text-center text-sm text-gray-500 mt-3 flex items-center justify-center gap-1">
                        <i class="fas fa-shield-alt text-emerald-500"></i>
                        <span>Tus datos están seguros • No se realizará ningún cargo aún</span>
                    </p>
                ` : ''}
            </div>
        </div>
    `;
}

// Paso 3: Confirmación
function renderStep3() {
    const service = bookingState.service;
    const professional = bookingState.allProfessionals.find(p => p._id === service.professional._id);
    const dateObj = new Date(bookingState.date);
    
    return `
        <div class="p-8">
            <button onclick="goToStep(2)" class="text-purple-600 hover:text-purple-700 mb-6">
                <i class="fas fa-arrow-left mr-2"></i>Volver
            </button>
            
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Confirmar reserva</h2>
            
            <div class="space-y-6">
                <!-- Resumen del servicio -->
                <div class="border rounded-lg p-6">
                    <h3 class="font-semibold text-lg mb-4">Resumen de tu reserva</h3>
                    
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Servicio:</span>
                            <span class="font-semibold">${service.name}</span>
                        </div>
                        
                        <div class="flex justify-between">
                            <span class="text-gray-600">Profesional:</span>
                            <span class="font-semibold">${professional.businessName}</span>
                        </div>
                        
                        <div class="flex justify-between">
                            <span class="text-gray-600">Fecha:</span>
                            <span class="font-semibold">${dateObj.toLocaleDateString('es-ES', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}</span>
                        </div>
                        
                        <div class="flex justify-between">
                            <span class="text-gray-600">Hora:</span>
                            <span class="font-semibold">${bookingState.time}</span>
                        </div>
                        
                        <div class="flex justify-between">
                            <span class="text-gray-600">Duración:</span>
                            <span class="font-semibold">${service.duration.estimated} minutos</span>
                        </div>
                        
                        <div class="flex justify-between">
                            <span class="text-gray-600">Ubicación:</span>
                            <span class="font-semibold">
                                ${bookingState.location === 'professional' ? '🏪 En el local' : '🏡 A domicilio'}
                            </span>
                        </div>
                        
                        ${bookingState.location === 'client' && bookingState.clientAddress ? `
                            <div class="pt-3 border-t bg-purple-50 -mx-6 px-6 py-3">
                                <p class="text-gray-600 text-sm mb-1">
                                    <i class="fas fa-map-marker-alt text-purple-600 mr-2"></i>
                                    Dirección del cliente:
                                </p>
                                <p class="font-semibold text-gray-900">${bookingState.clientAddress}</p>
                                <p class="text-xs text-gray-500 mt-1">El profesional irá a esta dirección</p>
                            </div>
                        ` : ''}
                        
                        ${bookingState.notes ? `
                            <div class="pt-3 border-t">
                                <p class="text-gray-600 text-sm mb-1">Notas:</p>
                                <p class="text-sm">${bookingState.notes}</p>
                            </div>
                        ` : ''}
                        
                        <div class="pt-3 border-t flex justify-between items-center">
                            <span class="text-lg font-semibold">Total:</span>
                            <span class="text-2xl font-bold text-purple-600">${formatPrice(service.pricing.basePrice)}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Información importante -->
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 class="font-semibold text-blue-900 mb-2">
                        <i class="fas fa-info-circle mr-2"></i>Información importante
                    </h4>
                    <ul class="text-sm text-blue-800 space-y-1">
                        <li>• Recibirás una confirmación por email</li>
                        <li>• El profesional confirmará tu reserva en menos de 24 horas</li>
                        <li>• Puedes cancelar hasta 24 horas antes sin cargo</li>
                    </ul>
                </div>
                
                <button onclick="confirmBooking()" 
                        class="w-full bg-purple-600 text-white py-4 rounded-lg hover:bg-purple-700 transition-colors text-lg font-semibold">
                    <i class="fas fa-check mr-2"></i>Confirmar reserva
                </button>
            </div>
        </div>
    `;
}

// Funciones globales para manejar el flujo
window.selectService = function(serviceId) {
    const service = bookingState.allServices.find(s => s._id === serviceId);
    
    // Validar que un profesional no pueda reservar su propio servicio
    const currentUser = authService.getCurrentUser();
    const serviceProfessionalId = service?.professional?._id || service?.professional;
    
    if (currentUser && currentUser.role === 'professional' && currentUser.professionalId === serviceProfessionalId) {
        toast.error('No puedes reservar tu propio servicio');
        return;
    }
    
    bookingState.service = service;
    bookingState.step = 2;
    document.getElementById('booking-content').innerHTML = renderBookingStep();
};

window.selectDate = function(date) {
    bookingState.date = date;
    document.getElementById('booking-content').innerHTML = renderBookingStep();
};

window.selectTime = function(time) {
    bookingState.time = time;
    document.getElementById('booking-content').innerHTML = renderBookingStep();
};

window.selectLocation = function(location) {
    // Limpiar instancia del mapa anterior si existe
    if (locationMapInstance) {
        console.log('🗑️ Eliminando instancia previa del mapa');
        locationMapInstance.remove();
        locationMapInstance = null;
    }
    
    bookingState.location = location;
    document.getElementById('booking-content').innerHTML = renderBookingStep();
    
    // Inicializar mapa si se seleccionó "A domicilio"
    if (location === 'client') {
        console.log('🗺️ Ubicación "A domicilio" seleccionada, inicializando mapa...');
        
        // Esperar a que el DOM esté completamente renderizado
        setTimeout(() => {
            const container = document.getElementById('location-map');
            console.log('📦 Contenedor del mapa encontrado:', container);
            
            if (container) {
                console.log('📏 Dimensiones del contenedor:', container.offsetWidth, 'x', container.offsetHeight);
                initializeLocationMap();
            } else {
                console.error('❌ Contenedor location-map no encontrado en el DOM');
            }
            
            // Verificar estado del botón después de inicializar el mapa
            setTimeout(() => {
                updateContinueButton();
            }, 200);
        }, 150);
    } else {
        // Si no es "A domicilio", actualizar botón inmediatamente
        setTimeout(() => {
            updateContinueButton();
        }, 50);
    }
};

window.updateNotes = function(notes) {
    bookingState.notes = notes;
};

window.updateClientAddress = function(address) {
    bookingState.clientAddress = address;
    // Actualizar estado del botón al escribir la dirección
    updateContinueButton();
};

// Función para actualizar el estado del botón "Continuar a confirmación"
function updateContinueButton() {
    const continueBtn = document.getElementById('continue-button');
    if (continueBtn) {
        const hasDate = bookingState.date;
        const hasTime = bookingState.time;
        const hasLocation = bookingState.location;
        const hasAddress = bookingState.location !== 'client' || (bookingState.clientAddress && bookingState.clientAddress.trim() !== '');
        
        const isDisabled = !hasDate || !hasTime || !hasLocation || !hasAddress;
        
        if (isDisabled) {
            continueBtn.setAttribute('disabled', 'disabled');
            continueBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            continueBtn.removeAttribute('disabled');
            continueBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }
}

// Variable global para mantener instancia del mapa
let locationMapInstance = null;

// Inicializar mapa de ubicación
function initializeLocationMap() {
    // Si ya existe un mapa, no crear otro
    if (locationMapInstance) {
        console.log('⚠️ Ya existe una instancia del mapa');
        return locationMapInstance;
    }
    
    // Verificar que el contenedor existe
    const mapContainer = document.getElementById('location-map');
    if (!mapContainer) {
        console.error('❌ Contenedor del mapa no encontrado');
        return null;
    }
    
    console.log('✅ Contenedor encontrado, inicializando mapa...');
    console.log('📐 Dimensiones:', mapContainer.offsetWidth, 'x', mapContainer.offsetHeight);
    
    // Fix para iconos de Leaflet
    try {
        fixLeafletIcons();
        console.log('✅ Iconos de Leaflet configurados');
    } catch (error) {
        console.error('❌ Error configurando iconos:', error);
    }
    
    // Inicializar mapa con callback
    try {
        locationMapInstance = initMap('location-map', (locationData) => {
            // Actualizar estado con coordenadas y dirección
            bookingState.clientAddress = locationData.address;
            bookingState.clientCoordinates = {
                lat: locationData.lat,
                lng: locationData.lng
            };
            
            // Actualizar input de dirección sin re-renderizar todo
            const addressInput = document.getElementById('client-address');
            if (addressInput) {
                addressInput.value = locationData.address;
            }
            
            // Actualizar solo el texto de coordenadas
            const coordsInfo = document.querySelector('.coords-info');
            if (coordsInfo) {
                coordsInfo.innerHTML = `
                    <i class="fas fa-check-circle text-green-600 mr-1"></i>
                    Coordenadas: ${bookingState.clientCoordinates.lat.toFixed(6)}, ${bookingState.clientCoordinates.lng.toFixed(6)}
                `;
            }
            
            // Actualizar estado del botón "Continuar a confirmación"
            updateContinueButton();
        });
        
        if (locationMapInstance) {
            console.log('✅ Mapa inicializado correctamente');
        } else {
            console.warn('⚠️ initMap retornó null');
        }
        
        return locationMapInstance;
        
    } catch (error) {
        console.error('❌ Error inicializando mapa:', error);
        return null;
    }
}

window.goToStep = function(step) {
    // Limpiar instancia del mapa si existe
    if (locationMapInstance) {
        locationMapInstance.remove();
        locationMapInstance = null;
    }
    
    bookingState.step = step;
    // Actualizar contenido del paso
    document.getElementById('booking-content').innerHTML = renderBookingStep();
    // Actualizar barra de progreso
    updateProgressBar();
    
    // Inicializar mapa si estamos en paso 2 y ubicación es client
    if (step === 2 && bookingState.location === 'client') {
        setTimeout(() => {
            initializeLocationMap();
        }, 100);
    }
};

function updateProgressBar() {
    const progressBar = document.querySelector('.flex.items-center.space-x-4');
    if (progressBar) {
        progressBar.innerHTML = [1, 2, 3].map(step => `
            <div class="flex items-center">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step <= bookingState.step ? 'bg-primary text-white' : 
                    step === bookingState.step + 1 ? 'bg-gray-200 text-gray-600' : 'bg-gray-100 text-gray-400'
                }">
                    ${step}
                </div>
                <span class="ml-2 text-sm ${
                    step <= bookingState.step ? 'text-primary font-medium' : 'text-gray-600'
                }">
                    ${step === 1 ? 'Servicio' : step === 2 ? 'Fecha y Hora' : 'Confirmación'}
                </span>
                ${step < 3 ? '<i class="fas fa-chevron-right text-gray-400 ml-4"></i>' : ''}
            </div>
        `).join('');
    }
}

window.confirmBooking = async function() {
    try {
        loading.show('Creando reserva...');
        
        // Obtener usuario actual
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
            toast.error('Debes iniciar sesión para hacer una reserva');
            loading.hide();
            window.router.navigate('/auth/login');
            return;
        }
        
        // Validar que un profesional no pueda reservar consigo mismo
        const serviceProfessionalId = bookingState.service?.professional?._id || bookingState.service?.professional;
        if (currentUser.role === 'professional' && currentUser.professionalId === serviceProfessionalId) {
            toast.error('No puedes hacer una reserva contigo mismo');
            loading.hide();
            setTimeout(() => {
                window.router.navigate('/profesionales');
            }, 2000);
            return;
        }
        
        // Crear fecha completa
        const dateTime = new Date(`${bookingState.date}T${bookingState.time}:00`);
        
        const bookingData = {
            professionalId: bookingState.service.professional._id || bookingState.service.professional,
            serviceId: bookingState.service._id,
            date: dateTime,
            time: bookingState.time,
            location: {
                type: bookingState.location === 'professional' ? 'salon' : 'home',
                address: bookingState.location === 'professional' 
                    ? bookingState.service.professional.serviceLocation?.salonAddress?.street || 'Dirección del profesional'
                    : bookingState.clientAddress || 'Dirección no proporcionada',
                coordinates: bookingState.location === 'client' && bookingState.clientCoordinates ? {
                    lat: bookingState.clientCoordinates.lat,
                    lng: bookingState.clientCoordinates.lng
                } : undefined
            },
            clientNotes: bookingState.notes || ''
        };
        
        // Debug: Ver qué estamos enviando
        console.log('📤 Datos de reserva a enviar:', bookingData);
        console.log('📤 Estado completo:', {
            date: bookingState.date,
            time: bookingState.time,
            location: bookingState.location,
            serviceId: bookingState.service._id,
            professionalId: bookingState.service.professional._id || bookingState.service.professional
        });
        
        const response = await bookingService.create(bookingData);
        
        loading.hide();
        toast.success('¡Reserva creada exitosamente!');
        
        // Limpiar instancia del mapa si existe
        if (locationMapInstance) {
            locationMapInstance.remove();
            locationMapInstance = null;
        }
        
        // Resetear estado
        bookingState = {
            step: 1,
            professional: null,
            service: null,
            date: null,
            time: null,
            notes: '',
            location: 'professional',
            clientAddress: '',
            clientCoordinates: null,
            allProfessionals: [],
            allServices: []
        };
        
        // Redirigir a la página de cuenta
        setTimeout(() => {
            window.router.navigate('/cuenta');
        }, 1500);
        
    } catch (error) {
        loading.hide();
        toast.error(error.message || 'Error al crear la reserva');
        console.error(error);
    }
};
