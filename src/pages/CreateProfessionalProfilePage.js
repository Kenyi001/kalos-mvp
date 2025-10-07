import { authService, professionalService, loading, toast } from '../services/apiService.js';

// Variable global para la imagen de perfil
let profileImageBase64 = null;

export function renderCreateProfessionalProfilePage() {
    // Verificar autenticación
    if (!authService.isAuthenticated()) {
        return `
            <div class="min-h-screen flex items-center justify-center bg-gradient-mediterranean">
                <div class="text-center bg-white p-8 rounded-xl shadow-2xl max-w-md">
                    <i class="fas fa-lock text-4xl text-aegean-600 mb-4"></i>
                    <h2 class="text-2xl font-serif font-bold text-aegean-600 mb-4">Inicia sesión para continuar</h2>
                    <p class="text-gray-600 mb-6">Accede para crear tu perfil profesional</p>
                    <button onclick="router.navigate('/login')" 
                            class="btn-primary">
                        Iniciar sesión
                    </button>
                </div>
            </div>
        `;
    }

    const user = authService.getCurrentUser();
    if (!user || user.role !== 'professional') {
        return `
            <div class="min-h-screen flex items-center justify-center bg-gradient-mediterranean">
                <div class="text-center bg-white p-8 rounded-xl shadow-2xl max-w-md">
                    <i class="fas fa-exclamation-triangle text-4xl text-terracotta-500 mb-4"></i>
                    <h2 class="text-2xl font-serif font-bold text-aegean-600 mb-4">Acceso restringido</h2>
                    <p class="text-gray-600 mb-6">Esta área es exclusiva para profesionales de <span class="text-olive-gold-600 font-serif font-semibold">Kalos</span></p>
                    <button onclick="router.navigate('/')" 
                            class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                        Volver al inicio
                    </button>
                </div>
            </div>
        `;
    }

    // Cargar perfil existente si hay professionalId
    if (user.professionalId) {
        loadExistingProfile(user.professionalId);
    }

    return `
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Header -->
                <div class="text-center mb-8">
                    <h1 class="text-3xl font-bold text-gray-900 mb-4">
                        ${user.professionalId ? 'Editar' : 'Crear'} tu perfil profesional
                    </h1>
                    <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                        Completa tu perfil para que los clientes puedan encontrarte
                    </p>
                </div>

                <!-- Formulario -->
                <form id="professional-form" onsubmit="handleSaveProfessionalProfile(event)" class="space-y-6">
                    
                    <!-- Información básica -->
                    <div class="bg-white rounded-lg shadow-sm p-6">
                        <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <i class="fas fa-user-tie text-purple-600 mr-2"></i>
                            Información básica
                        </h2>
                        
                        <div class="grid md:grid-cols-2 gap-6">
                            <!-- Foto de perfil -->
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Foto de perfil
                                </label>
                                <div class="flex items-center gap-4">
                                    <div class="relative">
                                        <img id="profile-image-preview" 
                                             src="https://via.placeholder.com/150/9333ea/ffffff?text=Sin+Foto" 
                                             alt="Foto de perfil"
                                             class="w-24 h-24 rounded-full object-cover border-4 border-purple-200">
                                        <button type="button" 
                                                onclick="document.getElementById('profile-image-input').click()"
                                                class="absolute bottom-0 right-0 bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-purple-700 shadow-lg">
                                            <i class="fas fa-camera text-xs"></i>
                                        </button>
                                    </div>
                                    <div class="flex-1">
                                        <input type="file" 
                                               id="profile-image-input" 
                                               accept="image/*" 
                                               class="hidden"
                                               onchange="handleProfileImageChange(event)">
                                        <button type="button"
                                                onclick="document.getElementById('profile-image-input').click()"
                                                class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                                            <i class="fas fa-upload mr-2"></i>Subir foto
                                        </button>
                                        <p class="text-xs text-gray-500 mt-2">JPG, PNG o GIF. Máximo 5MB</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre del negocio *
                                </label>
                                <input type="text" id="business-name" required
                                       class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                       placeholder="Ej: Salón de Belleza María">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Especialidad principal *
                                </label>
                                <select id="specialty" required 
                                        class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500">
                                    <option value="">Selecciona una especialidad</option>
                                    <option value="Peluquería">Peluquería</option>
                                    <option value="Manicura">Manicura y Pedicura</option>
                                    <option value="Estética">Estética y Tratamientos</option>
                                    <option value="Maquillaje">Maquillaje</option>
                                    <option value="Masajes">Masajes y Relajación</option>
                                    <option value="Depilación">Depilación</option>
                                </select>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Años de experiencia *
                                </label>
                                <input type="number" id="experience" required min="0" max="50"
                                       class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                       placeholder="5">
                            </div>
                            
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción profesional *
                                </label>
                                <textarea id="description" rows="4" required maxlength="1000"
                                          class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                          placeholder="Cuéntanos sobre tu experiencia, especialidades y lo que te hace único..."></textarea>
                                <p class="text-xs text-gray-500 mt-1">Máximo 1000 caracteres</p>
                            </div>
                        </div>
                    </div>

                    <!-- Ubicación y tipo de servicio -->
                    <div class="bg-white rounded-lg shadow-sm p-6">
                        <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <i class="fas fa-map-marker-alt text-purple-600 mr-2"></i>
                            Ubicación y servicio
                        </h2>
                        
                        <div class="space-y-6">
                            <!-- Tipo de servicio -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-3">
                                    ¿Dónde ofreces tus servicios? *
                                </label>
                                <div class="space-y-3">
                                    <label class="flex items-start p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                                        <input type="radio" name="service-type" value="salon_service" required
                                               class="mt-1 text-purple-600 focus:ring-purple-500">
                                        <div class="ml-3">
                                            <div class="font-medium text-gray-900">Solo en mi salón</div>
                                            <div class="text-sm text-gray-500">Los clientes vienen a mi establecimiento</div>
                                        </div>
                                    </label>
                                    <label class="flex items-start p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                                        <input type="radio" name="service-type" value="home_service"
                                               class="mt-1 text-purple-600 focus:ring-purple-500">
                                        <div class="ml-3">
                                            <div class="font-medium text-gray-900">Solo a domicilio</div>
                                            <div class="text-sm text-gray-500">Me desplazo al domicilio del cliente</div>
                                        </div>
                                    </label>
                                    <label class="flex items-start p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                                        <input type="radio" name="service-type" value="both" checked
                                               class="mt-1 text-purple-600 focus:ring-purple-500">
                                        <div class="ml-3">
                                            <div class="font-medium text-gray-900">Ambos</div>
                                            <div class="text-sm text-gray-500">Ofrezco servicio en salón y a domicilio</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <!-- Dirección del salón -->
                            <div id="salon-address-section">
                                <div class="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">
                                            Ciudad *
                                        </label>
                                        <input type="text" id="city" required
                                               class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                               placeholder="Madrid">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">
                                            Provincia/Estado
                                        </label>
                                        <input type="text" id="state"
                                               class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                               placeholder="Madrid">
                                    </div>
                                    <div class="md:col-span-2">
                                        <label class="block text-sm font-medium text-gray-700 mb-2">
                                            Dirección (opcional)
                                        </label>
                                        <input type="text" id="street"
                                               class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                               placeholder="Calle, número, piso...">
                                    </div>
                                </div>
                            </div>

                            <!-- Radio de servicio a domicilio -->
                            <div id="service-radius-section" class="hidden">
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Radio de servicio a domicilio (km)
                                </label>
                                <input type="number" id="service-radius" min="5" max="50" value="10"
                                       class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500">
                            </div>
                        </div>
                    </div>

                    <!-- Portafolio -->
                    <div class="bg-white rounded-lg shadow-sm p-6">
                        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <i class="fas fa-images text-purple-600 mr-2"></i>
                            Portafolio
                        </h2>
                        <p class="text-sm text-gray-600 mb-4">
                            Sube fotos de tu trabajo para que los clientes vean tu estilo y calidad
                        </p>
                        
                        <!-- Formulario para agregar imagen (oculto por defecto) -->
                        <div id="portfolio-form" class="hidden mb-6 p-4 border-2 border-purple-200 rounded-lg bg-purple-50">
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="text-lg font-semibold text-gray-900">Nueva imagen</h3>
                                <button type="button" onclick="closePortfolioForm()" class="text-gray-500 hover:text-gray-700">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            
                            <div class="space-y-4">
                                <!-- Método de carga -->
                                <div class="grid grid-cols-2 gap-2">
                                    <button type="button" onclick="switchUploadMethod('url')" 
                                            id="btn-method-url"
                                            class="p-3 border-2 border-purple-500 bg-white rounded-lg text-center hover:bg-purple-50 transition-colors">
                                        <i class="fas fa-link text-lg text-purple-600 mb-1"></i>
                                        <div class="text-sm font-semibold text-purple-900">Usar URL</div>
                                    </button>
                                    <button type="button" onclick="switchUploadMethod('file')" 
                                            id="btn-method-file"
                                            class="p-3 border-2 border-gray-300 bg-white rounded-lg text-center hover:bg-gray-50 transition-colors">
                                        <i class="fas fa-upload text-lg text-gray-400 mb-1"></i>
                                        <div class="text-sm font-semibold text-gray-700">Subir archivo</div>
                                    </button>
                                </div>

                                <div class="grid grid-cols-2 gap-3">
                                    <div>
                                        <label class="block text-xs font-medium text-gray-700 mb-1">Título *</label>
                                        <input type="text" id="portfolio-title"
                                               class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                               placeholder="Ej: Corte moderno">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-medium text-gray-700 mb-1">Categoría *</label>
                                        <select id="portfolio-category"
                                                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                            <option value="">Selecciona</option>
                                            <option value="Peluquería">Peluquería</option>
                                            <option value="Uñas">Uñas</option>
                                            <option value="Maquillaje">Maquillaje</option>
                                            <option value="Estética">Estética</option>
                                            <option value="Otros">Otros</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div>
                                    <label class="block text-xs font-medium text-gray-700 mb-1">Descripción (opcional)</label>
                                    <textarea id="portfolio-description" rows="2"
                                              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                              placeholder="Breve descripción del trabajo..."></textarea>
                                </div>
                                
                                <!-- Sección de URL -->
                                <div id="url-section">
                                    <label class="block text-xs font-medium text-gray-700 mb-1">URL de la imagen *</label>
                                    <input type="url" id="portfolio-url"
                                           class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                           placeholder="https://images.unsplash.com/...">
                                    <div id="url-preview" class="mt-2 hidden">
                                        <img id="url-preview-img" src="" alt="Preview" class="w-full h-32 object-cover rounded border border-gray-300">
                                    </div>
                                </div>
                                
                                <!-- Sección de archivo -->
                                <div id="file-section" class="hidden">
                                    <label class="block text-xs font-medium text-gray-700 mb-1">Seleccionar archivo *</label>
                                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors cursor-pointer bg-white"
                                         onclick="document.getElementById('portfolio-file').click()">
                                        <input type="file" id="portfolio-file" accept="image/*" class="hidden" onchange="previewFile(event)">
                                        <i class="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                                        <p class="text-sm text-gray-600">Click para seleccionar</p>
                                        <p class="text-xs text-gray-500">JPG, PNG, GIF (Max. 5MB)</p>
                                    </div>
                                    <div id="file-preview" class="mt-2 hidden">
                                        <div class="relative">
                                            <img id="file-preview-img" src="" alt="Preview" class="w-full h-32 object-cover rounded border border-gray-300">
                                            <button type="button" onclick="clearFilePreview()" 
                                                    class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 text-xs">
                                                <i class="fas fa-times"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="flex gap-2">
                                    <button type="button" onclick="closePortfolioForm()" 
                                            class="flex-1 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                        Cancelar
                                    </button>
                                    <button type="button" onclick="addPortfolioImage()" 
                                            class="flex-1 px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                                        <i class="fas fa-plus mr-1"></i>Agregar
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Grid de imágenes -->
                        <div id="portfolio-container" class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                            <!-- Se llenará dinámicamente -->
                        </div>
                        
                        <!-- Botón para mostrar formulario -->
                        <button type="button" onclick="togglePortfolioForm()" id="btn-add-portfolio"
                                class="w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-6 text-center hover:border-purple-500 hover:bg-purple-50 transition-colors">
                            <i class="fas fa-plus-circle text-2xl text-purple-600 mb-2"></i>
                            <p class="text-sm font-medium text-gray-700">Agregar imagen</p>
                        </button>
                    </div>

                    <!-- Servicios - Simplificado -->
                    <div class="bg-purple-50 border border-purple-200 rounded-lg p-6">
                        <div class="flex items-start">
                            <i class="fas fa-info-circle text-purple-600 text-xl mr-3 mt-1"></i>
                            <div class="flex-1">
                                <h3 class="text-lg font-semibold text-purple-900 mb-2">Gestión de servicios</h3>
                                <p class="text-sm text-purple-800 mb-4">
                                    Después de crear tu perfil, podrás agregar y configurar tus servicios (precios, duraciones, descripciones) en la sección dedicada.
                                </p>
                                <button type="button" onclick="router.navigate('/pro/services')" 
                                        class="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                                    <i class="fas fa-arrow-right mr-2"></i>
                                    Ir a gestionar servicios
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Contacto -->
                    <div class="bg-white rounded-lg shadow-sm p-6">
                        <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <i class="fas fa-phone text-purple-600 mr-2"></i>
                            Información de contacto
                        </h2>
                        
                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Teléfono de contacto *
                                </label>
                                <input type="tel" id="phone" required
                                       class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                       placeholder="+34 600 000 000">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Instagram (opcional)
                                </label>
                                <div class="flex">
                                    <span class="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-lg">
                                        @
                                    </span>
                                    <input type="text" id="instagram"
                                           class="flex-1 border border-gray-300 rounded-r-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                           placeholder="tu_usuario">
                                </div>
                            </div>
                            
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Sitio web (opcional)
                                </label>
                                <input type="url" id="website"
                                       class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                       placeholder="https://tusitio.com">
                            </div>
                        </div>
                    </div>

                    <!-- Botones -->
                    <div class="bg-white rounded-lg shadow-sm p-6">
                        <div class="flex flex-col sm:flex-row justify-between gap-4">
                            <button type="button" onclick="router.navigate('/dashboard')" 
                                    class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                Cancelar
                            </button>
                            <button type="submit" 
                                    class="px-8 py-3 bg-primary text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold">
                                <i class="fas fa-save mr-2"></i>
                                ${user.professionalId ? 'Guardar cambios' : 'Crear perfil'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `;
}

// Array temporal para almacenar imágenes del portafolio
let portfolioImages = [];

// Función para cargar perfil existente
async function loadExistingProfile(professionalId) {
    try {
        loading.show('Cargando perfil...');
        const response = await professionalService.getById(professionalId);
        const profile = response.data || response;
        
        // Esperar a que el DOM esté listo
        setTimeout(() => {
            fillProfileForm(profile);
        }, 200);
        
        loading.hide();
    } catch (error) {
        console.error('Error cargando perfil:', error);
        loading.hide();
    }
}

// Función para rellenar el formulario con datos existentes
function fillProfileForm(profile) {
    // Foto de perfil
    if (profile.profileImage) {
        profileImageBase64 = profile.profileImage;
        const previewImg = document.getElementById('profile-image-preview');
        if (previewImg) previewImg.src = profile.profileImage;
    }
    
    // Información básica
    const businessName = document.getElementById('business-name');
    const specialty = document.getElementById('specialty');
    const experience = document.getElementById('experience');
    const description = document.getElementById('description');
    
    if (businessName) businessName.value = profile.businessName || '';
    if (specialty && profile.specialties && profile.specialties.length > 0) {
        specialty.value = profile.specialties[0];
    }
    if (experience) experience.value = profile.experience?.years || '';
    if (description) description.value = profile.description || '';
    
    // Tipo de servicio
    const serviceType = profile.serviceLocation?.type || 'both';
    const serviceTypeRadio = document.querySelector(`input[name="service-type"][value="${serviceType}"]`);
    if (serviceTypeRadio) serviceTypeRadio.checked = true;
    
    // Dirección
    const city = document.getElementById('city');
    const state = document.getElementById('state');
    const street = document.getElementById('street');
    const serviceRadius = document.getElementById('service-radius');
    
    if (city) city.value = profile.serviceLocation?.salonAddress?.city || '';
    if (state) state.value = profile.serviceLocation?.salonAddress?.state || '';
    if (street) street.value = profile.serviceLocation?.salonAddress?.street || '';
    if (serviceRadius) serviceRadius.value = profile.serviceLocation?.serviceRadius || 10;
    
    // Contacto
    const phone = document.getElementById('phone');
    const instagram = document.getElementById('instagram');
    const website = document.getElementById('website');
    
    if (phone) phone.value = profile.contactInfo?.businessPhone || '';
    if (instagram) instagram.value = profile.contactInfo?.socialMedia?.instagram || '';
    if (website) website.value = profile.contactInfo?.website || '';
    
    // Portafolio
    if (profile.portfolio && profile.portfolio.length > 0) {
        portfolioImages = profile.portfolio;
        renderPortfolioImages();
    }
}

// Función para manejar el envío del formulario
window.handleSaveProfessionalProfile = async function(event) {
    event.preventDefault();
    
    try {
        loading.show('Guardando perfil...');
        
        const user = authService.getCurrentUser();
        
        // Recopilar datos del formulario
        const serviceType = document.querySelector('input[name="service-type"]:checked').value;
        
        const profileData = {
            profileImage: profileImageBase64, // Foto de perfil
            businessName: document.getElementById('business-name').value.trim(),
            specialties: [document.getElementById('specialty').value],
            experience: {
                years: parseInt(document.getElementById('experience').value) || 0
            },
            description: document.getElementById('description').value.trim(),
            serviceLocation: {
                type: serviceType,
                salonAddress: {
                    city: document.getElementById('city').value.trim(),
                    state: document.getElementById('state').value.trim(),
                    street: document.getElementById('street').value.trim(),
                    country: 'España'
                },
                serviceRadius: parseInt(document.getElementById('service-radius').value) || 10
            },
            contactInfo: {
                businessPhone: document.getElementById('phone').value.trim(),
                socialMedia: {
                    instagram: document.getElementById('instagram').value.trim()
                },
                website: document.getElementById('website').value.trim()
            },
            portfolio: portfolioImages
        };
        
        // Crear o actualizar perfil
        let response;
        if (user.professionalId) {
            response = await professionalService.update(user.professionalId, profileData);
        } else {
            response = await professionalService.create(profileData);
        }
        
        loading.hide();
        toast.success('Perfil guardado correctamente');
        
        // Redirigir al dashboard
        setTimeout(() => {
            window.router.navigate('/dashboard');
        }, 1500);
        
    } catch (error) {
        console.error('Error guardando perfil:', error);
        loading.hide();
        toast.error(error.message || 'Error al guardar el perfil');
    }
};

// Función para manejar el cambio de foto de perfil
window.handleProfileImageChange = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validar tamaño (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen es muy grande. Máximo 5MB');
        return;
    }
    
    // Validar tipo
    if (!file.type.startsWith('image/')) {
        toast.error('Solo se permiten archivos de imagen');
        return;
    }
    
    // Leer archivo y convertir a Base64
    const reader = new FileReader();
    reader.onload = function(e) {
        profileImageBase64 = e.target.result;
        document.getElementById('profile-image-preview').src = e.target.result;
        toast.success('Foto de perfil cargada');
    };
    reader.readAsDataURL(file);
};

// Funciones para gestionar el portafolio
window.togglePortfolioForm = function() {
    const form = document.getElementById('portfolio-form');
    const button = document.getElementById('btn-add-portfolio');
    
    if (form.classList.contains('hidden')) {
        // Mostrar formulario
        form.classList.remove('hidden');
        button.classList.add('hidden');
        // Limpiar campos
        document.getElementById('portfolio-title').value = '';
        document.getElementById('portfolio-category').value = '';
        document.getElementById('portfolio-url').value = '';
        // Resetear a método URL por defecto
        currentUploadMethod = 'url';
        currentFileBase64 = null;
        switchUploadMethod('url');
        clearFilePreview();
        document.getElementById('url-preview').classList.add('hidden');
        // Scroll suave al formulario
        form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        // Ocultar formulario
        form.classList.add('hidden');
        button.classList.remove('hidden');
    }
};

window.closePortfolioForm = function() {
    document.getElementById('portfolio-form').classList.add('hidden');
    document.getElementById('btn-add-portfolio').classList.remove('hidden');
    
    // Limpiar TODOS los campos del formulario
    document.getElementById('portfolio-title').value = '';
    document.getElementById('portfolio-category').value = '';
    document.getElementById('portfolio-description').value = '';
    document.getElementById('portfolio-url').value = '';
    document.getElementById('url-preview').classList.add('hidden');
    clearFilePreview();
};

// Variable global para el método de carga actual y la imagen en Base64
let currentUploadMethod = 'url';
let currentFileBase64 = null;

// Cambiar entre métodos de carga
window.switchUploadMethod = function(method) {
    currentUploadMethod = method;
    const urlSection = document.getElementById('url-section');
    const fileSection = document.getElementById('file-section');
    const btnUrl = document.getElementById('btn-method-url');
    const btnFile = document.getElementById('btn-method-file');
    
    if (method === 'url') {
        urlSection.classList.remove('hidden');
        fileSection.classList.add('hidden');
        btnUrl.className = 'p-4 border-2 border-purple-500 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors';
        btnFile.className = 'p-4 border-2 border-gray-300 rounded-lg text-center hover:bg-gray-50 transition-colors';
        btnUrl.querySelector('.fas').className = 'fas fa-link text-2xl text-purple-600 mb-2';
        btnFile.querySelector('.fas').className = 'fas fa-upload text-2xl text-gray-400 mb-2';
        currentFileBase64 = null;
    } else {
        urlSection.classList.add('hidden');
        fileSection.classList.remove('hidden');
        btnFile.className = 'p-4 border-2 border-purple-500 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors';
        btnUrl.className = 'p-4 border-2 border-gray-300 rounded-lg text-center hover:bg-gray-50 transition-colors';
        btnFile.querySelector('.fas').className = 'fas fa-upload text-2xl text-purple-600 mb-2';
        btnUrl.querySelector('.fas').className = 'fas fa-link text-2xl text-gray-400 mb-2';
    }
};

// Vista previa de archivo
window.previewFile = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validar tamaño (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen es muy grande. Máximo 5MB');
        return;
    }
    
    // Validar tipo
    if (!file.type.startsWith('image/')) {
        toast.error('Solo se permiten archivos de imagen');
        return;
    }
    
    // Leer archivo y convertir a Base64
    const reader = new FileReader();
    reader.onload = function(e) {
        currentFileBase64 = e.target.result;
        document.getElementById('file-preview-img').src = e.target.result;
        document.getElementById('file-preview').classList.remove('hidden');
    };
    reader.readAsDataURL(file);
};

// Limpiar vista previa de archivo
window.clearFilePreview = function() {
    document.getElementById('portfolio-file').value = '';
    document.getElementById('file-preview').classList.add('hidden');
    document.getElementById('file-preview-img').src = '';
    currentFileBase64 = null;
};

// Vista previa de URL (opcional, para verificar que funciona)
document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('portfolio-url');
    if (urlInput) {
        urlInput.addEventListener('blur', function() {
            const url = this.value.trim();
            if (url && url.startsWith('http')) {
                document.getElementById('url-preview-img').src = url;
                document.getElementById('url-preview').classList.remove('hidden');
            }
        });
    }
});

window.addPortfolioImage = function() {
    const title = document.getElementById('portfolio-title').value.trim();
    const category = document.getElementById('portfolio-category').value;
    const description = document.getElementById('portfolio-description').value.trim();
    
    let imageUrl = '';
    
    // Determinar la URL según el método
    if (currentUploadMethod === 'url') {
        imageUrl = document.getElementById('portfolio-url').value.trim();
        if (!imageUrl) {
            toast.error('Por favor ingresa una URL de imagen');
            return;
        }
    } else {
        // Usar Base64
        if (!currentFileBase64) {
            toast.error('Por favor selecciona un archivo');
            return;
        }
        imageUrl = currentFileBase64;
    }
    
    if (!title || !category) {
        toast.error('Por favor completa los campos obligatorios');
        return;
    }
    
    // Agregar imagen al array
    portfolioImages.push({
        title,
        category,
        imageUrl,
        description,
        date: new Date()
    });
    
    // Renderizar imágenes
    renderPortfolioImages();
    
    // Cerrar formulario y mostrar mensaje
    closePortfolioForm();
    toast.success('Imagen agregada al portafolio');
};

window.removePortfolioImage = function(index) {
    if (confirm('¿Estás seguro de eliminar esta imagen del portafolio?')) {
        portfolioImages.splice(index, 1);
        renderPortfolioImages();
        toast.success('Imagen eliminada');
    }
};

function renderPortfolioImages() {
    const container = document.getElementById('portfolio-container');
    if (!container) return;
    
    if (portfolioImages.length === 0) {
        container.innerHTML = '<p class="text-sm text-gray-500 col-span-full text-center py-4">No hay imágenes en el portafolio aún</p>';
        return;
    }
    
    container.innerHTML = portfolioImages.map((img, index) => `
        <div class="relative group">
            <img src="${img.imageUrl}" alt="${img.title}" 
                 class="w-full h-40 object-cover rounded-lg">
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                <button onclick="removePortfolioImage(${index})" 
                        class="opacity-0 group-hover:opacity-100 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-all">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 rounded-b-lg">
                <p class="text-white text-sm font-medium truncate">${img.title}</p>
                <p class="text-white text-xs opacity-75">${img.category}</p>
            </div>
        </div>
    `).join('');
}

// Mostrar/ocultar sección de dirección según tipo de servicio
document.addEventListener('change', (e) => {
    if (e.target.name === 'service-type') {
        const value = e.target.value;
        const salonSection = document.getElementById('salon-address-section');
        const radiusSection = document.getElementById('service-radius-section');
        
        if (value === 'home_service') {
            salonSection?.classList.add('hidden');
            radiusSection?.classList.remove('hidden');
        } else {
            salonSection?.classList.remove('hidden');
            if (value === 'both') {
                radiusSection?.classList.remove('hidden');
            } else {
                radiusSection?.classList.add('hidden');
            }
        }
    }
});
