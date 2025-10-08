export function renderLandingPage() {
    return `
        <div class="min-h-screen relative overflow-hidden" style="background: linear-gradient(135deg, var(--aegean-600) 0%, var(--aegean-700) 30%, var(--olive-gold-600) 100%);">
            <!-- Hero Section Enhanced -->
            <div class="relative z-10">
                <div class="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12 pt-32 pb-24">
                    <div class="text-center relative">
                        <!-- Hero Visual - positioned as background element -->
                        <div class="absolute top-0 right-0 hidden lg:block opacity-30 pointer-events-none">
                            <div class="w-80 h-80 bg-gradient-to-br from-white/20 to-olive-gold-300/30 rounded-full backdrop-blur-sm border border-white/20 relative overflow-hidden">
                                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                    <div class="text-5xl font-serif font-bold text-white/90 mb-2">K</div>
                                    <div class="text-white/70 text-xs font-sans tracking-wider">SANTA CRUZ</div>
                                </div>
                            </div>
                        </div>

                        <!-- Hero Content - centered and unified -->
                        <div class="relative z-10 max-w-4xl mx-auto">
                            <div class="inline-block px-4 py-2 bg-white/10 rounded-full text-olive-gold-200 text-sm font-medium mb-6 backdrop-blur-sm">
                                🌴 Belleza Premium en Santa Cruz
                            </div>
                            <h1 class="text-5xl lg:text-7xl font-serif font-bold text-white mb-8 leading-tight">
                                Belleza <span class="text-olive-gold-300">Cruceña</span>,<br>
                                <span class="text-olive-gold-400 font-serif italic text-4xl lg:text-5xl">tradición mediterránea</span>
                            </h1>
                            <p class="text-xl lg:text-2xl text-marble-100 font-sans mb-10 max-w-3xl mx-auto font-light leading-relaxed">
                                Conecta con los mejores estilistas y especialistas en belleza de Santa Cruz. Elegancia internacional, confianza local.
                            </p>
                            <div class="flex flex-col sm:flex-row gap-6 justify-center">
                                <button onclick="router.navigate('/profesionales')" class="group relative" style="background: white !important; color: var(--aegean-600) !important; font-weight: 600 !important; padding: 1rem 2.5rem !important; border-radius: 1rem !important; transition: all 0.3s ease !important; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;" onmouseover="this.style.boxShadow='0 25px 50px -12px rgba(0, 0, 0, 0.25)'; this.style.transform='scale(1.05)';" onmouseout="this.style.boxShadow='0 10px 15px -3px rgba(0, 0, 0, 0.1)'; this.style.transform='scale(1)';">
                                    <span class="flex items-center justify-center">
                                        <i class="fas fa-search mr-3 text-olive-gold-600"></i>
                                        Descubrir Expertos Cruceños
                                    </span>
                                </button>
                                <button onclick="router.navigate('/auth/register')" class="group relative" style="border: 2px solid rgba(255, 255, 255, 0.3) !important; background: transparent !important; color: white !important; font-weight: 600 !important; padding: 1rem 2.5rem !important; border-radius: 1rem !important; transition: all 0.3s ease !important; backdrop-filter: blur(4px) !important;" onmouseover="this.style.background='rgba(255, 255, 255, 0.1)'; this.style.borderColor='white';" onmouseout="this.style.background='transparent'; this.style.borderColor='rgba(255, 255, 255, 0.3)';">
                                    <span class="flex items-center justify-center">
                                        <i class="fas fa-user-plus mr-3"></i>
                                        Ofrecer mis Servicios
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Features Section Enhanced -->
            <div class="bg-gradient-to-br from-marble-100 via-white to-olive-gold-50 py-32">
                <div class="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div class="text-center mb-20">
                        <div class="inline-block px-6 py-3 bg-olive-gold-100 rounded-full text-olive-gold-700 text-sm font-semibold mb-6">
                            ✨ Ventajas Exclusivas
                        </div>
                        <h2 class="text-4xl lg:text-6xl font-serif font-bold text-aegean-600 mb-6">
                            ¿Por qué los cruceños eligen <span class="text-olive-gold-600">Kalos</span>?
                        </h2>
                        <p class="text-xl lg:text-2xl text-gray-600 font-sans font-light max-w-3xl mx-auto">
                            Calidad internacional, confianza local en el corazón de Santa Cruz de la Sierra
                        </p>
                    </div>
                    
                    <div class="grid lg:grid-cols-3 gap-12">
                        <div class="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-marble-200">
                            <div class="w-20 h-20 bg-gradient-to-br from-aegean-500 to-aegean-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <i class="fas fa-calendar-check text-3xl text-white"></i>
                            </div>
                            <h3 class="text-2xl font-serif font-bold text-aegean-600 mb-4 text-center">Reserva Rápida</h3>
                            <p class="text-gray-600 font-sans text-center leading-relaxed text-lg">
                                Agenda tu cita en minutos con nuestro sistema intuitivo. La comodidad que mereces en Santa Cruz.
                            </p>
                            <div class="absolute inset-0 bg-gradient-to-br from-aegean-50/0 to-olive-gold-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                        </div>
                        
                        <div class="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-marble-200">
                            <div class="w-20 h-20 bg-gradient-to-br from-olive-gold-500 to-olive-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <i class="fas fa-star text-3xl text-white"></i>
                            </div>
                            <h3 class="text-2xl font-serif font-bold text-aegean-600 mb-4 text-center">Expertos Certificados</h3>
                            <p class="text-gray-600 font-sans text-center leading-relaxed text-lg">
                                Los mejores estilistas de Santa Cruz con certificación internacional y experiencia comprobada.
                            </p>
                            <div class="absolute inset-0 bg-gradient-to-br from-olive-gold-50/0 to-aegean-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                        </div>
                        
                        <div class="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-marble-200">
                            <div class="w-20 h-20 bg-gradient-to-br from-terracotta-400 to-terracotta-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <i class="fas fa-map-marker-alt text-3xl text-white"></i>
                            </div>
                            <h3 class="text-2xl font-serif font-bold text-aegean-600 mb-4 text-center">En Tu Zona</h3>
                            <p class="text-gray-600 font-sans text-center leading-relaxed text-lg">
                                Encuentra salones y especialistas cerca de ti en todos los barrios de Santa Cruz de la Sierra.
                            </p>
                            <div class="absolute inset-0 bg-gradient-to-br from-terracotta-50/0 to-marble-100/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Services Preview Enhanced -->
            <div class="bg-gradient-to-br from-white via-marble-50 to-aegean-50 py-32">
                <div class="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div class="text-center mb-20">
                        <div class="inline-block px-6 py-3 bg-aegean-100 rounded-full text-aegean-700 text-sm font-semibold mb-6">
                            💅 Servicios Populares
                        </div>
                        <h2 class="text-4xl lg:text-6xl font-serif font-bold text-aegean-600 mb-6">Servicios Favoritos en Santa Cruz</h2>
                        <p class="text-xl lg:text-2xl text-gray-600 font-sans font-light max-w-3xl mx-auto">Los tratamientos de belleza más solicitados por las cruceñas más exigentes</p>
                    </div>
                    
                    <div class="flex flex-col md:flex-row gap-8 justify-center max-w-5xl mx-auto">
                        <div class="flex-1 group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-1 border border-marble-200" onclick="router.navigate('/servicios')">
                            <div class="w-16 h-16 bg-gradient-to-br from-aegean-500 to-aegean-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md">
                                <i class="fas fa-cut text-2xl text-white"></i>
                            </div>
                            <h3 class="text-xl font-serif font-bold text-aegean-600 mb-3">Peluquería</h3>
                            <p class="text-gray-600 font-sans leading-relaxed">Cortes modernos, peinados y coloración adaptados al clima tropical cruceño</p>
                            <div class="mt-4 flex items-center text-olive-gold-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                                Ver servicios <i class="fas fa-arrow-right ml-2"></i>
                            </div>
                        </div>
                        
                        <div class="flex-1 group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-1 border border-marble-200" onclick="router.navigate('/servicios')">
                            <div class="w-16 h-16 bg-gradient-to-br from-olive-gold-500 to-olive-gold-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md">
                                <i class="fas fa-hand-sparkles text-2xl text-white"></i>
                            </div>
                            <h3 class="text-xl font-serif font-bold text-aegean-600 mb-3">Uñas & Nail Art</h3>
                            <p class="text-gray-600 font-sans leading-relaxed">Manicura, pedicura y nail art con diseños exclusivos y tendencias internacionales</p>
                            <div class="mt-4 flex items-center text-olive-gold-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                                Ver servicios <i class="fas fa-arrow-right ml-2"></i>
                            </div>
                        </div>
                        
                        <div class="flex-1 group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-1 border border-marble-200" onclick="router.navigate('/servicios')">
                            <div class="w-16 h-16 bg-gradient-to-br from-terracotta-400 to-terracotta-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md">
                                <i class="fas fa-spa text-2xl text-white"></i>
                            </div>
                            <h3 class="text-xl font-serif font-bold text-aegean-600 mb-3">Tratamientos Spa</h3>
                            <p class="text-gray-600 font-sans leading-relaxed">Faciales, masajes y tratamientos corporales premium con técnicas mediterráneas</p>
                            <div class="mt-4 flex items-center text-olive-gold-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                                Ver servicios <i class="fas fa-arrow-right ml-2"></i>
                            </div>
                        </div>
                    </div>
                    
                    <div class="text-center mt-16">
                        <button onclick="router.navigate('/servicios')" class="group relative" style="background: linear-gradient(135deg, var(--aegean-600) 0%, var(--aegean-700) 50%, var(--olive-gold-600) 100%) !important; color: white !important; font-weight: 600 !important; padding: 1rem 3rem !important; border-radius: 1rem !important; transition: all 0.3s ease !important; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;" onmouseover="this.style.boxShadow='0 25px 50px -12px rgba(0, 0, 0, 0.25)'; this.style.transform='scale(1.05)';" onmouseout="this.style.boxShadow='0 10px 15px -3px rgba(0, 0, 0, 0.1)'; this.style.transform='scale(1)';">
                            <span class="flex items-center justify-center">
                                Ver Todos los Servicios
                                <i class="fas fa-arrow-right ml-3 group-hover:translate-x-1 transition-transform"></i>
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- CTA Section Enhanced -->
            <div style="background: linear-gradient(135deg, var(--aegean-600) 50%, var(--terracotta-500) 70%, var(--olive-gold-600) 100%);" class="py-32 relative overflow-hidden">
                <!-- Background decoration -->
                <div class="absolute inset-0 opacity-10">
                    <div class="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
                    <div class="absolute bottom-10 right-10 w-24 h-24 bg-olive-gold-300 rounded-full"></div>
                    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-terracotta-300 rounded-full"></div>
                </div>
                
                <div class="max-w-6xl mx-auto text-center px-6 sm:px-8 lg:px-12 relative z-10">
                    <div class="inline-block px-6 py-3 bg-white/20 rounded-full text-olive-gold-200 text-sm font-semibold mb-8 backdrop-blur-sm">
                        🎆 Únete a la Experiencia Kalos
                    </div>
                    <h2 class="text-4xl lg:text-6xl font-serif font-bold text-white mb-8 leading-tight">
                        ¿Listo para verte y sentirte <span class="text-olive-gold-300">increíble</span>?
                    </h2>
                    <p class="text-xl lg:text-2xl text-marble-100 font-sans font-light mb-12 max-w-4xl mx-auto leading-relaxed">
                        Únete a cientos de cruceños que ya confían en nuestra plataforma para lucir su mejor versión
                    </p>
                    <div class="flex flex-col sm:flex-row gap-6 justify-center">
                        <button onclick="router.navigate('/profesionales')" class="group relative" style="background: white !important; color: var(--aegean-600) !important; font-weight: 700 !important; padding: 1rem 3rem !important; border-radius: 1rem !important; transition: all 0.3s ease !important; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;" onmouseover="this.style.boxShadow='0 25px 50px -12px rgba(0, 0, 0, 0.25)'; this.style.transform='scale(1.05)';" onmouseout="this.style.boxShadow='0 10px 15px -3px rgba(0, 0, 0, 0.1)'; this.style.transform='scale(1)';">
                            <span class="flex items-center justify-center">
                                <i class="fas fa-rocket mr-3 text-olive-gold-600"></i>
                                Empezar Ahora
                            </span>
                        </button>
                        <button onclick="router.navigate('/auth/register')" class="group relative" style="border: 2px solid white !important; background: transparent !important; color: white !important; font-weight: 700 !important; padding: 1rem 3rem !important; border-radius: 1rem !important; transition: all 0.3s ease !important;" onmouseover="this.style.background='white'; this.style.color='var(--aegean-600)';" onmouseout="this.style.background='transparent'; this.style.color='white';">
                            <span class="flex items-center justify-center">
                                <i class="fas fa-user-plus mr-3"></i>
                                Ser Profesional
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}