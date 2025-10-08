import state from '../../services/state.js';

export function createHeader() {
    const updateHeader = () => {
        const headerEl = document.getElementById('header');
        if (!headerEl) return;
        
        headerEl.innerHTML = `
            <header class="header-main backdrop-blur-sm shadow-xl sticky top-0 z-50">
                <div class="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12">
                    <!-- Desktop Header -->
                    <div class="hidden md:flex justify-between items-center h-24">
                        <!-- Logo Enhanced -->
                        <div class="flex items-center">
                            <button onclick="router.navigate('/')" class="group flex items-center space-x-3 cursor-pointer">
                                <div class="w-12 h-12 bg-gradient-mediterranean rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                    <span class="text-white font-serif font-bold text-xl">K</span>
                                </div>
                                <div class="flex flex-col">
                                    <span class="text-3xl font-serif font-bold text-aegean-600 group-hover:text-olive-gold-600 transition-colors duration-300">Kalos</span>
                                    <span class="text-xs text-gray-500 font-sans tracking-wide">SANTA CRUZ</span>
                                </div>
                            </button>
                        </div>

                        <!-- Navigation Desktop Enhanced -->
                        <nav class="flex items-center space-x-2">
                            <button onclick="router.navigate('/profesionales')" class="group relative text-aegean-600 hover:text-olive-gold-600 transition-all duration-300 font-medium text-lg px-8 py-4 rounded-xl hover:bg-marble-50 hover:shadow-md">
                                <span class="relative z-10">Expertos Cruceños</span>
                                <div class="absolute inset-0 bg-gradient-to-r from-aegean-50 to-olive-gold-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                            <button onclick="router.navigate('/servicios')" class="group relative text-aegean-600 hover:text-olive-gold-600 transition-all duration-300 font-medium text-lg px-8 py-4 rounded-xl hover:bg-marble-50 hover:shadow-md">
                                <span class="relative z-10">Servicios Locales</span>
                                <div class="absolute inset-0 bg-gradient-to-r from-aegean-50 to-olive-gold-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                        </nav>

                        <!-- User Actions Desktop Enhanced -->
                        <div class="flex items-center space-x-6">
                            ${state.isAuthenticated() ? `
                                <div class="relative">
                                    <button id="user-menu-btn" class="group flex items-center space-x-3 text-aegean-600 hover:text-olive-gold-600 transition-all duration-300 font-medium px-6 py-3 rounded-xl hover:bg-gradient-to-r hover:from-marble-50 hover:to-olive-gold-50 hover:shadow-md border border-transparent hover:border-olive-gold-200">
                                        <div class="w-10 h-10 bg-gradient-mediterranean rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                                            <span class="text-white font-semibold text-sm">${(state.user.name || 'U').charAt(0).toUpperCase()}</span>
                                        </div>
                                        <div class="flex flex-col items-start">
                                            <span class="font-semibold text-sm">${state.user.name || 'Usuario'}</span>
                                            <span class="text-xs text-gray-500">${state.isProfessional() ? 'Profesional' : 'Cliente'}</span>
                                        </div>
                                        <i id="user-chevron" class="fas fa-chevron-down text-sm transition-transform duration-300 group-hover:rotate-180"></i>
                                    </button>
                                    <div id="user-dropdown" class="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-marble-200 opacity-0 invisible transition-all duration-300 transform scale-95">
                                        <div class="py-2">
                                            <div class="px-4 py-3 border-b border-marble-200">
                                                <div class="text-sm font-semibold text-aegean-600">Mi cuenta</div>
                                                <div class="text-xs text-gray-500">${state.user.email || 'usuario@kalos.com'}</div>
                                            </div>
                                            ${state.isProfessional() ? `
                                                <button onclick="router.navigate('/dashboard'); closeUserDropdown();" class="flex items-center w-full text-left px-4 py-3 text-sm text-aegean-600 hover:bg-gradient-to-r hover:from-aegean-50 hover:to-olive-gold-50 hover:text-olive-gold-600 transition-all duration-200 rounded-lg mx-2 my-1">
                                                    <div class="w-8 h-8 bg-olive-gold-100 rounded-lg flex items-center justify-center mr-3">
                                                        <i class="fas fa-tachometer-alt text-olive-gold-600 text-sm"></i>
                                                    </div>
                                                    <div>
                                                        <div class="font-medium">Dashboard</div>
                                                        <div class="text-xs text-gray-500">Panel profesional</div>
                                                    </div>
                                                </button>
                                                <button onclick="router.navigate('/pro/services'); closeUserDropdown();" class="flex items-center w-full text-left px-4 py-3 text-sm text-aegean-600 hover:bg-gradient-to-r hover:from-aegean-50 hover:to-olive-gold-50 hover:text-olive-gold-600 transition-all duration-200 rounded-lg mx-2 my-1">
                                                    <div class="w-8 h-8 bg-olive-gold-100 rounded-lg flex items-center justify-center mr-3">
                                                        <i class="fas fa-concierge-bell text-olive-gold-600 text-sm"></i>
                                                    </div>
                                                    <div>
                                                        <div class="font-medium">Mis Servicios</div>
                                                        <div class="text-xs text-gray-500">Gestionar ofertas</div>
                                                    </div>
                                                </button>
                                            ` : `
                                                <button onclick="router.navigate('/cuenta'); closeUserDropdown();" class="flex items-center w-full text-left px-4 py-3 text-sm text-aegean-600 hover:bg-gradient-to-r hover:from-aegean-50 hover:to-olive-gold-50 hover:text-olive-gold-600 transition-all duration-200 rounded-lg mx-2 my-1">
                                                    <div class="w-8 h-8 bg-olive-gold-100 rounded-lg flex items-center justify-center mr-3">
                                                        <i class="fas fa-user text-olive-gold-600 text-sm"></i>
                                                    </div>
                                                    <div>
                                                        <div class="font-medium">Mi Cuenta</div>
                                                        <div class="text-xs text-gray-500">Configuración personal</div>
                                                    </div>
                                                </button>
                                            `}
                                            <div class="border-t border-marble-200 my-2"></div>
                                            <button onclick="handleLogout(); closeUserDropdown();" class="flex items-center w-full text-left px-4 py-3 text-sm text-aegean-600 hover:bg-gradient-to-r hover:from-terracotta-50 hover:to-red-50 hover:text-terracotta-600 transition-all duration-200 rounded-lg mx-2 my-1">
                                                <div class="w-8 h-8 bg-terracotta-100 rounded-lg flex items-center justify-center mr-3">
                                                    <i class="fas fa-sign-out-alt text-terracotta-500 text-sm"></i>
                                                </div>
                                                <div>
                                                    <div class="font-medium">Cerrar Sesión</div>
                                                    <div class="text-xs text-gray-500">Salir de la cuenta</div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ` : `
                                <button onclick="router.navigate('/auth/login')" class="group relative text-aegean-600 hover:text-white font-medium transition-all duration-300 px-6 py-3 rounded-xl border-2 border-aegean-600 hover:border-aegean-700 hover:bg-aegean-600 hover:shadow-lg">
                                    <span class="relative z-10 flex items-center">
                                        <i class="fas fa-sign-in-alt mr-2"></i>
                                        Iniciar sesión
                                    </span>
                                </button>
                                <button onclick="router.navigate('/auth/register')" class="btn-register group relative text-white font-semibold px-8 py-3 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105">
                                    <span class="relative z-10 flex items-center">
                                        <i class="fas fa-user-plus mr-2"></i>
                                        Registrarse
                                    </span>
                                </button>
                            `}
                        </div>
                    </div>

                    <!-- Mobile Header -->
                    <div class="md:hidden flex justify-between items-center h-18">
                        <!-- Logo Mobile -->
                        <button onclick="router.navigate('/')" class="text-2xl font-serif font-bold text-aegean-600 cursor-pointer hover:text-olive-gold-600 transition-colors">
                            Kalos
                        </button>
                        
                        <!-- Mobile Menu Button -->
                        <button id="mobile-menu-btn" class="text-aegean-600 hover:text-olive-gold-600 transition-colors p-2 rounded-md hover:bg-marble-100">
                            <i class="fas fa-bars text-xl"></i>
                        </button>
                    </div>
                </div>

                <!-- Mobile Navigation -->
                <div id="mobile-menu" class="md:hidden bg-white border-t border-olive-gold-600 hidden">
                    <div class="px-4 py-4 space-y-2">
                        <button onclick="router.navigate('/profesionales')" class="block w-full text-left py-3 text-aegean-600 hover:text-olive-gold-600 hover:bg-marble-100 font-medium transition-colors rounded-md">
                            Expertos Cruceños
                        </button>
                        <button onclick="router.navigate('/servicios')" class="block w-full text-left py-3 text-aegean-600 hover:text-olive-gold-600 hover:bg-marble-100 font-medium transition-colors rounded-md">
                            Servicios Locales
                        </button>
                        ${!state.isAuthenticated() ? `
                            <div class="pt-2 border-t border-marble-200">
                                <button onclick="router.navigate('/auth/login')" class="block w-full text-left py-3 text-aegean-600 hover:text-olive-gold-600 hover:bg-marble-100 font-medium transition-colors rounded-md">
                                    Iniciar sesión
                                </button>
                                <button onclick="router.navigate('/auth/register')" class="block w-full text-left py-3 bg-gradient-mediterranean text-white hover:bg-olive-gold-700 font-semibold transition-colors rounded-md mt-2">
                                    Registrarse
                                </button>
                            </div>
                        ` : `
                            <div class="pt-2 border-t border-marble-200">
                                ${state.isProfessional() ? `
                                    <button onclick="router.navigate('/dashboard')" class="block w-full text-left py-3 text-aegean-600 hover:text-olive-gold-600 hover:bg-marble-100 font-medium transition-colors rounded-md">
                                        Dashboard
                                    </button>
                                ` : `
                                    <button onclick="router.navigate('/cuenta')" class="block w-full text-left py-3 text-aegean-600 hover:text-olive-gold-600 hover:bg-marble-100 font-medium transition-colors rounded-md">
                                        Mi cuenta
                                    </button>
                                `}
                                <button onclick="handleLogout()" class="block w-full text-left py-3 text-aegean-600 hover:text-terracotta-500 hover:bg-terracotta-100 font-medium transition-colors rounded-md">
                                    Cerrar sesión
                                </button>
                            </div>
                        `}
                    </div>
                </div>
            </header>
        `;

        // Toggle mobile menu
        const mobileBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileBtn && mobileMenu) {
            mobileBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                const icon = mobileBtn.querySelector('i');
                if (mobileMenu.classList.contains('hidden')) {
                    icon.className = 'fas fa-bars text-xl';
                } else {
                    icon.className = 'fas fa-times text-xl';
                }
            });
        }

        // User dropdown functionality
        const userMenuBtn = document.getElementById('user-menu-btn');
        const userDropdown = document.getElementById('user-dropdown');
        const userChevron = document.getElementById('user-chevron');
        
        if (userMenuBtn && userDropdown) {
            userMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleUserDropdown();
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                closeUserDropdown();
            });

            userDropdown.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    };

    // Global logout function
    window.handleLogout = () => {
        state.logout();
        router.navigate('/');
    };

    // Global dropdown functions
    window.toggleUserDropdown = () => {
        const dropdown = document.getElementById('user-dropdown');
        const chevron = document.getElementById('user-chevron');
        
        if (dropdown && chevron) {
            const isOpen = !dropdown.classList.contains('opacity-0');
            
            if (isOpen) {
                dropdown.classList.add('opacity-0', 'invisible', 'scale-95');
                dropdown.classList.remove('opacity-100', 'visible', 'scale-100');
                chevron.classList.remove('rotate-180');
            } else {
                dropdown.classList.remove('opacity-0', 'invisible', 'scale-95');
                dropdown.classList.add('opacity-100', 'visible', 'scale-100');
                chevron.classList.add('rotate-180');
            }
        }
    };

    window.closeUserDropdown = () => {
        const dropdown = document.getElementById('user-dropdown');
        const chevron = document.getElementById('user-chevron');
        
        if (dropdown && chevron) {
            dropdown.classList.add('opacity-0', 'invisible', 'scale-95');
            dropdown.classList.remove('opacity-100', 'visible', 'scale-100');
            chevron.classList.remove('rotate-180');
        }
    };

    // Listen for user changes
    state.on('userChanged', updateHeader);

    return updateHeader;
}

export function renderWithHeader(content) {
    return `
        <div id="header"></div>
        <main class="min-h-screen">
            ${content}
        </main>
    `;
}