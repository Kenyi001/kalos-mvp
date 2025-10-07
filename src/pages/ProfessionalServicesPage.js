import { authService, serviceService, loading, toast } from '../services/apiService.js';

export function renderProfessionalServicesPage() {
    const user = authService.getCurrentUser();
    
    if (!authService.isAuthenticated() || !user || user.role !== 'professional') {
        return `
            <div class="min-h-screen flex items-center justify-center bg-gray-50">
                <div class="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
                    <i class="fas fa-exclamation-triangle text-4xl text-amber-600 mb-4"></i>
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">Acceso restringido</h2>
                    <p class="text-gray-600 mb-6">Esta área es solo para profesionales</p>
                    <button onclick="router.navigate('/')" 
                            class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                        Volver al inicio
                    </button>
                </div>
            </div>
        `;
    }

    // Cargar servicios desde el backend
    loadProfessionalServices();

    return `
        <div class="bg-gray-50 min-h-screen">
            <div class="bg-white border-b border-gray-200">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h1 class="text-3xl font-bold text-gray-900">Mis Servicios</h1>
                            <p class="text-gray-600 mt-1">Gestiona tus servicios personalizados y precios</p>
                        </div>
                        <button onclick="router.navigate('/pro/services/create')" 
                                class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
                            <i class="fas fa-plus mr-2"></i>
                            Crear Servicio
                        </button>
                    </div>
                </div>
            </div>

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div id="services-container">
                    <div class="text-center py-12">
                        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                        <p class="mt-4 text-gray-600">Cargando servicios...</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Función para cargar servicios desde el backend
async function loadProfessionalServices() {
    try {
        console.log('🔍 Cargando servicios del profesional...');
        
        // Usar el nuevo método que filtra automáticamente
        const services = await serviceService.getMyServices();
        
        console.log('✅ Servicios cargados:', services);
        renderServicesList(services);
    } catch (error) {
        console.error('❌ Error cargando servicios:', error);
        const container = document.getElementById('services-container');
        if (container) {
            container.innerHTML = `
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                    <i class="fas fa-exclamation-circle text-4xl text-red-400 mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Error al cargar servicios</h3>
                    <p class="text-gray-600 mb-6">${error.message || 'Intenta recargar la página'}</p>
                    <button onclick="location.reload()" 
                            class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                        Reintentar
                    </button>
                </div>
            `;
        }
    }
}

// Función para renderizar la lista de servicios
function renderServicesList(services) {
    const container = document.getElementById('services-container');
    if (!container) return;

    if (services.length === 0) {
        container.innerHTML = `
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <i class="fas fa-magic text-4xl text-gray-400 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Crea tu primer servicio</h3>
                <p class="text-gray-600 mb-6">Personaliza servicios únicos para destacar entre la competencia</p>
                <button onclick="router.navigate('/pro/services/create')" 
                        class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center">
                    <i class="fas fa-plus mr-2"></i>
                    Crear mi primer servicio
                </button>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${services.map(service => renderEditableServiceCard(service)).join('')}
            </div>
        `;
    }
}

function renderEditableServiceCard(service) {
    const isActive = service.isActive !== false;
    const priceMin = service.pricing?.priceRange?.min || 0;
    const priceMax = service.pricing?.priceRange?.max || 0;
    const duration = service.duration?.estimated || 60;
    
    // Convertir categoría snake_case a texto legible
    const categoryDisplay = service.category ? 
        service.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 
        'Sin categoría';
    
    return `
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="p-6">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center flex-wrap gap-2">
                        <span class="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium">
                            ${categoryDisplay}
                        </span>
                        <span class="px-2 py-1 text-xs rounded-full ${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}">
                            ${isActive ? 'Activo' : 'Inactivo'}
                        </span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button onclick="editService('${service._id}')" 
                                class="text-blue-600 hover:text-blue-700 p-2" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="toggleServiceStatus('${service._id}', ${!isActive})" 
                                class="text-gray-600 hover:text-gray-700 p-2" title="${isActive ? 'Desactivar' : 'Activar'}">
                            <i class="fas ${isActive ? 'fa-eye-slash' : 'fa-eye'}"></i>
                        </button>
                        <button onclick="deleteService('${service._id}')" 
                                class="text-red-600 hover:text-red-700 p-2" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>

                <h3 class="text-lg font-semibold text-gray-900 mb-2">${service.name}</h3>
                <p class="text-gray-600 text-sm mb-4 line-clamp-2">${service.description || 'Sin descripción'}</p>

                <div class="flex items-center justify-between">
                    <div class="flex items-center flex-wrap gap-2">
                        <span class="text-lg font-bold text-purple-600">${priceMin}€ - ${priceMax}€</span>
                        <span class="text-gray-500 text-sm">• ${duration} min</span>
                        ${service.serviceConfig?.location ? `
                            <span class="text-gray-500 text-sm">• 
                                ${service.serviceConfig.location === 'salon' ? 'Solo en salón' : 
                                  service.serviceConfig.location === 'home' ? 'Solo a domicilio' : 
                                  'Salón y domicilio'}
                            </span>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Funciones de gestión de servicios
window.editService = function(serviceId) {
    router.navigate(`/pro/services/create?edit=${serviceId}`);
};

window.toggleServiceStatus = async function(serviceId, newStatus) {
    try {
        loading.show('Actualizando servicio...');
        await serviceService.update(serviceId, { isActive: newStatus });
        toast.success(`Servicio ${newStatus ? 'activado' : 'desactivado'} correctamente`);
        loading.hide();
        
        // Recargar la lista de servicios
        await loadProfessionalServices();
    } catch (error) {
        loading.hide();
        console.error('Error actualizando servicio:', error);
        toast.error(error.message || 'Error al actualizar el servicio');
    }
};

window.deleteService = async function(serviceId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este servicio? Esta acción no se puede deshacer.')) {
        return;
    }
    
    try {
        loading.show('Eliminando servicio...');
        await serviceService.delete(serviceId);
        toast.success('Servicio eliminado correctamente');
        loading.hide();
        
        // Recargar la lista de servicios
        await loadProfessionalServices();
    } catch (error) {
        loading.hide();
        console.error('Error eliminando servicio:', error);
        toast.error(error.message || 'Error al eliminar el servicio');
    }
};

// Función para asegurar que el scroll esté habilitado
function ensureScrollEnabled() {
    document.body.style.overflow = '';
    document.body.style.overflowY = '';
    document.documentElement.style.overflow = '';
    document.documentElement.style.overflowY = '';
}

// Ejecutar al cargar la página para asegurar que el scroll esté habilitado
ensureScrollEnabled();