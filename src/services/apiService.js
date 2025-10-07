import { api } from '../config/api.js';
import state from './state.js';

// Servicio de autenticación
export const authService = {
    // Registro de usuario
    async register(userData) {
        try {
            console.log('Intentando registro con:', userData);
            
            const response = await api.post('/auth/register', userData);
            console.log('Register response completa:', response);
            
            // Con fetch, la respuesta ya es el JSON parseado, no necesita .data
            // El backend devuelve: { success: true, data: { user: {...}, token: "..." } }
            const registerData = response.data || response;
            const user = registerData.user;
            const token = registerData.token;
            
            console.log('Usuario extraído en registro:', user);
            console.log('Token extraído en registro:', token);
            
            if (token && user) {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                
                // Actualizar el state global para que el header se actualice
                state.setUser(user);
                console.log('Usuario registrado guardado en localStorage:', user);
            }
            return response;
        } catch (error) {
            console.error('Error en registro:', error);
            console.error('Error message:', error.message);
            console.error('Error status:', error.status);
            throw error;
        }
    },

    // Login
    async login(emailOrCredentials, password) {
        try {
            // Soportar ambos formatos: login(email, password) o login({email, password})
            const credentials = typeof emailOrCredentials === 'object' 
                ? emailOrCredentials 
                : { email: emailOrCredentials, password: password };
            
            console.log('Intentando login con:', credentials);
            
            const response = await api.post('/auth/login', credentials);
            console.log('Login response completa:', response);
            
            // Con fetch, la respuesta ya es el JSON parseado, no necesita .data
            // El backend devuelve: { success: true, data: { user: {...}, token: "..." } }
            const loginData = response.data || response;
            const user = loginData.user;
            const token = loginData.token;
            
            console.log('Usuario extraído:', user);
            console.log('Token extraído:', token);
            
            if (token && user) {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                
                // Actualizar el state global para que el header se actualice
                state.setUser(user);
                console.log('Usuario guardado en localStorage:', user);
            }
            return response;
        } catch (error) {
            console.error('Error en login:', error);
            console.error('Error message:', error.message);
            console.error('Error status:', error.status);
            throw error;
        }
    },

    // Logout
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('kalos_user');
        
        // Actualizar el state global
        state.logout();
        
        window.location.href = '/';
    },

    // Obtener usuario actual
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Verificar si está autenticado
    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    // Verificar si es profesional
    isProfessional() {
        const user = this.getCurrentUser();
        return user && user.role === 'professional';
    },

    // Verificar si es cliente
    isClient() {
        const user = this.getCurrentUser();
        return user && user.role === 'client';
    }
};

// Servicio de profesionales
export const professionalService = {
    // Obtener todos los profesionales
    async getAll(filters = {}) {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const endpoint = queryParams ? `/professionals?${queryParams}` : '/professionals';
            const response = await api.get(endpoint);
            return response;
        } catch (error) {
            console.error('Error obteniendo profesionales:', error);
            throw error;
        }
    },

    // Obtener profesional por ID
    async getById(id) {
        try {
            const response = await api.get(`/professionals/${id}`);
            return response;
        } catch (error) {
            console.error('Error obteniendo profesional:', error);
            throw error;
        }
    },

    // Crear perfil profesional
    async create(profileData) {
        try {
            const response = await api.post('/professionals', profileData);
            return response;
        } catch (error) {
            console.error('Error creando perfil profesional:', error);
            throw error;
        }
    },

    // Actualizar perfil profesional
    async update(id, profileData) {
        try {
            const response = await api.put(`/professionals/${id}`, profileData);
            return response;
        } catch (error) {
            console.error('Error actualizando perfil:', error);
            throw error;
        }
    }
};

// Servicio de servicios (valga la redundancia)
export const serviceService = {
    // Obtener todos los servicios
    async getAll(filters = {}) {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const endpoint = queryParams ? `/services?${queryParams}` : '/services';
            const response = await api.get(endpoint);
            return response;
        } catch (error) {
            console.error('Error obteniendo servicios:', error);
            throw error;
        }
    },

    // Obtener servicio por ID
    async getById(id) {
        try {
            const response = await api.get(`/services/${id}`);
            return response;
        } catch (error) {
            console.error('Error obteniendo servicio:', error);
            throw error;
        }
    },

    // Crear servicio (profesional)
    async create(serviceData) {
        try {
            const response = await api.post('/services', serviceData);
            return response;
        } catch (error) {
            console.error('Error creando servicio:', error);
            throw error;
        }
    },

    // Actualizar servicio
    async update(id, serviceData) {
        try {
            const response = await api.put(`/services/${id}`, serviceData);
            return response;
        } catch (error) {
            console.error('Error actualizando servicio:', error);
            throw error;
        }
    },

    // Eliminar servicio
    async delete(id) {
        try {
            const response = await api.delete(`/services/${id}`);
            return response;
        } catch (error) {
            console.error('Error eliminando servicio:', error);
            throw error;
        }
    },

    // Obtener servicios del profesional autenticado
    async getMyServices() {
        try {
            // Obtener todos los servicios
            const response = await this.getAll();
            const user = authService.getCurrentUser();
            
            console.log('👤 Usuario actual:', user);
            
            // El backend puede devolver los servicios directamente o en response.data
            const allServices = Array.isArray(response) ? response : response.data || [];
            
            console.log('📦 Array de servicios:', allServices);
            
            // Filtrar servicios del profesional actual
            // Buscar por professionalId primero, si no existe, buscar por el user ID en el campo user del professional
            const myServices = allServices.filter(service => {
                const serviceProfId = service.professional?._id || service.professional;
                const serviceProfUserId = service.professional?.user?._id || service.professional?.user;
                
                // Intentar coincidencia por professionalId
                if (user?.professionalId && serviceProfId === user.professionalId) {
                    console.log(`✅ Servicio "${service.name}" coincide por professionalId`);
                    return true;
                }
                
                // Intentar coincidencia por user ID
                if (user?.id && serviceProfUserId === user.id) {
                    console.log(`✅ Servicio "${service.name}" coincide por user ID`);
                    return true;
                }
                
                return false;
            });
            
            console.log(`✅ Mis servicios filtrados: ${myServices.length} servicios encontrados`);
            return myServices;
        } catch (error) {
            console.error('❌ Error obteniendo mis servicios:', error);
            throw error;
        }
    }
};

// Servicio de reservas
export const bookingService = {
    // Obtener todas las reservas del usuario
    async getAll(filters = {}) {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const endpoint = queryParams ? `/bookings?${queryParams}` : '/bookings';
            const response = await api.get(endpoint);
            return response;
        } catch (error) {
            console.error('Error obteniendo reservas:', error);
            throw error;
        }
    },

    // Obtener reserva por ID
    async getById(id) {
        try {
            const response = await api.get(`/bookings/${id}`);
            return response;
        } catch (error) {
            console.error('Error obteniendo reserva:', error);
            throw error;
        }
    },

    // Crear reserva
    async create(bookingData) {
        try {
            const response = await api.post('/bookings', bookingData);
            return response;
        } catch (error) {
            console.error('Error creando reserva:', error);
            throw error;
        }
    },

    // Actualizar reserva
    async update(id, updateData) {
        try {
            const response = await api.put(`/bookings/${id}`, updateData);
            return response;
        } catch (error) {
            console.error('Error actualizando reserva:', error);
            throw error;
        }
    },

    // Cancelar reserva
    async cancel(id, reason) {
        try {
            const response = await api.delete(`/bookings/${id}`);
            return response;
        } catch (error) {
            console.error('Error cancelando reserva:', error);
            throw error;
        }
    },

    // Obtener disponibilidad de un profesional
    async getAvailability(professionalId, date) {
        try {
            const queryParams = date ? `?date=${date}` : '';
            const response = await api.get(`/bookings/availability/${professionalId}${queryParams}`);
            return response;
        } catch (error) {
            console.error('Error obteniendo disponibilidad:', error);
            throw error;
        }
    }
};

// Utilidades de formato
export const formatters = {
    // Formatear fecha
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Formatear hora
    formatTime(timeString) {
        return timeString;  // Ya viene en formato HH:MM
    },

    // Formatear precio
    formatPrice(price) {
        return `€${price}`;
    },

    // Formatear estado de reserva
    formatStatus(status) {
        const statusMap = {
            pending: 'Pendiente',
            confirmed: 'Confirmada',
            in_progress: 'En progreso',
            completed: 'Completada',
            cancelled: 'Cancelada',
            no_show: 'No asistió'
        };
        return statusMap[status] || status;
    },

    // Obtener clase CSS para estado
    getStatusClass(status) {
        const classMap = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-green-100 text-green-800',
            in_progress: 'bg-blue-100 text-blue-800',
            completed: 'bg-gray-100 text-gray-800',
            cancelled: 'bg-red-100 text-red-800',
            no_show: 'bg-orange-100 text-orange-800'
        };
        return classMap[status] || 'bg-gray-100 text-gray-800';
    }
};

// Utilidades de validación
export const validators = {
    // Validar email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validar teléfono
    validatePhone(phone) {
        const re = /^(\+34|0034|34)?[6789]\d{8}$/;
        return re.test(phone.replace(/\s/g, ''));
    },

    // Validar contraseña
    validatePassword(password) {
        return password.length >= 6;
    },

    // Validar fecha futura
    validateFutureDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
    },

    // Validar hora
    validateTime(timeString) {
        const re = /^([01]\d|2[0-3]):([0-5]\d)$/;
        return re.test(timeString);
    }
};

// Sistema de notificaciones Toast
export const toast = {
    show(message, type = 'info', duration = 3000) {
        // Crear contenedor si no existe
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'fixed top-4 right-4 z-50 space-y-2';
            document.body.appendChild(container);
        }

        // Crear toast
        const toast = document.createElement('div');
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };

        toast.className = `${colors[type] || colors.info} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 transform transition-all duration-300 translate-x-full`;
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        toast.innerHTML = `
            <span class="text-xl">${icons[type] || icons.info}</span>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        // Animación de entrada
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 10);

        // Remover después de la duración
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                container.removeChild(toast);
                if (container.children.length === 0) {
                    document.body.removeChild(container);
                }
            }, 300);
        }, duration);
    },

    success(message, duration) {
        this.show(message, 'success', duration);
    },

    error(message, duration) {
        this.show(message, 'error', duration);
    },

    warning(message, duration) {
        this.show(message, 'warning', duration);
    },

    info(message, duration) {
        this.show(message, 'info', duration);
    }
};

// Helper para mostrar loading
export const loading = {
    show(message = 'Cargando...') {
        const overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        overlay.innerHTML = `
            <div class="bg-white rounded-lg p-6 shadow-xl text-center">
                <div class="spinner mx-auto mb-4" style="width: 40px; height: 40px; border-width: 3px;"></div>
                <p class="text-gray-700">${message}</p>
            </div>
        `;
        document.body.appendChild(overlay);
    },

    hide() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            document.body.removeChild(overlay);
        }
    }
};

// Formatters
export const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
};

export const formatTime = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
};

export const formatPrice = (price) => {
    if (!price && price !== 0) return 'N/A';
    return `${price.toFixed(2)}€`;
};

export const formatStatus = (status) => {
    const statusMap = {
        pending: 'Pendiente',
        confirmed: 'Confirmada',
        completed: 'Completada',
        cancelled: 'Cancelada'
    };
    return statusMap[status] || status;
};

export const getStatusClass = (status) => {
    const classMap = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800'
    };
    return classMap[status] || 'bg-gray-100 text-gray-800';
};

// Validators
export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validatePhone = (phone) => {
    const re = /^[0-9]{9,}$/;
    return re.test(phone);
};

export const validatePassword = (password) => {
    return password && password.length >= 6;
};

export const validateFutureDate = (date) => {
    const selected = new Date(date);
    const now = new Date();
    return selected > now;
};

export const validateTime = (time) => {
    const re = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return re.test(time);
};
