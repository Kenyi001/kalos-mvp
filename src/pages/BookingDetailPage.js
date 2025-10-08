import { authService, bookingService, loading, toast, formatDate, formatTime, formatPrice, formatStatus } from '../services/apiService.js';

let currentBooking = null;

export async function renderBookingDetailPage(params) {
    const bookingId = params.id;
    
    // Verificar autenticación
    if (!authService.isAuthenticated()) {
        window.router.navigate('/auth/login');
        return '';
    }

    try {
        loading.show('Cargando detalles de la reserva...');
        
        // Obtener datos de la reserva
        const response = await bookingService.getById(bookingId);
        currentBooking = response.data || response;
        
        loading.hide();
        
        if (!currentBooking) {
            return renderNotFound();
        }
        
        return renderBookingDetail();
        
    } catch (error) {
        loading.hide();
        console.error('Error cargando reserva:', error);
        toast.error('Error al cargar los detalles de la reserva');
        return renderNotFound();
    }
}

function renderNotFound() {
    return `
        <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div class="max-w-md w-full text-center">
                <i class="fas fa-exclamation-circle text-6xl text-red-500 mb-4"></i>
                <h1 class="text-3xl font-bold text-gray-900 mb-4">Reserva no encontrada</h1>
                <p class="text-gray-600 mb-8">No pudimos encontrar la reserva que buscas.</p>
                <button onclick="router.navigate('/cuenta')" 
                        class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                    <i class="fas fa-arrow-left mr-2"></i>
                    Volver a mis reservas
                </button>
            </div>
        </div>
    `;
}

function renderBookingDetail() {
    const booking = currentBooking;
    
    return `
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Header con navegación -->
                <div class="mb-6">
                    <button onclick="router.navigate('/cuenta')" 
                            class="text-purple-600 hover:text-purple-700 font-medium mb-4 inline-flex items-center">
                        <i class="fas fa-arrow-left mr-2"></i>
                        Volver a mis reservas
                    </button>
                    <h1 class="text-3xl font-bold text-gray-900">Detalles de la reserva</h1>
                </div>

                <div class="space-y-6">
                    <!-- Estado -->
                    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div class="bg-${getStatusBgColor(booking.status)} border-l-4 border-${getStatusBorderColor(booking.status)} p-6">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm font-medium text-gray-600 mb-1">Estado de la reserva</p>
                                    <p class="text-2xl font-bold text-${getStatusTextColor(booking.status)}">${formatStatus(booking.status)}</p>
                                </div>
                                <i class="fas ${getStatusIcon(booking.status)} text-5xl text-${getStatusTextColor(booking.status)}"></i>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Grid de información principal -->
                    <div class="grid lg:grid-cols-2 gap-6">
                        <!-- Servicio -->
                        <div class="bg-white rounded-lg shadow-sm p-6">
                            <h2 class="font-bold text-xl mb-4 flex items-center text-gray-900">
                                <i class="fas fa-cut text-purple-600 mr-3"></i>
                                Servicio
                            </h2>
                            <div class="space-y-3">
                                <div class="flex justify-between py-2 border-b border-gray-100">
                                    <span class="text-gray-600">Nombre:</span>
                                    <span class="font-semibold text-gray-900">${booking.service?.name || 'N/A'}</span>
                                </div>
                                <div class="flex justify-between py-2 border-b border-gray-100">
                                    <span class="text-gray-600">Categoría:</span>
                                    <span class="font-medium text-gray-900">${booking.service?.category || 'N/A'}</span>
                                </div>
                                <div class="flex justify-between py-2 border-b border-gray-100">
                                    <span class="text-gray-600">Duración:</span>
                                    <span class="font-medium text-gray-900">${booking.duration || booking.service?.duration?.estimated || 'N/A'} min</span>
                                </div>
                                ${booking.service?.description ? `
                                    <div class="pt-3">
                                        <p class="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">${booking.service.description}</p>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                        
                        <!-- Profesional -->
                        <div class="bg-white rounded-lg shadow-sm p-6">
                            <h2 class="font-bold text-xl mb-4 flex items-center text-gray-900">
                                <i class="fas fa-user-tie text-purple-600 mr-3"></i>
                                Profesional
                            </h2>
                            <div class="space-y-3">
                                <div class="flex justify-between py-2 border-b border-gray-100">
                                    <span class="text-gray-600">Nombre:</span>
                                    <span class="font-semibold text-gray-900">${booking.service?.professional?.businessName || 'N/A'}</span>
                                </div>
                                ${booking.service?.professional?.user ? `
                                    <div class="flex justify-between py-2 border-b border-gray-100">
                                        <span class="text-gray-600">Contacto:</span>
                                        <span class="font-medium text-gray-900">${booking.service.professional.user.email || 'N/A'}</span>
                                    </div>
                                ` : ''}
                                ${booking.service?.professional?.serviceLocation?.salonAddress?.street ? `
                                    <div class="pt-3">
                                        <p class="text-sm text-gray-600 mb-1">Dirección del salón:</p>
                                        <p class="font-medium text-gray-900 bg-gray-50 p-3 rounded-lg">
                                            <i class="fas fa-map-marker-alt text-purple-600 mr-2"></i>
                                            ${booking.service.professional.serviceLocation.salonAddress.street}
                                        </p>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                        
                        <!-- Fecha y hora -->
                        <div class="bg-white rounded-lg shadow-sm p-6">
                            <h2 class="font-bold text-xl mb-4 flex items-center text-gray-900">
                                <i class="fas fa-calendar-alt text-purple-600 mr-3"></i>
                                Fecha y hora
                            </h2>
                            <div class="space-y-3">
                                <div class="flex justify-between py-2 border-b border-gray-100">
                                    <span class="text-gray-600">Fecha:</span>
                                    <span class="font-semibold text-gray-900">${booking.date ? formatDate(booking.date) : 'N/A'}</span>
                                </div>
                                <div class="flex justify-between py-2 border-b border-gray-100">
                                    <span class="text-gray-600">Hora:</span>
                                    <span class="font-semibold text-gray-900">${booking.time || 'N/A'}</span>
                                </div>
                                <div class="flex justify-between py-2">
                                    <span class="text-gray-600">Reservado el:</span>
                                    <span class="font-medium text-sm text-gray-900">${booking.createdAt ? formatDate(booking.createdAt) : 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Ubicación -->
                        <div class="bg-white rounded-lg shadow-sm p-6">
                            <h2 class="font-bold text-xl mb-4 flex items-center text-gray-900">
                                <i class="fas fa-map-marker-alt text-purple-600 mr-3"></i>
                                Ubicación
                            </h2>
                            <div class="space-y-3">
                                <div class="flex justify-between py-2 border-b border-gray-100">
                                    <span class="text-gray-600">Tipo:</span>
                                    <span class="font-semibold text-gray-900">
                                        ${booking.location?.type === 'professional' || booking.location?.type === 'salon' ? '🏪 En el local' : '🏡 A domicilio'}
                                    </span>
                                </div>
                                ${booking.location?.address ? `
                                    <div class="pt-3">
                                        <p class="text-sm text-gray-600 mb-2">Dirección:</p>
                                        <p class="font-medium text-gray-900 bg-gray-50 p-3 rounded-lg">
                                            ${booking.location.address}
                                        </p>
                                    </div>
                                ` : ''}
                                ${booking.location?.coordinates ? `
                                    <div class="pt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                        <i class="fas fa-map-pin mr-1"></i>
                                        Coordenadas: ${booking.location.coordinates.lat?.toFixed(6)}, ${booking.location.coordinates.lng?.toFixed(6)}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Precio -->
                    <div class="bg-white rounded-lg shadow-sm p-6">
                        <h2 class="font-bold text-xl mb-4 flex items-center text-gray-900">
                            <i class="fas fa-dollar-sign text-purple-600 mr-3"></i>
                            Información de precio
                        </h2>
                        <div class="space-y-3">
                            ${booking.pricing?.basePrice ? `
                                <div class="flex justify-between py-2 border-b border-gray-100">
                                    <span class="text-gray-600">Precio base:</span>
                                    <span class="font-medium text-gray-900">${formatPrice(booking.pricing.basePrice)}</span>
                                </div>
                            ` : ''}
                            <div class="flex justify-between items-center pt-3 bg-purple-50 p-4 rounded-lg">
                                <span class="font-bold text-xl text-gray-900">Total:</span>
                                <span class="font-bold text-3xl text-purple-600">${booking.pricing?.finalPrice ? formatPrice(booking.pricing.finalPrice) : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Notas -->
                    ${booking.notes?.client || booking.notes?.professional ? `
                        <div class="bg-white rounded-lg shadow-sm p-6">
                            <h2 class="font-bold text-xl mb-4 flex items-center text-gray-900">
                                <i class="fas fa-sticky-note text-purple-600 mr-3"></i>
                                Notas adicionales
                            </h2>
                            <div class="space-y-4">
                                ${booking.notes.client ? `
                                    <div>
                                        <p class="text-sm font-semibold text-gray-600 mb-2">
                                            <i class="fas fa-user mr-1"></i>
                                            Tus notas:
                                        </p>
                                        <p class="text-sm bg-gray-50 p-4 rounded-lg text-gray-900">${booking.notes.client}</p>
                                    </div>
                                ` : ''}
                                ${booking.notes.professional ? `
                                    <div>
                                        <p class="text-sm font-semibold text-gray-600 mb-2">
                                            <i class="fas fa-user-tie mr-1"></i>
                                            Notas del profesional:
                                        </p>
                                        <p class="text-sm bg-purple-50 p-4 rounded-lg text-gray-900">${booking.notes.professional}</p>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    ` : ''}
                    
                    <!-- ID de reserva -->
                    <div class="text-center text-xs text-gray-400 py-4">
                        ID de reserva: <span class="font-mono">${booking._id}</span>
                    </div>
                    
                    <!-- Acciones -->
                    <div class="bg-white rounded-lg shadow-sm p-6">
                        <div class="flex gap-4">
                            ${booking.status === 'pending' || booking.status === 'confirmed' ? `
                                <button onclick="cancelCurrentBooking()" 
                                        class="flex-1 bg-red-600 text-white px-6 py-4 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg">
                                    <i class="fas fa-times-circle mr-2"></i>
                                    Cancelar reserva
                                </button>
                            ` : ''}
                            <button onclick="router.navigate('/cuenta')" 
                                    class="flex-1 bg-gray-200 text-gray-700 px-6 py-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-lg">
                                <i class="fas fa-arrow-left mr-2"></i>
                                Volver a mis reservas
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Función para cancelar la reserva actual
window.cancelCurrentBooking = async function() {
    if (!currentBooking) {
        toast.error('No hay reserva cargada');
        return;
    }
    
    if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
        return;
    }
    
    try {
        loading.show('Cancelando reserva...');
        await bookingService.cancel(currentBooking._id);
        loading.hide();
        toast.success('Reserva cancelada exitosamente');
        
        // Redirigir a la página de cuenta después de 1.5 segundos
        setTimeout(() => {
            window.router.navigate('/cuenta');
        }, 1500);
    } catch (error) {
        loading.hide();
        toast.error(error.message || 'Error al cancelar la reserva');
    }
};

// Funciones auxiliares para los estilos del estado
function getStatusBgColor(status) {
    switch(status) {
        case 'pending': return 'yellow-50';
        case 'confirmed': return 'blue-50';
        case 'completed': return 'green-50';
        case 'cancelled': return 'red-50';
        default: return 'gray-50';
    }
}

function getStatusBorderColor(status) {
    switch(status) {
        case 'pending': return 'yellow-500';
        case 'confirmed': return 'blue-500';
        case 'completed': return 'green-500';
        case 'cancelled': return 'red-500';
        default: return 'gray-500';
    }
}

function getStatusTextColor(status) {
    switch(status) {
        case 'pending': return 'yellow-700';
        case 'confirmed': return 'blue-700';
        case 'completed': return 'green-700';
        case 'cancelled': return 'red-700';
        default: return 'gray-700';
    }
}

function getStatusIcon(status) {
    switch(status) {
        case 'pending': return 'fa-clock';
        case 'confirmed': return 'fa-check-circle';
        case 'completed': return 'fa-check-double';
        case 'cancelled': return 'fa-times-circle';
        default: return 'fa-question-circle';
    }
}
