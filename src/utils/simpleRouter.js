// Router simple y robusto para el MVP de Kalos
class SimpleRouter {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        console.log('🛣️ Router inicializado');
    }

    addRoute(path, handler) {
        this.routes[path] = handler;
        console.log(`➕ Ruta agregada: ${path}`);
    }

    navigate(path) {
        console.log(`🧭 Navegando a: ${path}`);
        window.history.pushState({}, '', path);
        this.handleRoute();
    }

    handleRoute() {
        const path = window.location.pathname;
        this.currentRoute = path;
        
        console.log(`🔄 Manejando ruta: ${path}`);
        
        // Verificar que existe el elemento app
        const appElement = document.getElementById('app');
        if (!appElement) {
            console.error('❌ Elemento #app no encontrado');
            return;
        }

        // Buscar ruta exacta
        if (this.routes[path]) {
            console.log(`✅ Ruta encontrada: ${path}`);
            try {
                this.routes[path]();
            } catch (error) {
                console.error('❌ Error ejecutando ruta:', error);
                this.showError(error);
            }
            return;
        }

        // Buscar rutas con parámetros
        for (const route in this.routes) {
            if (route.includes(':')) {
                const routeRegex = route.replace(/:[^\s/]+/g, '([\\w-]+)');
                const regex = new RegExp(`^${routeRegex}$`);
                const match = path.match(regex);
                
                if (match) {
                    console.log(`✅ Ruta dinámica encontrada: ${route}`);
                    const paramNames = route.match(/:[^\s/]+/g) || [];
                    const params = {};
                    
                    paramNames.forEach((param, index) => {
                        const paramName = param.substring(1);
                        params[paramName] = match[index + 1];
                    });
                    
                    try {
                        this.routes[route](params);
                    } catch (error) {
                        console.error('❌ Error ejecutando ruta dinámica:', error);
                        this.showError(error);
                    }
                    return;
                }
            }
        }

        // Mostrar 404
        console.log(`❌ Ruta no encontrada: ${path}`);
        this.show404();
    }

    show404() {
        const appElement = document.getElementById('app');
        if (!appElement) return;
        
        appElement.innerHTML = `
            <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #f9fafb; font-family: Inter, sans-serif;">
                <div style="text-align: center; max-width: 28rem; margin: 0 auto; padding: 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🔍</div>
                    <h1 style="font-size: 2.25rem; font-weight: bold; color: #111827; margin-bottom: 1rem;">404</h1>
                    <p style="color: #4b5563; margin-bottom: 0.5rem;">Página no encontrada</p>
                    <p style="font-size: 0.875rem; color: #6b7280; margin-bottom: 1.5rem;">La ruta "${this.currentRoute}" no existe.</p>
                    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                        <button onclick="window.router.navigate('/')" style="width: 100%; background-color: #8B5CF6; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; border: none; cursor: pointer; font-weight: 500; transition: background-color 0.2s;">
                            🏠 Ir al inicio
                        </button>
                        <button onclick="window.location.reload()" style="width: 100%; border: 1px solid #d1d5db; color: #374151; padding: 0.75rem 1.5rem; border-radius: 0.5rem; background: white; cursor: pointer; transition: background-color 0.2s;">
                            🔄 Recargar página
                        </button>
                    </div>
                    <div style="margin-top: 1.5rem; font-size: 0.75rem; color: #9ca3af;">
                        Rutas disponibles: ${Object.keys(this.routes).join(', ') || 'Ninguna'}
                    </div>
                </div>
            </div>
        `;
    }

    showError(error) {
        const appElement = document.getElementById('app');
        if (!appElement) return;
        
        appElement.innerHTML = `
            <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #f9fafb; font-family: Inter, sans-serif;">
                <div style="text-align: center; max-width: 28rem; margin: 0 auto; padding: 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
                    <h1 style="font-size: 2.25rem; font-weight: bold; color: #111827; margin-bottom: 1rem;">Error</h1>
                    <p style="color: #4b5563; margin-bottom: 1.5rem;">Hubo un problema cargando la página.</p>
                    <pre style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; font-size: 0.75rem; text-align: left; margin-bottom: 1.5rem; overflow: auto;">${error.message}</pre>
                    <button onclick="window.location.reload()" style="background-color: #8B5CF6; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; border: none; cursor: pointer; font-weight: 500;">
                        🔄 Recargar página
                    </button>
                </div>
            </div>
        `;
    }

    init() {
        // Escuchar cambios de historia del navegador
        window.addEventListener('popstate', () => {
            console.log('📱 Evento popstate detectado');
            this.handleRoute();
        });

        // Manejar ruta inicial
        console.log('🚀 Iniciando manejo de ruta inicial');
        
        // Esperar a que el DOM esté completamente listo
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            setTimeout(() => this.handleRoute(), 0);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.handleRoute(), 0);
            });
        }
    }
}

export default SimpleRouter;