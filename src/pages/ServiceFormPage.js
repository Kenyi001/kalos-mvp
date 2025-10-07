import state from '../services/state.js';
import { authService, serviceService, loading, toast } from '../services/apiService.js';

export function renderServiceFormPage() {
    // Verificar autenticación usando authService
    if (!authService.isAuthenticated()) {
        return `
            <div class="min-h-screen flex items-center justify-center bg-gray-50">
                <div class="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
                    <i class="fas fa-lock text-4xl text-purple-600 mb-4"></i>
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">Inicia sesión para continuar</h2>
                    <p class="text-gray-600 mb-6">Accede a tu cuenta para gestionar tus servicios</p>
                    <button onclick="router.navigate('/auth/login')" 
                            class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                        Iniciar sesión
                    </button>
                </div>
            </div>
        `;
    }

    const user = authService.getCurrentUser();
    if (!user || user.role !== 'professional') {
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

    // Obtener parámetros de la URL si es edición
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('edit');
    const isEdit = !!serviceId;
    
    // Si es edición, cargar el servicio desde el backend
    if (isEdit) {
        loadServiceForEdit(serviceId);
    }

    const pageTitle = isEdit ? 'Editar Servicio' : 'Crear Nuevo Servicio';

    return `
        <div class="bg-gray-50 min-h-screen">
            <!-- Header -->
            <div class="bg-white border-b border-gray-200">
                <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <button onclick="router.navigate('/pro/services')" 
                                    class="text-gray-400 hover:text-gray-600 mr-4">
                                <i class="fas fa-arrow-left text-xl"></i>
                            </button>
                            <div>
                                <h1 class="text-3xl font-bold text-gray-900">${pageTitle}</h1>
                                <p class="text-gray-600 mt-1">Completa la información de tu servicio personalizado</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Formulario -->
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form id="service-form" onsubmit="handleServiceFormSubmit(event, ${isEdit ? `'${serviceId}'` : 'null'})">
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div class="p-6">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <!-- Columna Izquierda - Información Básica -->
                                <div class="space-y-6">
                                    <div class="bg-blue-50 rounded-lg p-4">
                                        <h3 class="flex items-center text-lg font-semibold text-gray-900">
                                            <i class="fas fa-info-circle text-blue-600 mr-2"></i>
                                            Información Básica
                                        </h3>
                                    </div>

                                    <!-- Nombre del servicio -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">
                                            Nombre del servicio *
                                        </label>
                                        <input type="text" id="service-name" required 
                                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                               placeholder="Ej: Corte premium personalizado">
                                    </div>

                                    <!-- Categoría y Dificultad -->
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                                Categoría *
                                            </label>
                                            <select id="service-category" required
                                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                                                <option value="">Selecciona una categoría</option>
                                                <optgroup label="Cabello">
                                                    <option value="corte_cabello">Corte de Cabello</option>
                                                    <option value="peinado">Peinado</option>
                                                    <option value="coloracion">Coloración</option>
                                                    <option value="tratamiento_capilar">Tratamiento Capilar</option>
                                                </optgroup>
                                                <optgroup label="Uñas">
                                                    <option value="manicura">Manicura</option>
                                                    <option value="pedicura">Pedicura</option>
                                                    <option value="unas_gel">Uñas de Gel</option>
                                                    <option value="unas_acrilicas">Uñas Acrílicas</option>
                                                </optgroup>
                                                <optgroup label="Facial">
                                                    <option value="facial_limpieza">Limpieza Facial</option>
                                                    <option value="facial_hidratante">Facial Hidratante</option>
                                                    <option value="facial_antiedad">Facial Antiedad</option>
                                                </optgroup>
                                                <optgroup label="Depilación">
                                                    <option value="depilacion_cera">Depilación con Cera</option>
                                                    <option value="depilacion_laser">Depilación Láser</option>
                                                </optgroup>
                                                <optgroup label="Masajes">
                                                    <option value="masaje_relajante">Masaje Relajante</option>
                                                    <option value="masaje_descontracturante">Masaje Descontracturante</option>
                                                </optgroup>
                                                <optgroup label="Maquillaje">
                                                    <option value="maquillaje_dia">Maquillaje de Día</option>
                                                    <option value="maquillaje_noche">Maquillaje de Noche</option>
                                                    <option value="maquillaje_novias">Maquillaje de Novias</option>
                                                </optgroup>
                                                <optgroup label="Otros">
                                                    <option value="cejas_pestanas">Cejas y Pestañas</option>
                                                    <option value="otro">Otro</option>
                                                </optgroup>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                                Nivel de dificultad
                                            </label>
                                            <select id="service-difficulty"
                                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                                                <option value="Básico">Básico</option>
                                                <option value="Intermedio">Intermedio</option>
                                                <option value="Avanzado">Avanzado</option>
                                                <option value="Experto">Experto</option>
                                            </select>
                                        </div>
                                    </div>

                                    <!-- Descripción -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">
                                            Descripción del servicio
                                        </label>
                                        <textarea id="service-description" rows="4"
                                                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                                  placeholder="Describe tu servicio, técnicas utilizadas, beneficios, etc."></textarea>
                                    </div>
                                </div>

                                <!-- Columna Derecha - Precios y Detalles -->
                                <div class="space-y-6">
                                    <div class="bg-purple-50 rounded-lg p-4">
                                        <h3 class="flex items-center text-lg font-semibold text-gray-900">
                                            <i class="fas fa-euro-sign text-purple-600 mr-2"></i>
                                            Precios y Duración
                                        </h3>
                                    </div>

                                    <!-- Precios -->
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                                Precio mínimo (€) *
                                            </label>
                                            <input type="number" id="service-price-min" required min="5" max="500" 
                                                   oninput="if(window.updateAveragePrice) window.updateAveragePrice()"
                                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                   placeholder="25">
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                                Precio máximo (€) *
                                            </label>
                                            <input type="number" id="service-price-max" required min="5" max="500" 
                                                   oninput="if(window.updateAveragePrice) window.updateAveragePrice()"
                                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                   placeholder="60">
                                        </div>
                                    </div>

                                    <!-- Duración -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">
                                            Duración estimada *
                                        </label>
                                        <input type="text" id="service-duration" required 
                                               
                                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                               placeholder="Ej: 45 min, 1h 30min, 2-3h">
                                    </div>

                                    <!-- Ubicación del Servicio -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-3">
                                            <i class="fas fa-map-marker-alt text-purple-600 mr-2"></i>
                                            ¿Dónde ofreces este servicio? *
                                        </label>
                                        <div class="space-y-3">
                                            <label class="flex items-start p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                                                <input type="radio" name="service-location" value="salon" required
                                                       class="mt-1 text-purple-600 focus:ring-purple-500">
                                                <div class="ml-3">
                                                    <div class="font-medium text-gray-900">Solo en salón</div>
                                                    <div class="text-sm text-gray-500">El cliente debe acudir a tu establecimiento</div>
                                                </div>
                                            </label>
                                            <label class="flex items-start p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                                                <input type="radio" name="service-location" value="home" required
                                                       class="mt-1 text-purple-600 focus:ring-purple-500">
                                                <div class="ml-3">
                                                    <div class="font-medium text-gray-900">Solo a domicilio</div>
                                                    <div class="text-sm text-gray-500">Te desplazas al domicilio del cliente</div>
                                                </div>
                                            </label>
                                            <label class="flex items-start p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                                                <input type="radio" name="service-location" value="both" checked required
                                                       class="mt-1 text-purple-600 focus:ring-purple-500">
                                                <div class="ml-3">
                                                    <div class="font-medium text-gray-900">Salón y domicilio</div>
                                                    <div class="text-sm text-gray-500">Ofrezco ambas opciones según las necesidades del cliente</div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <!-- Precio Promedio -->
                                    <div class="bg-gray-50 rounded-lg p-6">
                                        <div class="text-center">
                                            <p class="text-sm text-gray-600 mb-2">Precio Promedio</p>
                                            <p class="text-4xl font-bold text-purple-600" id="average-price-display">0€</p>
                                            <p class="text-xs text-gray-500 mt-2">Calculado automáticamente</p>
                                        </div>
                                    </div>

                                    <!-- Qué incluye -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-3">
                                            ¿Qué incluye este servicio?
                                        </label>
                                        <div class="bg-gray-50 rounded-lg p-4">
                                            <div class="mb-4">
                                                <div class="flex items-center mb-2">
                                                    <i class="fas fa-lightbulb text-amber-500 mr-2"></i>
                                                    <span class="text-sm font-medium text-gray-700">Consejos para precios:</span>
                                                </div>
                                                <p class="text-xs text-gray-600">Investiga competidores, considera tu experiencia e incluye costos de materiales</p>
                                            </div>
                                            <div id="includes-container" class="space-y-2">
                                                <div class="flex items-center gap-2">
                                                    <input type="text" 
                                                           class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                                                           placeholder="Ej: Lavado, Corte, Secado">
                                                    <button type="button" onclick="removeInclude(this)" 
                                                            class="text-red-500 hover:text-red-700 transition-colors p-2">
                                                        <i class="fas fa-trash text-sm"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <button type="button" onclick="addInclude()" 
                                                    class="mt-3 text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors">
                                                <i class="fas fa-plus mr-1"></i>
                                                Agregar elemento
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Botones -->
                        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <div class="flex flex-col sm:flex-row justify-end gap-3">
                                <button type="button" onclick="router.navigate('/pro/services')" 
                                        class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-white font-medium transition-colors">
                                    Cancelar
                                </button>
                                <button type="submit" 
                                        class="px-8 py-3 bg-primary text-white rounded-lg hover:bg-purple-700 font-medium transition-colors shadow-sm">
                                    ${isEdit ? 'Guardar cambios' : 'Crear servicio'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Inicializar calculadora de precios después de renderizar
    setTimeout(() => {
        if (window.initializePriceCalculator) {
            window.initializePriceCalculator();
        }
    }, 100);
}

// Observador para detectar cuando se agrega el formulario al DOM
if (typeof window !== 'undefined' && typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
        const priceMinInput = document.getElementById('service-price-min');
        if (priceMinInput && !priceMinInput.dataset.initialized) {
            priceMinInput.dataset.initialized = 'true';
            if (window.initializePriceCalculator) {
                window.initializePriceCalculator();
            }
        }
    });
    
    // Observar cambios en el body
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// Función para manejar el envío del formulario
window.handleServiceFormSubmit = async function(event, serviceId = null) {
    event.preventDefault();
    
    try {
        loading.show('Guardando servicio...');
        
        // Obtener usuario actual
        const user = authService.getCurrentUser();
        if (!user || user.role !== 'professional') {
            toast.error('Debes tener un perfil profesional para crear servicios');
            loading.hide();
            return;
        }
        
        // Recopilar datos del formulario
        const priceMin = parseFloat(document.getElementById('service-price-min').value) || 0;
        const priceMax = parseFloat(document.getElementById('service-price-max').value) || 0;
        const basePrice = Math.round((priceMin + priceMax) / 2);
        const durationValue = parseInt(document.getElementById('service-duration').value) || 60;
        
        // Obtener ubicación del servicio
        const locationRadio = document.querySelector('input[name="service-location"]:checked');
        const serviceLocation = locationRadio ? locationRadio.value : 'both';
        
        const formData = {
            name: document.getElementById('service-name').value.trim(),
            category: document.getElementById('service-category').value,
            description: document.getElementById('service-description').value.trim(),
            pricing: {
                basePrice: Number(basePrice),
                priceRange: {
                    min: Number(priceMin),
                    max: Number(priceMax)
                }
            },
            duration: {
                estimated: Number(durationValue)
            },
            serviceConfig: {
                location: serviceLocation, // Ubicación seleccionada por el usuario
                requiresDeposit: false
            },
            isCustom: true,
            isActive: true,
            // El professional se asigna automáticamente en el backend usando el token JWT
        };
        
        // Validaciones básicas
        if (!formData.name) {
            toast.error('El nombre del servicio es requerido');
            loading.hide();
            return;
        }
        
        if (!formData.description) {
            toast.error('La descripción del servicio es requerida');
            loading.hide();
            return;
        }
        
        if (priceMin <= 0 || priceMax <= 0) {
            toast.error('Los precios deben ser mayores a 0');
            loading.hide();
            return;
        }
        
        if (priceMin > priceMax) {
            toast.error('El precio mínimo no puede ser mayor al precio máximo');
            loading.hide();
            return;
        }
        
        console.log('📤 Datos del servicio a enviar:', formData);
        console.log('📤 Datos detallados:', JSON.stringify(formData, null, 2));
        
        if (serviceId) {
            // Editar servicio existente
            await serviceService.update(serviceId, formData);
            toast.success('Servicio actualizado exitosamente');
        } else {
            // Crear nuevo servicio
            const response = await serviceService.create(formData);
            console.log('✅ Servicio creado:', response);
            toast.success('Servicio creado exitosamente');
        }
        
        loading.hide();
        
        // Redirigir de vuelta a la página de servicios después de un breve delay
        setTimeout(() => {
            window.router.navigate('/pro/services');
        }, 1000);
        
    } catch (error) {
        loading.hide();
        console.error('❌ Error guardando servicio:', error);
        
        // Mostrar detalles específicos del error de validación
        if (error.errors && Array.isArray(error.errors)) {
            console.error('❌ Errores de validación:', error.errors);
            const errorMessages = error.errors.map(e => `${e.field || e.param}: ${e.message}`).join('\n');
            toast.error(`Errores de validación:\n${errorMessages}`);
        } else {
            toast.error(error.message || 'Error al guardar el servicio');
        }
    }
};

// Función para agregar un elemento a "qué incluye"
window.addInclude = function() {
    const container = document.getElementById('includes-container');
    const newInclude = document.createElement('div');
    newInclude.className = 'flex items-center gap-2';
    newInclude.innerHTML = `
        <input type="text" 
               class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
               placeholder="Ej: Lavado, Corte, Secado">
        <button type="button" onclick="removeInclude(this)" 
                class="text-red-500 hover:text-red-700 transition-colors p-2">
            <i class="fas fa-trash text-sm"></i>
        </button>
    `;
    container.appendChild(newInclude);
};

// Función para remover un elemento de "qué incluye"
window.removeInclude = function(button) {
    const container = document.getElementById('includes-container');
    if (container.children.length > 1) {
        button.parentElement.remove();
    }
};

// Función para asegurar que el scroll esté habilitado
function ensureScrollEnabled() {
    document.body.style.overflow = '';
    document.body.style.overflowY = '';
    document.documentElement.style.overflow = '';
    document.documentElement.style.overflowY = '';
}

// Inicializar cálculo de precio promedio cuando se carga la página
ensureScrollEnabled();

// Función para inicializar el cálculo de precio promedio
window.initializePriceCalculator = function() {
    const priceMinInput = document.getElementById('service-price-min');
    const priceMaxInput = document.getElementById('service-price-max');
    const averagePriceDisplay = document.getElementById('average-price-display');
    
    if (!priceMinInput || !priceMaxInput || !averagePriceDisplay) {
        return;
    }
    
    window.updateAveragePrice = function() {
        const min = parseFloat(priceMinInput.value) || 0;
        const max = parseFloat(priceMaxInput.value) || 0;
        
        // Calcular promedio solo si ambos valores están presentes
        if (min > 0 && max > 0) {
            const average = Math.round((min + max) / 2);
            averagePriceDisplay.textContent = `${average}€`;
            averagePriceDisplay.classList.remove('text-gray-400');
            averagePriceDisplay.classList.add('text-purple-600');
        } else if (min > 0 || max > 0) {
            // Si solo hay un valor, mostrarlo
            const value = min || max;
            averagePriceDisplay.textContent = `${value}€`;
            averagePriceDisplay.classList.remove('text-gray-400');
            averagePriceDisplay.classList.add('text-purple-600');
        } else {
            // Si no hay valores, mostrar 0
            averagePriceDisplay.textContent = '0€';
            averagePriceDisplay.classList.remove('text-purple-600');
            averagePriceDisplay.classList.add('text-gray-400');
        }
    };
    
    // Agregar listeners para actualizar en tiempo real
    priceMinInput.addEventListener('input', window.updateAveragePrice);
    priceMaxInput.addEventListener('input', window.updateAveragePrice);
    priceMinInput.addEventListener('change', window.updateAveragePrice);
    priceMaxInput.addEventListener('change', window.updateAveragePrice);
    
    // Calcular precio inicial
    window.updateAveragePrice();
};

// Función para cargar servicio para edición
async function loadServiceForEdit(serviceId) {
    try {
        console.log('🔄 Cargando servicio para editar:', serviceId);
        loading.show('Cargando servicio...');
        
        const service = await serviceService.getById(serviceId);
        console.log('✅ Servicio cargado:', service);
        
        loading.hide();
        
        // Esperar a que el DOM esté listo
        setTimeout(() => {
            fillFormWithServiceData(service);
        }, 200);
        
    } catch (error) {
        console.error('❌ Error cargando servicio:', error);
        loading.hide();
        toast.error('Error al cargar el servicio');
        setTimeout(() => {
            window.router.navigate('/pro/services');
        }, 2000);
    }
}

// Función para rellenar el formulario con datos del servicio
function fillFormWithServiceData(response) {
    console.log('📝 Rellenando formulario con:', response);
    
    // Extraer el servicio de la respuesta
    const service = response.data || response;
    
    // Datos básicos
    const nameInput = document.getElementById('service-name');
    const categorySelect = document.getElementById('service-category');
    const descriptionTextarea = document.getElementById('service-description');
    
    if (nameInput) nameInput.value = service.name || '';
    if (categorySelect) categorySelect.value = service.category || '';
    if (descriptionTextarea) descriptionTextarea.value = service.description || '';
    
    // Precios
    const priceMinInput = document.getElementById('service-price-min');
    const priceMaxInput = document.getElementById('service-price-max');
    
    if (priceMinInput && service.pricing?.priceRange?.min) {
        priceMinInput.value = service.pricing.priceRange.min;
    }
    if (priceMaxInput && service.pricing?.priceRange?.max) {
        priceMaxInput.value = service.pricing.priceRange.max;
    }
    
    // Duración
    const durationInput = document.getElementById('service-duration');
    if (durationInput && service.duration?.estimated) {
        durationInput.value = service.duration.estimated;
    }
    
    // Ubicación del servicio
    const location = service.serviceConfig?.location || 'both';
    const locationRadio = document.querySelector(`input[name="service-location"][value="${location}"]`);
    if (locationRadio) {
        locationRadio.checked = true;
    }
    
    // Actualizar precio promedio después de rellenar los campos
    setTimeout(() => {
        if (window.initializePriceCalculator) {
            window.initializePriceCalculator();
        }
    }, 100);
    
    console.log('✅ Formulario rellenado correctamente');
}