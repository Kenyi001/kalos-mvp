import { authService, bookingService, loading, toast, formatDate, formatTime, formatPrice, formatStatus, getStatusClass } from '../services/apiService.js';

let userBookings = [];
let currentFilter = 'all';

async function loadUserBookings() {
    try {
        loading.show('Cargando tus reservas...');
        const response = await bookingService.getAll();
        
        // Extraer el array de reservas de la respuesta
        const bookingsData = response.data || response;
        userBookings = Array.isArray(bookingsData) ? bookingsData : [];
        
        console.log('📅 Reservas cargadas:', userBookings.length);
        loading.hide();
        return true;
    } catch (error) {
        loading.hide();
        toast.error('Error al cargar las reservas');
        console.error('❌ Error cargando reservas:', error);
        userBookings = []; // Asegurar que sea un array vacío en caso de error
        return false;
    }
}

export async function renderAccountPage() {
    // Verificar autenticación
    if (!authService.isAuthenticated()) {
        return `
            <div class="min-h-screen flex items-center justify-center bg-gray-50">
                <div class="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
                    <i class="fas fa-lock text-4xl text-purple-600 mb-4"></i>
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">Inicia sesión para continuar</h2>
                    <p class="text-gray-600 mb-6">Accede a tu cuenta para ver esta página</p>
                    <button onclick="router.navigate('/auth/login')" 
                            class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                        Iniciar sesión
                    </button>
                </div>
            </div>
        `;
    }

    // Cargar reservas del usuario
    await loadUserBookings();
    
    // Asegurar que userBookings siempre sea un array
    if (!Array.isArray(userBookings)) {
        console.warn('⚠️ userBookings no es un array, inicializando como array vacío');
        userBookings = [];
    }
    
    const user = authService.getCurrentUser();

    return `
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Header -->
                <div class="mb-8">
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">Mi cuenta</h1>
                    <p class="text-gray-600">Gestiona tu perfil y revisa tus citas</p>
                </div>

                <div class="grid lg:grid-cols-1 gap-8">
                    <!-- Información personal -->
                    <div class="space-y-8">
                        <!-- Perfil -->
                        <div class="bg-white rounded-lg shadow-sm">
                            <div class="p-6 border-b border-gray-200">
                                <h2 class="text-xl font-bold text-gray-900">Información personal</h2>
                            </div>
                            <div class="p-6">
                                <div class="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">
                                            Nombre completo
                                        </label>
                                        <input type="text" value="${user.name}" readonly
                                               class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input type="email" value="${user.email}" readonly
                                               class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">
                                            Rol
                                        </label>
                                        <input type="text" value="${user.role === 'client' ? 'Cliente' : 'Profesional'}" readonly
                                               class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">
                                            Miembro desde
                                        </label>
                                        <input type="text" value="${formatDate(user.createdAt)}" readonly
                                               class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
                                    </div>
                                </div>
                                <div class="mt-6">
                                    <button onclick="handleLogout()" 
                                            class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
                                        Cerrar sesión
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Mis citas -->
                        <div class="bg-white rounded-lg shadow-sm">
                            <div class="p-6 border-b border-gray-200">
                                <div class="flex items-center justify-between">
                                    <h2 class="text-xl font-bold text-gray-900">Mis citas</h2>
                                    <button onclick="router.navigate('/profesionales')" 
                                            class="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors">
                                        Nueva cita
                                    </button>
                                </div>
                            </div>
                            <div class="p-6">
                                ${userBookings.length > 0 ? `
                                    <!-- Filtros de citas -->
                                    <div class="flex space-x-2 mb-6">
                                        <button onclick="filterBookings('all')" id="filter-all"
                                                class="booking-filter px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white">
                                            Todas
                                        </button>
                                        <button onclick="filterBookings('pending')" id="filter-pending"
                                                class="booking-filter px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700">
                                            Pendientes
                                        </button>
                                        <button onclick="filterBookings('confirmed')" id="filter-confirmed"
                                                class="booking-filter px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700">
                                            Confirmadas
                                        </button>
                                        <button onclick="filterBookings('completed')" id="filter-completed"
                                                class="booking-filter px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700">
                                            Completadas
                                        </button>
                                    </div>
                                    
                                    <!-- Lista de citas -->
                                    <div id="bookings-list" class="space-y-4">
                                        ${renderBookingsList(userBookings, currentFilter)}
                                    </div>
                                ` : `
                                    <div class="text-center py-12">
                                        <i class="fas fa-calendar-times text-4xl text-gray-300 mb-4"></i>
                                        <p class="text-gray-600 mb-4">Aún no tienes citas reservadas</p>
                                        <button onclick="router.navigate('/profesionales')" 
                                                class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                                            Reservar ahora
                                        </button>
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>

                        <!-- Panel de profesional -->
                        ${user.role === 'professional' ? `
                            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
                                <!-- Header -->
                                <div class="bg-white p-5 text-gray-900">
                                    <div class="flex items-center">
                                        <div class="w-12 h-12 bg-olive-gold-400 rounded-lg flex items-center justify-center mr-3">
                                            <i class="fas fa-user-tie text-white text-xl"></i>
                                        </div>
                                        <div>
                                            <h3 class="text-lg font-bold">Área Profesional</h3>
                                            <p class="text-sm text-aegean-100">Gestiona tu negocio</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Botones de acción -->
                                <div class="p-5">
                                    <div class="grid grid-cols-2 gap-3">
                                        <button onclick="router.navigate('/dashboard')" 
                                                class="group bg-gray-50 hover:bg-aegean-50 border border-gray-300 hover:border-aegean-400 text-gray-700 hover:text-aegean-700 p-4 rounded-lg transition-all flex flex-col items-center text-center">
                                            <div class="w-12 h-12 bg-aegean-100 group-hover:bg-aegean-200 rounded-full flex items-center justify-center mb-2 transition-colors">
                                                <i class="fas fa-tachometer-alt text-aegean-600 text-lg"></i>
                                            </div>
                                            <div class="font-semibold text-sm">Dashboard</div>
                                        </button>
                                        
                                        <button onclick="router.navigate('/pro/profile/create')" 
                                                class="group bg-gray-50 hover:bg-aegean-50 border border-gray-300 hover:border-aegean-400 text-gray-700 hover:text-aegean-700 p-4 rounded-lg transition-all flex flex-col items-center text-center">
                                            <div class="w-12 h-12 bg-aegean-100 group-hover:bg-aegean-200 rounded-full flex items-center justify-center mb-2 transition-colors">
                                                <i class="fas fa-edit text-aegean-600 text-lg"></i>
                                            </div>
                                            <div class="font-semibold text-sm">Editar Perfil</div>
                                        </button>
                                        
                                        <button onclick="router.navigate('/pro/services')" 
                                                class="group bg-gray-50 hover:bg-aegean-50 border border-gray-300 hover:border-aegean-400 text-gray-700 hover:text-aegean-700 p-4 rounded-lg transition-all flex flex-col items-center text-center">
                                            <div class="w-12 h-12 bg-aegean-100 group-hover:bg-aegean-200 rounded-full flex items-center justify-center mb-2 transition-colors">
                                                <i class="fas fa-briefcase text-aegean-600 text-lg"></i>
                                            </div>
                                            <div class="font-semibold text-sm">Mis Servicios</div>
                                        </button>
                                        
                                        <button onclick="router.navigate('/pro/services/new')" 
                                                class="group bg-gradient-to-br from-olive-gold-500 to-olive-gold-600 hover:from-olive-gold-600 hover:to-olive-gold-700 text-white p-4 rounded-lg transition-all flex flex-col items-center text-center shadow-md hover:shadow-lg">
                                            <div class="w-12 h-12 bg-aegean-600 rounded-full flex items-center justify-center mb-2">
                                                <i class="fas fa-plus-circle text-white text-xl"></i>
                                            </div>
                                            <div class="font-bold text-sm">Nuevo Servicio</div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                        
                        <!-- Estadísticas -->
                        <div class="grid md:grid-cols-3 gap-6">
                            <div class="bg-white rounded-lg shadow-sm p-6 text-center">
                                <p class="text-sm text-gray-600 mb-2">Total de citas</p>
                                <p class="text-3xl font-bold text-aegean-600">${userBookings.length}</p>
                            </div>
                            <div class="bg-white rounded-lg shadow-sm p-6 text-center">
                                <p class="text-sm text-gray-600 mb-2">Completadas</p>
                                <p class="text-3xl font-bold text-emerald-600">${userBookings.filter(b => b.status === 'completed').length}</p>
                            </div>
                            <div class="bg-white rounded-lg shadow-sm p-6 text-center">
                                <p class="text-sm text-gray-600 mb-2">Pendientes</p>
                                <p class="text-3xl font-bold text-yellow-600">${userBookings.filter(b => b.status === 'pending').length}</p>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    `;
}

function renderBookingsList(bookings, filter) {
    let filtered = bookings;
    
    if (filter !== 'all') {
        filtered = bookings.filter(b => b.status === filter);
    }
    
    if (filtered.length === 0) {
        return `<p class="text-center text-gray-600 py-8">No hay citas con este filtro</p>`;
    }
    
    return filtered.map(booking => `
        <div class="border-2 rounded-lg p-5 hover:border-purple-300 hover:shadow-md transition-all">
            <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                    <h3 class="font-bold text-lg mb-1 text-gray-900">${booking.service?.name || 'Servicio no disponible'}</h3>
                    <p class="text-sm text-gray-600 flex items-center">
                        <i class="fas fa-user-tie mr-1.5 text-purple-600"></i>
                        ${booking.service?.professional?.businessName || 'Profesional no disponible'}
                    </p>
                </div>
                <span class="px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusClass(booking.status)}">
                    ${formatStatus(booking.status)}
                </span>
            </div>
            
            <div class="grid grid-cols-2 gap-3 text-sm mb-4 bg-gray-50 p-3 rounded-lg">
                <div class="flex items-start text-gray-700">
                    <i class="fas fa-calendar text-purple-600 mr-2 mt-0.5"></i>
                    <div>
                        <p class="text-xs text-gray-500">Fecha</p>
                        <p class="font-medium">${booking.date ? formatDate(booking.date) : 'N/A'}</p>
                    </div>
                </div>
                <div class="flex items-start text-gray-700">
                    <i class="fas fa-clock text-purple-600 mr-2 mt-0.5"></i>
                    <div>
                        <p class="text-xs text-gray-500">Hora</p>
                        <p class="font-medium">${booking.time || 'N/A'}</p>
                    </div>
                </div>
                <div class="flex items-start text-gray-700">
                    <i class="fas fa-map-marker-alt text-purple-600 mr-2 mt-0.5"></i>
                    <div>
                        <p class="text-xs text-gray-500">Ubicación</p>
                        <p class="font-medium">${booking.location?.type === 'professional' || booking.location?.type === 'salon' ? '🏪 En el local' : '🏡 A domicilio'}</p>
                    </div>
                </div>
                <div class="flex items-start text-gray-700">
                    <i class="fas fa-euro-sign text-purple-600 mr-2 mt-0.5"></i>
                    <div>
                        <p class="text-xs text-gray-500">Precio</p>
                        <p class="font-bold text-lg text-purple-600">${booking.pricing?.finalPrice ? formatPrice(booking.pricing.finalPrice) : 'N/A'}</p>
                    </div>
                </div>
            </div>
            
            <div class="flex gap-2">
                <button onclick="viewBookingDetails('${booking._id}')" 
                        class="flex-1 bg-purple-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center">
                    <i class="fas fa-eye mr-2"></i>
                    Ver detalles
                </button>
                ${booking.status === 'pending' || booking.status === 'confirmed' ? `
                    <button onclick="cancelBooking('${booking._id}')" 
                            class="bg-red-100 text-red-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors flex items-center justify-center">
                        <i class="fas fa-times mr-2"></i>
                        Cancelar
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Funciones globales
window.handleLogout = function() {
    authService.logout();
    window.router.navigate('/auth/login');
};

window.filterBookings = function(filter) {
    currentFilter = filter;
    
    // Actualizar botones
    document.querySelectorAll('.booking-filter').forEach(btn => {
        btn.classList.remove('bg-primary', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });
    
    const activeBtn = document.getElementById(`filter-${filter}`);
    if (activeBtn) {
        activeBtn.classList.remove('bg-gray-200', 'text-gray-700');
        activeBtn.classList.add('bg-primary', 'text-white');
    }
    
    // Actualizar lista
    const listContainer = document.getElementById('bookings-list');
    if (listContainer) {
        listContainer.innerHTML = renderBookingsList(userBookings, filter);
    }
};

window.viewBookingDetails = function(bookingId) {
    window.router.navigate(`/reserva/${bookingId}`);
};

window.cancelBooking = async function(bookingId) {
    if (!confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
        return;
    }
    
    try {
        loading.show('Cancelando cita...');
        await bookingService.cancel(bookingId);
        
        // Recargar reservas
        await loadUserBookings();
        
        // Actualizar vista
        const listContainer = document.getElementById('bookings-list');
        if (listContainer) {
            listContainer.innerHTML = renderBookingsList(userBookings, currentFilter);
        }
        
        loading.hide();
        toast.success('Cita cancelada exitosamente');
    } catch (error) {
        loading.hide();
        toast.error(error.message || 'Error al cancelar la cita');
    }
};
