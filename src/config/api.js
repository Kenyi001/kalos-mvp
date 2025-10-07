// Configuración de la API
const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    TIMEOUT: 30000,
    HEADERS: {
        'Content-Type': 'application/json'
    }
};

// Función para obtener el token JWT
export const getToken = () => {
    return localStorage.getItem('token');
};

// Función para guardar el token JWT
export const setToken = (token) => {
    localStorage.setItem('token', token);
};

// Función para eliminar el token JWT
export const removeToken = () => {
    localStorage.removeItem('token');
};

// Función para obtener los headers con autenticación
export const getAuthHeaders = () => {
    const token = getToken();
    return {
        ...API_CONFIG.HEADERS,
        ...(token && { Authorization: `Bearer ${token}` })
    };
};

// Función para hacer peticiones HTTP
export async function apiRequest(endpoint, options = {}) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const config = {
        ...options,
        headers: {
            ...API_CONFIG.HEADERS,
            ...options.headers
        }
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            // El backend devuelve {success: false, error: {message, status, details}}
            const errorMessage = data.error?.message || data.message || 'Error en la petición';
            const errorDetails = data.error?.details || data.details || [];
            
            throw {
                status: response.status,
                message: errorMessage,
                errors: errorDetails
            };
        }

        return data;
    } catch (error) {
        // Si no tiene estructura de error, es un error de red u otro tipo
        if (!error.status) {
            throw {
                status: 500,
                message: error.message || 'Error de conexión',
                errors: []
            };
        }
        
        if (error.status === 401) {
            // Token expirado o inválido
            removeToken();
            window.router?.navigate('/auth/login');
        }
        throw error;
    }
}

// Métodos de petición
export const api = {
    get: (endpoint) => apiRequest(endpoint, { method: 'GET', headers: getAuthHeaders() }),
    post: (endpoint, data) => apiRequest(endpoint, { 
        method: 'POST', 
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    }),
    put: (endpoint, data) => apiRequest(endpoint, { 
        method: 'PUT', 
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    }),
    delete: (endpoint) => apiRequest(endpoint, { 
        method: 'DELETE', 
        headers: getAuthHeaders()
    })
};

export default API_CONFIG;
