import { authService } from '../services/apiService.js';

export function renderLoginPage() {
    setTimeout(() => setupLoginForm(), 100);
    
    return `
        <div class="min-h-screen bg-gradient-mediterranean flex items-center justify-center py-12 px-4">
            <div class="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
                <button onclick="router.navigate('/')" 
                        class="flex items-center text-gray-600 hover:text-aegean-600 transition-colors mb-6">
                    <i class="fas fa-arrow-left mr-2"></i>
                    <span class="text-sm font-medium">Volver al inicio</span>
                </button>
                
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-serif font-bold text-aegean-600 mb-2">Iniciar sesión</h2>
                    <p class="text-gray-600">Accede a tu cuenta de <span class="text-olive-gold-600 font-serif font-semibold">Kalos</span></p>
                </div>
                
                <form id="loginForm" class="space-y-6">
                    <div>
                        <label class="form-label">Email</label>
                        <input id="email" name="email" type="email" required 
                               class="form-input" placeholder="tu@email.com">
                    </div>
                    <div>
                        <label class="form-label">Contraseña</label>
                        <input id="password" name="password" type="password" required 
                               class="form-input" placeholder="Tu contraseña">
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" 
                                   class="h-4 w-4 rounded border-marble-300">
                            <label for="remember-me" class="ml-2 text-sm text-gray-900">
                                Recordarme
                            </label>
                        </div>
                        <div class="text-sm">
                            <a href="#" class="nav-link">¿Olvidaste tu contraseña?</a>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn-primary w-full">
                        <i class="fas fa-sign-in-alt mr-2"></i>
                        Iniciar sesión
                    </button>
                    
                    <div class="text-center">
                        <p class="text-sm text-gray-600">
                            ¿No tienes cuenta? 
                            <button type="button" onclick="router.navigate('/auth/register')" class="text-olive-gold-600 hover:text-olive-gold-700 font-medium">
                                Regístrate aquí
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    `;
}

export function renderRegisterPage() {
    setTimeout(() => setupRegisterForm(), 100);
    
    return `
        <div class="min-h-screen bg-gradient-mediterranean flex items-center justify-center py-12 px-4">
            <div class="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
                <button onclick="router.navigate('/')" 
                        class="flex items-center text-gray-600 hover:text-aegean-600 transition-colors mb-6">
                    <i class="fas fa-arrow-left mr-2"></i>
                    <span class="text-sm font-medium">Volver al inicio</span>
                </button>
                
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-serif font-bold text-aegean-600 mb-2">Crear cuenta</h2>
                    <p class="text-gray-600">Únete a la comunidad de <span class="text-olive-gold-600 font-serif font-semibold">Kalos</span></p>
                </div>
                
                <form id="registerForm" class="space-y-6">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="form-label">Nombre</label>
                            <input id="firstName" name="firstName" type="text" required 
                                   class="form-input" placeholder="Juan">
                        </div>
                        <div>
                            <label class="form-label">Apellido</label>
                            <input id="lastName" name="lastName" type="text" required 
                                   class="form-input" placeholder="Pérez">
                        </div>
                    </div>
                    <div>
                        <label class="form-label">Email</label>
                        <input id="email" name="email" type="email" required 
                               class="form-input" placeholder="tu@email.com">
                    </div>
                    <div>
                        <label class="form-label">Contraseña</label>
                        <input id="password" name="password" type="password" required 
                               class="form-input" placeholder="Mínimo 8 caracteres">
                    </div>
                    <div>
                        <label class="form-label">Confirmar contraseña</label>
                        <input id="confirmPassword" name="confirmPassword" type="password" required 
                               class="form-input" placeholder="Repite tu contraseña">
                    </div>
                    <div>
                        <label class="form-label">Tipo de cuenta</label>
                        <select id="accountType" name="accountType" class="form-input" required>
                            <option value="">Selecciona una opción</option>
                            <option value="client">Cliente</option>
                            <option value="professional">Profesional</option>
                        </select>
                    </div>
                    
                    <div class="flex items-center">
                        <input id="terms" name="terms" type="checkbox" required
                               class="h-4 w-4 rounded border-marble-300">
                        <label for="terms" class="ml-2 text-sm text-gray-900">
                            Acepto los términos y condiciones
                        </label>
                    </div>
                    
                    <button type="submit" class="btn-primary w-full">
                        <i class="fas fa-user-plus mr-2"></i>
                        Crear cuenta
                    </button>
                    
                    <div class="text-center">
                        <p class="text-sm text-gray-600">
                            ¿Ya tienes cuenta? 
                            <button type="button" onclick="router.navigate('/auth/login')" class="text-olive-gold-600 hover:text-olive-gold-700 font-medium">
                                Inicia sesión
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function setupLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (!email || !password) {
            alert('Por favor completa todos los campos');
            return;
        }

        try {
            const response = await authService.login({ email, password });
            
            if (response.success) {
                alert('¡Bienvenido de vuelta!');
                
                // Redirigir según el rol del usuario
                const user = authService.getCurrentUser();
                if (user.role === 'professional') {
                    router.navigate('/dashboard');
                } else {
                    router.navigate('/');
                }
            } else {
                alert(response.message || 'Credenciales incorrectas');
            }
        } catch (error) {
            console.error('Error en login:', error);
            
            let errorMessage = 'Error al iniciar sesión. Por favor intenta de nuevo.';
            
            // La estructura del error ahora es: {status, message, errors}
            if (error.message) {
                errorMessage = error.message;
            }
            
            // Mostrar detalles de errores de validación si existen
            if (error.errors && error.errors.length > 0) {
                const details = error.errors.map(e => e.msg || e.message).join('\n');
                errorMessage += '\n\n' + details;
            }
            
            alert(errorMessage);
        }
    });
}

function setupRegisterForm() {
    const form = document.getElementById('registerForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
        
        if (password.length < 8) {
            alert('La contraseña debe tener al menos 8 caracteres');
            return;
        }
        
        if (!document.getElementById('terms').checked) {
            alert('Debes aceptar los términos y condiciones');
            return;
        }

        try {
            const formData = new FormData(form);
            const userData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                password: formData.get('password'),
                role: formData.get('accountType')
            };
            
            // Crear el campo 'name' combinando firstName y lastName para compatibilidad
            userData.name = `${userData.firstName} ${userData.lastName}`;

            const response = await authService.register(userData);
            
            if (response.success) {
                alert('¡Cuenta creada exitosamente!');
                
                // Redirigir según el rol
                const userRole = userData.role;
                if (userRole === 'professional') {
                    router.navigate('/dashboard');
                } else {
                    router.navigate('/');
                }
            } else {
                alert(response.message || 'Error al crear la cuenta');
            }
        } catch (error) {
            console.error('Error en registro:', error);
            
            let errorMessage = 'Error al crear la cuenta. Por favor intenta de nuevo.';
            
            // La estructura del error ahora es: {status, message, errors}
            if (error.message) {
                errorMessage = error.message;
            }
            
            // Mostrar detalles de errores de validación si existen
            if (error.errors && error.errors.length > 0) {
                const details = error.errors.map(e => e.msg || e.message).join('\n');
                errorMessage += '\n\n' + details;
            }
            
            alert(errorMessage);
        }
    });
}
