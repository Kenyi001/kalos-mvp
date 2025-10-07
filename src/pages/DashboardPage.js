import { authService, bookingService, serviceService, loading, toast, formatDate, formatTime, formatPrice, formatStatus, getStatusClass } from '../services/apiService.js';

let myBookings = [];
let myServices = [];

async function loadDashboardData() {
    try {
        loading.show('Cargando dashboard...');
        
        // Cargar reservas y servicios del profesional
        const [bookingsResponse, servicesResponse] = await Promise.all([
            bookingService.getAll(),
            serviceService.getAll()
        ]);
        
        // Extraer los datos de las respuestas
        const allBookings = bookingsResponse.data || bookingsResponse;
        const allServices = servicesResponse.data || servicesResponse;
        
        // Asegurar que sean arrays
        myBookings = Array.isArray(allBookings) ? allBookings : [];
        
        // Filtrar solo mis servicios (como profesional)
        const user = authService.getCurrentUser();
        if (Array.isArray(allServices)) {
            myServices = allServices.filter(s => 
                s.professional?._id === user.professionalId || 
                s.professional?.user === user._id ||
                s.professional === user._id
            );
        } else {
            myServices = [];
        }
        
        loading.hide();
        return true;
    } catch (error) {
        loading.hide();
        toast.error('Error al cargar datos del dashboard');
        console.error(error);
        return false;
    }
}

export async function renderDashboardPage() {
    // Debug: Verificar estado de autenticación
    const isAuth = authService.isAuthenticated();
    const user = authService.getCurrentUser();
    const isPro = authService.isProfessional();
    
    console.log('Dashboard Debug:', {
        isAuthenticated: isAuth,
        user: user,
        isProfessional: isPro,
        userRole: user?.role
    });

    // Verificar que sea un profesional
    if (!isAuth || !isPro) {
        return `
            <div class="min-h-screen flex items-center justify-center bg-marble">
                <div class="text-center card-primary max-w-md">
                    <i class="fas fa-exclamation-triangle text-4xl text-terracotta mb-4"></i>
                    <h2 class="text-2xl font-serif font-bold text-aegean mb-4">Acceso restringido</h2>
                    <p class="text-gray-600 font-sans mb-6">Esta área es solo para profesionales</p>
                    <div class="text-xs text-gray-500 mb-4">
                        Debug: Auth=${isAuth}, Role=${user?.role}, IsPro=${isPro}
                    </div>
                    <button onclick="router.navigate('/')" 
                            class="btn-primary">
                        Volver al inicio
                    </button>
                </div>
            </div>
        `;
    }

    // Cargar datos del dashboard
    await loadDashboardData();
    
    const stats = calculateStats();

    return `
        <div class="bg-gray-50 min-h-screen">
            <!-- Header -->
            <div class="bg-white border-b border-gray-200">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h1 class="text-3xl font-bold text-gray-900">Dashboard Profesional</h1>
                            <p class="text-gray-600">Bienvenido de vuelta, ${user.name}</p>
                        </div>
                        <div class="flex space-x-3">
                            <button onclick="router.navigate('/pro/services')" 
                                    class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                                <i class="fas fa-briefcase mr-2"></i>
                                Mis servicios
                            </button>
                            <button onclick="router.navigate('/pro/profile/create')" 
                                    class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                                <i class="fas fa-edit mr-2"></i>
                                Editar perfil
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white rounded-lg shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <i class="fas fa-calendar-check text-blue-600 text-xl"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Reservas hoy</p>
                                <p class="text-2xl font-bold text-gray-900">${stats.todayBookings}</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <i class="fas fa-clock text-yellow-600 text-xl"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Pendientes</p>
                                <p class="text-2xl font-bold text-gray-900">${stats.pendingBookings}</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <i class="fas fa-check-circle text-green-600 text-xl"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Confirmadas</p>
                                <p class="text-2xl font-bold text-gray-900">${stats.confirmedBookings}</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <i class="fas fa-concierge-bell text-purple-600 text-xl"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Mis servicios</p>
                                <p class="text-2xl font-bold text-gray-900">${stats.totalServices}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid lg:grid-cols-3 gap-8">
                    <!-- Reservas pendientes -->
                    <div class="lg:col-span-2">
                        <div class="bg-white rounded-lg shadow-sm">
                            <div class="p-6 border-b border-gray-200">
                                <h2 class="text-xl font-bold text-gray-900">Reservas</h2>
                            </div>
                            <div class="p-6">
                                <div class="space-y-4" id="bookings-container">
                                    ${renderBookingsList()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Acciones rápidas -->
                    <div class="space-y-6">
                        <div class="bg-white rounded-lg shadow-sm p-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Acciones rápidas</h3>
                            <div class="space-y-3">
                                <button onclick="router.navigate('/pro/services/new')" 
                                        class="w-full bg-purple-50 text-purple-700 px-4 py-3 rounded-lg hover:bg-purple-100 transition-colors text-left">
                                    <i class="fas fa-plus-circle mr-2"></i>
                                    Añadir servicio
                                </button>
                                <button onclick="refreshDashboard()" 
                                        class="w-full bg-blue-50 text-blue-700 px-4 py-3 rounded-lg hover:bg-blue-100 transition-colors text-left">
                                    <i class="fas fa-sync mr-2"></i>
                                    Actualizar datos
                                </button>
                                <button onclick="router.navigate('/cuenta')" 
                                        class="w-full bg-gray-50 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-left">
                                    <i class="fas fa-user mr-2"></i>
                                    Mi cuenta
                                </button>
                            </div>
                        </div>

                        <div class="bg-white rounded-lg shadow-sm p-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Mis servicios</h3>
                            ${myServices.length > 0 ? `
                                <div class="space-y-3">
                                    ${myServices.slice(0, 3).map(service => `
                                        <div class="border-l-4 border-purple-500 pl-3 py-2">
                                            <p class="font-semibold text-sm">${service.name}</p>
                                            <p class="text-xs text-gray-600">${formatPrice(service.pricing.basePrice)} • ${service.duration.estimated} min</p>
                                        </div>
                                    `).join('')}
                                    ${myServices.length > 3 ? `
                                        <button onclick="router.navigate('/pro/services')" 
                                                class="text-sm text-purple-600 hover:text-purple-700">
                                            Ver todos (${myServices.length})
                                        </button>
                                    ` : ''}
                                </div>
                            ` : `
                                <p class="text-gray-600 text-sm mb-3">Aún no has creado servicios</p>
                                <button onclick="router.navigate('/pro/services/new')" 
                                        class="w-full btn-primary text-sm">
                                    Crear primer servicio
                                </button>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function calculateStats() {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // Asegurar que myBookings y myServices sean arrays
    const bookingsArray = Array.isArray(myBookings) ? myBookings : [];
    const servicesArray = Array.isArray(myServices) ? myServices : [];
    
    return {
        todayBookings: bookingsArray.filter(b => {
            if (!b.date) return false;
            const bookingDate = new Date(b.date).toISOString().split('T')[0];
            return bookingDate === today;
        }).length,
        pendingBookings: bookingsArray.filter(b => b.status === 'pending').length,
        confirmedBookings: bookingsArray.filter(b => b.status === 'confirmed').length,
        totalServices: servicesArray.length
    };
}

function renderBookingsList() {
    if (myBookings.length === 0) {
        return `
            <div class="text-center py-12">
                <i class="fas fa-calendar-times text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-600">No tienes reservas aún</p>
            </div>
        `;
    }
    
    // Ordenar por fecha (más cercanas primero)
    const sortedBookings = [...myBookings].sort((a, b) => {
        const dateA = a.date ? new Date(a.date) : new Date(0);
        const dateB = b.date ? new Date(b.date) : new Date(0);
        return dateA - dateB;
    });
    
    return sortedBookings.slice(0, 10).map(booking => `
        <div class="border rounded-lg p-4 hover:border-purple-300 transition-colors">
            <div class="flex justify-between items-start mb-3">
                <div>
                    <h3 class="font-semibold">${booking.service.name}</h3>
                    <p class="text-sm text-gray-600">Cliente: ${booking.client.name}</p>
                </div>
                <span class="px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(booking.status)}">
                    ${formatStatus(booking.status)}
                </span>
            </div>
            
            <div class="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                <div><i class="fas fa-calendar mr-2"></i>${booking.date ? formatDate(booking.date) : 'N/A'}</div>
                <div><i class="fas fa-clock mr-2"></i>${booking.time || 'N/A'}</div>
                <div><i class="fas fa-map-marker-alt mr-2"></i>${booking.location?.type === 'salon' ? 'En el local' : 'A domicilio'}</div>
                <div><i class="fas fa-euro-sign mr-2"></i>${booking.pricing?.finalPrice ? formatPrice(booking.pricing.finalPrice) : 'N/A'}</div>
            </div>
            
            <div class="flex space-x-2">
                ${booking.status === 'pending' ? `
                    <button onclick="confirmBookingAction('${booking._id}')" 
                            class="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700">
                        <i class="fas fa-check mr-1"></i>Confirmar
                    </button>
                ` : ''}
                ${booking.status === 'confirmed' ? `
                    <button onclick="completeBookingAction('${booking._id}')" 
                            class="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">
                        <i class="fas fa-check-double mr-1"></i>Completar
                    </button>
                ` : ''}
                <button onclick="viewBookingDetails('${booking._id}')" 
                        class="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200">
                    Ver detalles
                </button>
            </div>
        </div>
    `).join('');
}

// Funciones globales
window.confirmBookingAction = async function(bookingId) {
    if (!confirm('¿Confirmar esta reserva?')) return;
    
    try {
        loading.show('Confirmando...');
        await bookingService.update(bookingId, { status: 'confirmed' });
        
        // Recargar datos
        await loadDashboardData();
        
        // Actualizar vista
        document.getElementById('bookings-container').innerHTML = renderBookingsList();
        
        loading.hide();
        toast.success('Reserva confirmada');
    } catch (error) {
        loading.hide();
        toast.error(error.message || 'Error al confirmar');
    }
};

window.completeBookingAction = async function(bookingId) {
    if (!confirm('¿Marcar esta reserva como completada?')) return;
    
    try {
        loading.show('Completando...');
        await bookingService.update(bookingId, { status: 'completed' });
        
        // Recargar datos
        await loadDashboardData();
        
        // Actualizar vista
        document.getElementById('bookings-container').innerHTML = renderBookingsList();
        
        loading.hide();
        toast.success('Reserva completada');
    } catch (error) {
        loading.hide();
        toast.error(error.message || 'Error al completar');
    }
};

window.viewBookingDetails = function(bookingId) {
    const booking = myBookings.find(b => b._id === bookingId);
    if (!booking) return;
    
    toast.info('Funcionalidad de detalles en desarrollo');
};

window.refreshDashboard = async function() {
    await loadDashboardData();
    window.location.reload();
};
