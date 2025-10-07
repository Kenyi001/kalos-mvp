import './styles/main.css';
import SimpleRouter from './utils/simpleRouter.js';
import { createHeader, renderWithHeader } from './components/layout/Header.js';
import { renderLandingPage } from './pages/LandingPage.js';
import { renderProfessionalsPage } from './pages/ProfessionalsPage.js';
import { renderProfessionalProfilePage } from './pages/ProfessionalProfilePage.js';
import { renderServicesPage } from './pages/ServicesPage.js';
import { renderLoginPage, renderRegisterPage } from './pages/AuthPages.js';
import { renderBookingPage } from './pages/BookingPage.js';
import { renderDashboardPage } from './pages/DashboardPage.js';
import { renderAccountPage } from './pages/AccountPage.js';
import { renderCreateProfessionalProfilePage } from './pages/CreateProfessionalProfilePage.js';
import { renderProfessionalServicesPage } from './pages/ProfessionalServicesPage.js';
import { renderServiceFormPage } from './pages/ServiceFormPage.js';
import { renderBookingDetailPage } from './pages/BookingDetailPage.js';

// Configurar las rutas de la aplicación
function setupRoutes() {
    console.log('🛠️ Configurando rutas...');
    
    // Ruta principal - Landing Page
    window.router.addRoute('/', () => {
        console.log('🏠 Cargando Landing Page');
        ensureGlobalScrollEnabled();
        document.getElementById('app').innerHTML = renderWithHeader(renderLandingPage());
        createHeader()();
    });

    // Profesionales
    window.router.addRoute('/profesionales', async () => {
        console.log('👥 Cargando página de profesionales');
        ensureGlobalScrollEnabled();
        const professionalsContent = await renderProfessionalsPage();
        document.getElementById('app').innerHTML = renderWithHeader(professionalsContent);
        createHeader()();
    });

    // Perfil de profesional
    window.router.addRoute('/pro/:id', async (params) => {
        console.log('👤 Cargando perfil de profesional:', params.id);
        const profileContent = await renderProfessionalProfilePage(params);
        document.getElementById('app').innerHTML = renderWithHeader(profileContent);
        createHeader()();
    });

    // Servicios
    window.router.addRoute('/servicios', async () => {
        console.log('🛍️ Cargando página de servicios');
        const servicesContent = await renderServicesPage();
        document.getElementById('app').innerHTML = renderWithHeader(servicesContent);
        createHeader()();
        
        // Setup event listeners after render
        setTimeout(() => {
            const searchInput = document.getElementById('search-services');
            if (searchInput && window.renderServicesGrid) {
                searchInput.addEventListener('input', () => {
                    window.renderServicesGrid();
                });
            }
        }, 100);
    });

    // Autenticación
    window.router.addRoute('/auth/login', () => {
        console.log('🔐 Cargando página de login');
        document.getElementById('app').innerHTML = renderLoginPage();
    });

    window.router.addRoute('/auth/register', () => {
        console.log('📝 Cargando página de registro');
        document.getElementById('app').innerHTML = renderRegisterPage();
    });

    // Reservas
    window.router.addRoute('/booking/new', async () => {
        console.log('📅 Cargando página de reserva');
        const bookingContent = await renderBookingPage();
        document.getElementById('app').innerHTML = renderWithHeader(bookingContent);
        createHeader()();
    });

    // Dashboard profesional
    window.router.addRoute('/dashboard', async () => {
        console.log('📊 Cargando dashboard profesional');
        const dashboardContent = await renderDashboardPage();
        document.getElementById('app').innerHTML = renderWithHeader(dashboardContent);
        createHeader()();
    });

    // Crear perfil profesional
    window.router.addRoute('/pro/profile/create', () => {
        console.log('✏️ Cargando creación de perfil profesional');
        document.getElementById('app').innerHTML = renderWithHeader(renderCreateProfessionalProfilePage());
        createHeader()();
    });

    // Cuenta de usuario
    window.router.addRoute('/cuenta', async () => {
        console.log('👤 Cargando página de cuenta');
        const accountContent = await renderAccountPage();
        document.getElementById('app').innerHTML = renderWithHeader(accountContent);
        createHeader()();
    });

    // Detalles de reserva
    window.router.addRoute('/reserva/:id', async (params) => {
        console.log('📋 Cargando detalles de reserva:', params.id);
        const bookingDetailContent = await renderBookingDetailPage(params);
        document.getElementById('app').innerHTML = renderWithHeader(bookingDetailContent);
        createHeader()();
    });

    // Gestión de servicios profesionales
    window.router.addRoute('/pro/services', () => {
        console.log('🛍️ Cargando gestión de servicios profesionales');
        ensureGlobalScrollEnabled();
        document.getElementById('app').innerHTML = renderWithHeader(renderProfessionalServicesPage());
        createHeader()();
    });

    // Crear/editar servicio profesional
    window.router.addRoute('/pro/services/create', () => {
        console.log('📝 Cargando formulario de servicio');
        ensureGlobalScrollEnabled();
        document.getElementById('app').innerHTML = renderWithHeader(renderServiceFormPage());
        createHeader()();
    });

    // Alias para crear servicio (ruta alternativa)
    window.router.addRoute('/pro/services/new', () => {
        console.log('📝 Cargando formulario de servicio (new)');
        ensureGlobalScrollEnabled();
        document.getElementById('app').innerHTML = renderWithHeader(renderServiceFormPage());
        createHeader()();
    });
    
    console.log('✅ Rutas configuradas:', Object.keys(window.router.routes));
}

// Función para inicializar la aplicación
function initApp() {
    console.log('🚀 Iniciando Kalos MVP...');
    
    // Crear instancia del router
    window.router = new SimpleRouter();
    
    // Configurar rutas ANTES de inicializar el router
    setupRoutes();
    
    // Agregar estilos globales adicionales
    addGlobalStyles();
    
    // Asegurar que el scroll esté habilitado
    ensureGlobalScrollEnabled();
    
    // Mostrar loading inicial
    const appElement = document.getElementById('app');
    if (appElement) {
        appElement.innerHTML = `
            <div class="min-h-screen flex items-center justify-center bg-gray-50">
                <div class="text-center">
                    <div class="spinner mx-auto mb-4"></div>
                    <p class="text-gray-600">Cargando Kalos...</p>
                </div>
            </div>
        `;
    }
    
    console.log('✅ Kalos MVP iniciado correctamente');
    
    // Inicializar el router
    window.router.init();
}

// Función de fallback para cargar la página por defecto
function loadDefaultPage() {
    console.log('🏠 Cargando página por defecto (fallback)');
    const appElement = document.getElementById('app');
    if (appElement) {
        try {
            appElement.innerHTML = renderWithHeader(renderLandingPage());
            createHeader()();
        } catch (error) {
            console.error('❌ Error cargando página por defecto:', error);
            appElement.innerHTML = `
                <div class="min-h-screen flex items-center justify-center bg-gray-50">
                    <div class="text-center p-8">
                        <div class="text-6xl mb-4">⚠️</div>
                        <h1 class="text-2xl font-bold text-gray-900 mb-4">Error de inicialización</h1>
                        <p class="text-gray-600 mb-4">Hubo un problema al cargar la aplicación.</p>
                        <button onclick="window.location.reload()" class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-purple-700">
                            🔄 Recargar página
                        </button>
                    </div>
                </div>
            `;
        }
    }
}

// Estilos adicionales para mejorar la UX
function addGlobalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Animaciones suaves */
        * {
            transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
        }
        
        /* Scrollbar personalizado */
        ::-webkit-scrollbar {
            width: 6px;
        }
        
        ::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        
        ::-webkit-scrollbar-thumb {
            background: #8B5CF6;
            border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: #7C3AED;
        }
        
        /* Loading states */
        .loading {
            opacity: 0.7;
            pointer-events: none;
        }
        
        /* Hover effects */
        .hover-lift:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        /* Focus states mejorados */
        button:focus, input:focus, select:focus, textarea:focus {
            outline: 2px solid #8B5CF6;
            outline-offset: 2px;
        }
        
        /* Animaciones de entrada */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .fade-in {
            animation: fadeIn 0.5s ease-out;
        }
        
        /* Responsive improvements */
        @media (max-width: 768px) {
            .text-4xl { font-size: 2rem; }
            .text-3xl { font-size: 1.75rem; }
            .text-2xl { font-size: 1.5rem; }
            .px-8 { padding-left: 1rem; padding-right: 1rem; }
            .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
        }
        
        /* Mejoras de accesibilidad */
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
        
        /* Estados de error */
        .error-input {
            border-color: #EF4444 !important;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
        
        /* Loading spinner */
        .spinner {
            border: 2px solid #f3f3f3;
            border-top: 2px solid #8B5CF6;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* Card hover effects */
        .card-hover {
            transition: all 0.3s ease;
        }
        
        .card-hover:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 40px rgba(139, 92, 246, 0.1);
        }
        
        /* Button animations */
        .btn-primary {
            position: relative;
            overflow: hidden;
        }
        
        .btn-primary::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
        }
        
        .btn-primary:hover::before {
            left: 100%;
        }
        
        /* Responsive grid improvements */
        .responsive-grid {
            display: grid;
            gap: 1.5rem;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }
        
        /* Toast notifications positioning */
        .toast-container {
            position: fixed;
            top: 1rem;
            right: 1rem;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
    `;
    
    document.head.appendChild(style);
}

// Función global para asegurar que el scroll esté habilitado
function ensureGlobalScrollEnabled() {
    document.body.style.overflow = '';
    document.body.style.overflowY = '';
    document.documentElement.style.overflow = '';
    document.documentElement.style.overflowY = '';
    
    // También remover cualquier clase que pueda estar bloqueando el scroll
    document.body.classList.remove('overflow-hidden');
    document.documentElement.classList.remove('overflow-hidden');
}

// Funciones de utilidad globales
window.utils = {
    // Formatear fechas
    formatDate: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    // Formatear precios
    formatPrice: (price) => {
        return `${price}€`;
    },
    
    // Debounce para búsquedas
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Validar email
    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // Generar ID único
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};

// Manejo de errores global
window.addEventListener('error', (event) => {
    console.error('Error en la aplicación:', event.error);
    
    // En producción, enviar errores a un servicio de logging
    if (window.location.hostname !== 'localhost') {
        // Aquí se integraría con un servicio como Sentry
        console.log('Error reportado:', event.error);
    }
});

// Manejo de rutas no controladas
window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rechazada no manejada:', event.reason);
    event.preventDefault();
});

// Performance monitoring básico
window.addEventListener('load', () => {
    setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        console.log('⚡ Tiempo de carga:', Math.round(navigation.loadEventEnd - navigation.loadEventStart), 'ms');
    }, 0);
});

// Función de diagnóstico
function diagnoseApp() {
    console.log('🔍 DIAGNÓSTICO DE LA APLICACIÓN:');
    console.log('- URL actual:', window.location.href);
    console.log('- Pathname:', window.location.pathname);
    console.log('- Elemento #app existe:', !!document.getElementById('app'));
    console.log('- Router existe:', !!window.router);
    console.log('- Rutas registradas:', window.router ? Object.keys(window.router.routes) : 'Router no disponible');
    console.log('- Document ready state:', document.readyState);
}

// Inicializar la aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        diagnoseApp();
        initApp();
    });
} else {
    diagnoseApp();
    initApp();
}

// Hot reload en desarrollo (solo si está disponible)
if (import.meta.hot) {
    import.meta.hot.accept();
}