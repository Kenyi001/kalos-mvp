// Estado global simple de la aplicación
class AppState {
    constructor() {
        this.user = null;
        this.professionals = [];
        this.services = [];
        this.bookings = [];
        this.listeners = {};
        this.init();
    }

    init() {
        // Cargar datos iniciales mock para el MVP
        this.loadMockData();
        
        // Verificar si hay usuario logueado en localStorage
        // Priorizar 'user' (usado por authService) sobre 'kalos_user'
        const savedUser = localStorage.getItem('user') || localStorage.getItem('kalos_user');
        if (savedUser) {
            this.user = JSON.parse(savedUser);
            console.log('Usuario cargado del localStorage:', this.user);
        } else {
            console.log('No hay usuario guardado en localStorage');
        }
    }

    // Sistema simple de eventos
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }

    // Gestión de usuario
    setUser(userData) {
        this.user = userData;
        localStorage.setItem('kalos_user', JSON.stringify(userData));
        localStorage.setItem('user', JSON.stringify(userData)); // Para compatibilidad con authService
        this.emit('userChanged', userData);
        console.log('State actualizado:', this.user);
    }

    logout() {
        this.user = null;
        localStorage.removeItem('kalos_user');
        localStorage.removeItem('user'); // También remover la clave 'user' para compatibilidad
        this.emit('userChanged', null);
    }

    isAuthenticated() {
        return this.user !== null;
    }

    isProfessional() {
        return this.user && (this.user.role === 'professional' || this.user.type === 'professional');
    }

    // Datos mock para el MVP
    loadMockData() {
        // Cargar usuarios de prueba
        this.loadMockUsers();
        
        // Cargar profesionales con más variedad
        this.professionals = [
            // Peluquería - Alta gama
            {
                id: '1',
                name: 'Sofia Rodriguez',
                specialty: 'Peluquería',
                rating: 4.9,
                reviews: 234,
                image: 'https://images.unsplash.com/photo-1594824694996-f6be2c4b5b77?w=400',
                services: ['Corte premium', 'Coloración avanzada', 'Tratamientos capilares', 'Peinados especiales'],
                price_range: '€45-120',
                location: 'Madrid Centro',
                available: true,
                description: 'Estilista senior especializada en técnicas europeas. 12 años perfeccionando el arte capilar.',
                portfolio: ['Cortes pixie', 'Balayage', 'Highlights', 'Ombré'],
                certifications: ['Vidal Sassoon Academy', 'L\'Oréal Professional'],
                languages: ['Español', 'Inglés', 'Francés'],
                experience: 12,
                profile_views: 1520,
                response_time: '< 2h'
            },
            // Peluquería - Accesible
            {
                id: '2', 
                name: 'Carlos Martinez',
                specialty: 'Peluquería',
                rating: 4.6,
                reviews: 156,
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
                services: ['Corte masculino', 'Barba', 'Afeitado clásico', 'Peinados casuales'],
                price_range: '€20-45',
                location: 'Malasaña',
                available: true,
                description: 'Barbero tradicional con toque moderno. Especialista en cortes masculinos.',
                portfolio: ['Fade cuts', 'Undercuts', 'Barba clásica', 'Bigote vintage'],
                certifications: ['Escuela de Barbería Clásica'],
                languages: ['Español'],
                experience: 8,
                profile_views: 892,
                response_time: '< 4h'
            },
            // Manicura - Premiado
            {
                id: '3',
                name: 'Carmen Gutierrez', 
                specialty: 'Manicura',
                rating: 4.9,
                reviews: 189,
                image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400',
                services: ['Nail art premium', 'Manicura rusa', 'Extensiones', 'Tratamientos curativos'],
                price_range: '€30-85',
                location: 'Salamanca',
                available: true,
                description: 'Nail artist galardonada. Creadora de diseños únicos y tendencias.',
                portfolio: ['Nail art 3D', 'Cristales Swarovski', 'Manicura francesa', 'Diseños personalizados'],
                certifications: ['Master Nail Artist', 'Young Nails Certified'],
                languages: ['Español', 'Inglés'],
                experience: 10,
                profile_views: 2100,
                response_time: '< 1h'
            },
            // Manicura - Emergente
            {
                id: '4',
                name: 'Ana López',
                specialty: 'Manicura',
                rating: 4.4,
                reviews: 67,
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
                services: ['Manicura básica', 'Pedicura', 'Uñas gel', 'Diseños simples'],
                price_range: '€18-40',
                location: 'Chamberí',
                available: false,
                description: 'Joven profesional con pasión por el cuidado de uñas. Precios accesibles.',
                portfolio: ['Manicura clásica', 'Colores sólidos', 'French tips', 'Decoraciones básicas'],
                certifications: ['Certificado Profesional Manicura'],
                languages: ['Español'],
                experience: 3,
                profile_views: 340,
                response_time: '< 6h'
            },
            // Estética - Lujo
            {
                id: '5',
                name: 'Isabel Martinez',
                specialty: 'Estética',
                rating: 4.8,
                reviews: 298,
                image: 'https://images.unsplash.com/photo-1595475207225-428b62bda831?w=400',
                services: ['HydraFacial', 'Microdermoabrasión', 'Tratamientos anti-edad', 'Limpieza profunda'],
                price_range: '€60-180',
                location: 'Retiro',
                available: true,
                description: 'Esteticista holística especializada en tratamientos naturales y de alta gama.',
                portfolio: ['Hidratación profunda', 'Peeling químico', 'Masajes faciales', 'Lifting no invasivo'],
                certifications: ['CIDESCO International', 'Dermalogica Expert'],
                languages: ['Español', 'Inglés', 'Italiano'],
                experience: 15,
                profile_views: 3240,
                response_time: '< 30min'
            },
            // Estética - Wellness
            {
                id: '6',
                name: 'Patricia Morales',
                specialty: 'Estética',
                rating: 4.7,
                reviews: 143,
                image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
                services: ['Aromaterapia facial', 'Tratamientos orgánicos', 'Reflexología', 'Drenaje linfático'],
                price_range: '€40-95',
                location: 'Chueca',
                available: true,
                description: 'Terapeuta holística enfocada en bienestar integral y productos ecológicos.',
                portfolio: ['Tratamientos naturales', 'Masajes relajantes', 'Terapias alternativas', 'Productos orgánicos'],
                certifications: ['Terapia Holística Certificada', 'Aromaterapia Profesional'],
                languages: ['Español', 'Catalán'],
                experience: 9,
                profile_views: 876,
                response_time: '< 3h'
            },
            // Maquillaje - Eventos
            {
                id: '7',
                name: 'Valeria Santos',
                specialty: 'Maquillaje',
                rating: 4.9,
                reviews: 201,
                image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
                services: ['Maquillaje de novia', 'Eventos especiales', 'Editorial', 'Masterclass'],
                price_range: '€80-250',
                location: 'Las Rozas',
                available: true,
                description: 'Maquilladora profesional para bodas, eventos y sesiones fotográficas.',
                portfolio: ['Maquillaje nupcial', 'Editorial fashion', 'Eventos corporativos', 'Fotografía'],
                certifications: ['Make Up For Ever Academy', 'MAC Pro Certified'],
                languages: ['Español', 'Inglés', 'Portugués'],
                experience: 11,
                profile_views: 2890,
                response_time: '< 2h'
            },
            // Masajes - Terapéutico
            {
                id: '8',
                name: 'Roberto Fernandez',
                specialty: 'Masajes',
                rating: 4.6,
                reviews: 178,
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
                services: ['Masaje terapéutico', 'Deportivo', 'Relajante', 'Descontracturante'],
                price_range: '€45-90',
                location: 'Moncloa',
                available: false,
                description: 'Fisioterapeuta especializado en masajes terapéuticos y deportivos.',
                portfolio: ['Lesiones deportivas', 'Contracturas', 'Relajación muscular', 'Rehabilitación'],
                certifications: ['Fisioterapia Colegiada', 'Masaje Deportivo Certificado'],
                languages: ['Español', 'Inglés'],
                experience: 14,
                profile_views: 1340,
                response_time: '< 5h'
            }
        ];

        // Servicios con precios específicos y detallados
        this.services = [
            // === PELUQUERÍA ===
            {
                id: '1', 
                name: 'Corte básico mujer', 
                category: 'Peluquería', 
                price_min: 18, 
                price_max: 35, 
                price_display: '18-35€',
                duration: '30-40 min', 
                popularity: 95,
                description: 'Corte de pelo básico con lavado y secado',
                includes: ['Lavado', 'Corte', 'Secado', 'Peinado básico'],
                difficulty: 'Básico'
            },
            {
                id: '2', 
                name: 'Corte básico hombre', 
                category: 'Peluquería', 
                price_min: 12, 
                price_max: 25, 
                price_display: '12-25€',
                duration: '20-30 min', 
                popularity: 92,
                description: 'Corte masculino clásico con acabado',
                includes: ['Corte', 'Lavado', 'Secado', 'Arreglo contorno'],
                difficulty: 'Básico'
            },
            {
                id: '3', 
                name: 'Corte y peinado premium', 
                category: 'Peluquería', 
                price_min: 40, 
                price_max: 70, 
                price_display: '40-70€',
                duration: '45-60 min', 
                popularity: 78,
                description: 'Corte personalizado con peinado profesional',
                includes: ['Consulta', 'Lavado premium', 'Corte técnico', 'Peinado', 'Productos styling'],
                difficulty: 'Intermedio'
            },
            {
                id: '4', 
                name: 'Coloración completa', 
                category: 'Peluquería', 
                price_min: 65, 
                price_max: 140, 
                price_display: '65-140€',
                duration: '2-3h', 
                popularity: 67,
                description: 'Cambio de color completo del cabello',
                includes: ['Consulta color', 'Aplicación tinte', 'Lavado', 'Tratamiento', 'Secado'],
                difficulty: 'Avanzado'
            },
            {
                id: '5', 
                name: 'Mechas/Highlights', 
                category: 'Peluquería', 
                price_min: 75, 
                price_max: 120, 
                price_display: '75-120€',
                duration: '2-2.5h', 
                popularity: 82,
                description: 'Mechas californianas o highlights técnicos',
                includes: ['Consulta', 'Técnica mechas', 'Toner', 'Tratamiento', 'Peinado'],
                difficulty: 'Avanzado'
            },
            {
                id: '6', 
                name: 'Tratamiento capilar intensivo', 
                category: 'Peluquería', 
                price_min: 28, 
                price_max: 55, 
                price_display: '28-55€',
                duration: '45-60 min', 
                popularity: 54,
                description: 'Tratamiento reparador y nutritivo',
                includes: ['Diagnóstico', 'Mascarilla profesional', 'Masaje', 'Secado'],
                difficulty: 'Intermedio'
            },
            {
                id: '7', 
                name: 'Peinado para eventos', 
                category: 'Peluquería', 
                price_min: 35, 
                price_max: 85, 
                price_display: '35-85€',
                duration: '45-90 min', 
                popularity: 43,
                description: 'Peinado elegante para ocasiones especiales',
                includes: ['Diseño personalizado', 'Fijadores profesionales', 'Accesorios'],
                difficulty: 'Avanzado'
            },
            {
                id: '8', 
                name: 'Alisado/Ombré', 
                category: 'Peluquería', 
                price_min: 80, 
                price_max: 160, 
                price_display: '80-160€',
                duration: '2.5-4h', 
                popularity: 38,
                description: 'Alisado profesional u ombré degradado',
                includes: ['Consulta técnica', 'Producto profesional', 'Aplicación', 'Peinado final'],
                difficulty: 'Experto'
            },

            // === MANICURA Y PEDICURA ===
            {
                id: '9', 
                name: 'Manicura básica', 
                category: 'Manicura', 
                price_min: 15, 
                price_max: 28, 
                price_display: '15-28€',
                duration: '30-40 min', 
                popularity: 89,
                description: 'Manicura tradicional con esmaltado',
                includes: ['Limado', 'Cutículas', 'Esmaltado', 'Secado'],
                difficulty: 'Básico'
            },
            {
                id: '10', 
                name: 'Manicura gel/semipermanente', 
                category: 'Manicura', 
                price_min: 25, 
                price_max: 45, 
                price_display: '25-45€',
                duration: '45-60 min', 
                popularity: 92,
                description: 'Manicura con esmalte de larga duración',
                includes: ['Preparación', 'Base', 'Color gel', 'Top coat', 'Lámpara LED'],
                difficulty: 'Intermedio'
            },
            {
                id: '11', 
                name: 'Nail art básico', 
                category: 'Manicura', 
                price_min: 35, 
                price_max: 60, 
                price_display: '35-60€',
                duration: '60-80 min', 
                popularity: 71,
                description: 'Diseños artísticos simples en las uñas',
                includes: ['Manicura base', 'Diseño personalizado', 'Decoraciones', 'Fijador'],
                difficulty: 'Intermedio'
            },
            {
                id: '12', 
                name: 'Nail art premium', 
                category: 'Manicura', 
                price_min: 50, 
                price_max: 85, 
                price_display: '50-85€',
                duration: '90-120 min', 
                popularity: 45,
                description: 'Diseños complejos con técnicas avanzadas',
                includes: ['Diseño exclusivo', 'Cristales/Strass', 'Efectos 3D', 'Acabado profesional'],
                difficulty: 'Experto'
            },
            {
                id: '13', 
                name: 'Pedicura completa', 
                category: 'Manicura', 
                price_min: 30, 
                price_max: 55, 
                price_display: '30-55€',
                duration: '60-75 min', 
                popularity: 85,
                description: 'Cuidado completo de pies y uñas',
                includes: ['Remojo', 'Exfoliación', 'Cutículas', 'Masaje', 'Esmaltado'],
                difficulty: 'Básico'
            },
            {
                id: '14', 
                name: 'Extensiones de uñas acrílicas', 
                category: 'Manicura', 
                price_min: 40, 
                price_max: 70, 
                price_display: '40-70€',
                duration: '90-120 min', 
                popularity: 65,
                description: 'Alargamiento con acrílico y forma personalizada',
                includes: ['Preparación', 'Extensión', 'Modelado', 'Limado', 'Esmaltado'],
                difficulty: 'Avanzado'
            },
            {
                id: '15', 
                name: 'Extensiones uñas gel', 
                category: 'Manicura', 
                price_min: 45, 
                price_max: 80, 
                price_display: '45-80€',
                duration: '100-130 min', 
                popularity: 58,
                description: 'Extensiones naturales con gel de construcción',
                includes: ['Moldes', 'Gel builder', 'Modelado natural', 'Acabado perfecto'],
                difficulty: 'Avanzado'
            },

            // === ESTÉTICA FACIAL ===
            {
                id: '16', 
                name: 'Limpieza facial básica', 
                category: 'Estética', 
                price_min: 35, 
                price_max: 60, 
                price_display: '35-60€',
                duration: '60-75 min', 
                popularity: 88,
                description: 'Limpieza profunda y purificación',
                includes: ['Desmaquillado', 'Vapor', 'Extracción', 'Mascarilla', 'Hidratación'],
                difficulty: 'Básico'
            },
            {
                id: '17', 
                name: 'Limpieza facial profunda', 
                category: 'Estética', 
                price_min: 55, 
                price_max: 90, 
                price_display: '55-90€',
                duration: '90-105 min', 
                popularity: 73,
                description: 'Tratamiento intensivo con extracción completa',
                includes: ['Pre-tratamiento', 'Exfoliación', 'Vapor ozono', 'Extracción profesional', 'Mascarilla calmante', 'Protección'],
                difficulty: 'Intermedio'
            },
            {
                id: '18', 
                name: 'Tratamiento anti-edad', 
                category: 'Estética', 
                price_min: 75, 
                price_max: 160, 
                price_display: '75-160€',
                duration: '90-120 min', 
                popularity: 62,
                description: 'Protocolo anti-envejecimiento avanzado',
                includes: ['Radiofrecuencia', 'Masaje lifting', 'Sérum activo', 'Mascarilla premium'],
                difficulty: 'Avanzado'
            },
            {
                id: '19', 
                name: 'HydraFacial', 
                category: 'Estética', 
                price_min: 85, 
                price_max: 130, 
                price_display: '85-130€',
                duration: '60-75 min', 
                popularity: 58,
                description: 'Tratamiento de hidratación intensiva patentado',
                includes: ['Exfoliación líquida', 'Extracción sin dolor', 'Hidratación profunda', 'Protección antioxidante'],
                difficulty: 'Avanzado'
            },
            {
                id: '20', 
                name: 'Peeling químico', 
                category: 'Estética', 
                price_min: 60, 
                price_max: 120, 
                price_display: '60-120€',
                duration: '45-60 min', 
                popularity: 41,
                description: 'Renovación celular con ácidos profesionales',
                includes: ['Evaluación', 'Preparación', 'Aplicación ácido', 'Neutralización', 'Post-tratamiento'],
                difficulty: 'Experto'
            },
            {
                id: '21', 
                name: 'Microdermoabrasión', 
                category: 'Estética', 
                price_min: 50, 
                price_max: 85, 
                price_display: '50-85€',
                duration: '60-75 min', 
                popularity: 47,
                description: 'Exfoliación mecánica para renovación cutánea',
                includes: ['Limpieza', 'Microdermoabrasión', 'Mascarilla reparadora', 'Hidratación'],
                difficulty: 'Intermedio'
            },

            // === DEPILACIÓN ===
            {
                id: '22', 
                name: 'Depilación cera - Piernas completas', 
                category: 'Depilación', 
                price_min: 28, 
                price_max: 45, 
                price_display: '28-45€',
                duration: '45-60 min', 
                popularity: 79,
                description: 'Depilación completa de piernas con cera',
                includes: ['Preparación', 'Cera caliente', 'Post-depilación', 'Hidratación'],
                difficulty: 'Básico'
            },
            {
                id: '23', 
                name: 'Depilación cera - Axilas', 
                category: 'Depilación', 
                price_min: 10, 
                price_max: 18, 
                price_display: '10-18€',
                duration: '15-20 min', 
                popularity: 86,
                description: 'Depilación rápida y efectiva de axilas',
                includes: ['Limpieza', 'Cera tibia', 'Calmante'],
                difficulty: 'Básico'
            },
            {
                id: '24', 
                name: 'Depilación cera - Zona bikini', 
                category: 'Depilación', 
                price_min: 20, 
                price_max: 35, 
                price_display: '20-35€',
                duration: '30-40 min', 
                popularity: 73,
                description: 'Depilación íntima parcial o completa',
                includes: ['Higienización', 'Cera específica', 'Tratamiento calmante'],
                difficulty: 'Intermedio'
            },
            {
                id: '25', 
                name: 'Depilación cera - Rostro', 
                category: 'Depilación', 
                price_min: 12, 
                price_max: 25, 
                price_display: '12-25€',
                duration: '20-30 min', 
                popularity: 68,
                description: 'Depilación facial: cejas, labio, barbilla',
                includes: ['Diseño cejas', 'Cera facial', 'Pinzas acabado', 'Calmante'],
                difficulty: 'Intermedio'
            },
            {
                id: '26', 
                name: 'Depilación láser - Consulta', 
                category: 'Depilación', 
                price_min: 0, 
                price_max: 0, 
                price_display: 'Gratuita',
                duration: '30 min', 
                popularity: 67,
                description: 'Evaluación gratuita para tratamiento láser',
                includes: ['Evaluación piel', 'Plan tratamiento', 'Prueba parche', 'Presupuesto'],
                difficulty: 'Consulta'
            },

            // === MAQUILLAJE ===
            {
                id: '27', 
                name: 'Maquillaje día natural', 
                category: 'Maquillaje', 
                price_min: 35, 
                price_max: 55, 
                price_display: '35-55€',
                duration: '45-60 min', 
                popularity: 68,
                description: 'Maquillaje sutil para el día a día',
                includes: ['Preparación piel', 'Base natural', 'Correcciones', 'Acabado mate'],
                difficulty: 'Básico'
            },
            {
                id: '28', 
                name: 'Maquillaje noche/eventos', 
                category: 'Maquillaje', 
                price_min: 60, 
                price_max: 95, 
                price_display: '60-95€',
                duration: '60-75 min', 
                popularity: 75,
                description: 'Maquillaje glamoroso para ocasiones especiales',
                includes: ['Look personalizado', 'Técnicas avanzadas', 'Fijación larga duración', 'Retoques'],
                difficulty: 'Intermedio'
            },
            {
                id: '29', 
                name: 'Maquillaje de novia', 
                category: 'Maquillaje', 
                price_min: 100, 
                price_max: 200, 
                price_display: '100-200€',
                duration: '90-120 min', 
                popularity: 45,
                description: 'Maquillaje nupcial con prueba previa',
                includes: ['Prueba previa', 'Maquillaje día boda', 'Productos premium', 'Kit retoques'],
                difficulty: 'Experto'
            },
            {
                id: '30', 
                name: 'Maquillaje artístico/editorial', 
                category: 'Maquillaje', 
                price_min: 80, 
                price_max: 150, 
                price_display: '80-150€',
                duration: '90-120 min', 
                popularity: 28,
                description: 'Maquillaje creativo para sesiones fotográficas',
                includes: ['Concepto creativo', 'Técnicas especiales', 'Efectos únicos', 'Sesión completa'],
                difficulty: 'Experto'
            },
            {
                id: '31', 
                name: 'Clase automaquillaje', 
                category: 'Maquillaje', 
                price_min: 75, 
                price_max: 120, 
                price_display: '75-120€',
                duration: '120 min', 
                popularity: 32,
                description: 'Aprende técnicas personalizadas para ti',
                includes: ['Análisis rostro', 'Técnicas paso a paso', 'Consejos productos', 'Práctica guiada'],
                difficulty: 'Educativo'
            },

            // === MASAJES ===
            {
                id: '32', 
                name: 'Masaje relajante', 
                category: 'Masajes', 
                price_min: 40, 
                price_max: 70, 
                price_display: '40-70€',
                duration: '60 min', 
                popularity: 81,
                description: 'Masaje suave para aliviar el estrés',
                includes: ['Aceites aromáticos', 'Técnica relajante', 'Música ambiente', 'Hidratación final'],
                difficulty: 'Básico'
            },
            {
                id: '33', 
                name: 'Masaje terapéutico/descontracturante', 
                category: 'Masajes', 
                price_min: 55, 
                price_max: 95, 
                price_display: '55-95€',
                duration: '60-75 min', 
                popularity: 74,
                description: 'Tratamiento específico para contracturas',
                includes: ['Evaluación postural', 'Técnica profunda', 'Puntos gatillo', 'Estiramientos'],
                difficulty: 'Avanzado'
            },
            {
                id: '34', 
                name: 'Masaje deportivo', 
                category: 'Masajes', 
                price_min: 45, 
                price_max: 80, 
                price_display: '45-80€',
                duration: '45-60 min', 
                popularity: 56,
                description: 'Recuperación muscular para deportistas',
                includes: ['Calentamiento', 'Técnica deportiva', 'Recuperación', 'Consejos'],
                difficulty: 'Intermedio'
            },
            {
                id: '35', 
                name: 'Drenaje linfático', 
                category: 'Masajes', 
                price_min: 60, 
                price_max: 100, 
                price_display: '60-100€',
                duration: '75-90 min', 
                popularity: 48,
                description: 'Técnica especializada para retención de líquidos',
                includes: ['Presión suave', 'Movimientos específicos', 'Drenaje completo', 'Consejos nutricionales'],
                difficulty: 'Experto'
            },
            {
                id: '36', 
                name: 'Masaje con piedras calientes', 
                category: 'Masajes', 
                price_min: 65, 
                price_max: 110, 
                price_display: '65-110€',
                duration: '90 min', 
                popularity: 42,
                description: 'Experiencia de relajación con termoterapia',
                includes: ['Piedras volcánicas', 'Aceites especiales', 'Calor terapéutico', 'Relajación profunda'],
                difficulty: 'Intermedio'
            }
        ];

        // Generar reservas de ejemplo
        this.loadMockBookings();
    }

    // Usuarios de prueba con diferentes perfiles
    loadMockUsers() {
        this.mockUsers = {
            // Usuario regular activo
            'maria.cliente@test.com': {
                id: 'user_1',
                email: 'maria.cliente@test.com',
                password: '123456', // En producción esto estaría hasheado
                name: 'María García',
                type: 'client',
                phone: '+34 666 123 456',
                created_at: '2024-01-15',
                verified: true,
                preferences: {
                    notifications: true,
                    location: 'Madrid Centro',
                    favorite_services: ['Peluquería', 'Manicura'],
                    budget_range: 'medio'
                },
                stats: {
                    bookings_completed: 12,
                    favorite_professionals: ['1', '3'],
                    total_spent: 540,
                    member_since: '2024-01-15'
                }
            },
            
            // Usuario nuevo/principiante
            'luis.nuevo@test.com': {
                id: 'user_2', 
                email: 'luis.nuevo@test.com',
                password: '123456',
                name: 'Luis Rodríguez',
                type: 'client',
                phone: '+34 677 234 567',
                created_at: '2024-11-01',
                verified: false,
                preferences: {
                    notifications: true,
                    location: 'Madrid Sur',
                    favorite_services: [],
                    budget_range: 'economico'
                },
                stats: {
                    bookings_completed: 0,
                    favorite_professionals: [],
                    total_spent: 0,
                    member_since: '2024-11-01'
                }
            },
            
            // Profesional activo
            'sofia.peluquera@test.com': {
                id: 'pro_1',
                email: 'sofia.peluquera@test.com', 
                password: '123456',
                name: 'Sofia Rodriguez',
                type: 'professional',
                phone: '+34 688 345 678',
                created_at: '2023-03-10',
                verified: true,
                professional_id: '1',
                business: {
                    name: 'Estudio Sofia Hair',
                    address: 'Calle Gran Vía 15, Madrid',
                    schedule: {
                        monday: { open: '09:00', close: '19:00' },
                        tuesday: { open: '09:00', close: '19:00' },
                        wednesday: { open: '09:00', close: '19:00' },
                        thursday: { open: '09:00', close: '19:00' },
                        friday: { open: '09:00', close: '20:00' },
                        saturday: { open: '10:00', close: '18:00' },
                        sunday: { closed: true }
                    }
                },
                stats: {
                    bookings_completed: 156,
                    rating: 4.9,
                    earnings_month: 2450,
                    clients_recurring: 89
                }
            },
            
            // Profesional nuevo
            'ana.manicura@test.com': {
                id: 'pro_2',
                email: 'ana.manicura@test.com',
                password: '123456', 
                name: 'Ana López',
                type: 'professional',
                phone: '+34 699 456 789',
                created_at: '2024-08-20',
                verified: true,
                professional_id: '4',
                business: {
                    name: 'Nails by Ana',
                    address: 'Calle Fuencarral 82, Madrid',
                    schedule: {
                        monday: { closed: true },
                        tuesday: { open: '10:00', close: '18:00' },
                        wednesday: { open: '10:00', close: '18:00' },
                        thursday: { open: '10:00', close: '18:00' },
                        friday: { open: '10:00', close: '19:00' },
                        saturday: { open: '09:00', close: '17:00' },
                        sunday: { open: '11:00', close: '16:00' }
                    }
                },
                stats: {
                    bookings_completed: 23,
                    rating: 4.4,
                    earnings_month: 680,
                    clients_recurring: 12
                }
            },
            
            // Usuario premium/VIP
            'carmen.vip@test.com': {
                id: 'user_3',
                email: 'carmen.vip@test.com',
                password: '123456',
                name: 'Carmen Deluxe',
                type: 'client',
                phone: '+34 600 111 222',
                created_at: '2023-06-01',
                verified: true,
                membership: 'premium',
                preferences: {
                    notifications: true,
                    location: 'Salamanca',
                    favorite_services: ['Estética', 'Maquillaje', 'Masajes'],
                    budget_range: 'alto'
                },
                stats: {
                    bookings_completed: 48,
                    favorite_professionals: ['5', '7'],
                    total_spent: 2340,
                    member_since: '2023-06-01'
                }
            }
        };
    }

    // Reservas de ejemplo para testing
    loadMockBookings() {
        this.bookings = [
            {
                id: 'booking_1',
                client_id: 'user_1',
                professional_id: '1',
                service_id: '2',
                date: '2024-12-05',
                time: '14:30',
                status: 'confirmed',
                price: 55,
                notes: 'Corte bob y mechas californianas',
                created_at: '2024-11-28'
            },
            {
                id: 'booking_2', 
                client_id: 'user_3',
                professional_id: '5',
                service_id: '15',
                date: '2024-12-03',
                time: '11:00', 
                status: 'completed',
                price: 95,
                notes: 'Tratamiento anti-edad mensual',
                created_at: '2024-11-20',
                review: {
                    rating: 5,
                    comment: 'Excelente como siempre. Isabel es una profesional increíble.'
                }
            },
            {
                id: 'booking_3',
                client_id: 'user_1', 
                professional_id: '3',
                service_id: '8',
                date: '2024-11-30',
                time: '16:00',
                status: 'completed',
                price: 35,
                notes: 'Manicura gel color coral',
                created_at: '2024-11-25',
                review: {
                    rating: 5,
                    comment: '¡Me encanta el resultado! Carmen es una artista.'
                }
            },
            {
                id: 'booking_4',
                client_id: 'user_2',
                professional_id: '2', 
                service_id: '1',
                date: '2024-12-10',
                time: '10:00',
                status: 'pending',
                price: 25,
                notes: 'Primera vez, corte básico masculino',
                created_at: '2024-12-01'
            }
        ];
    }

    // Método para login con usuarios de prueba
    loginWithTestUser(email, password) {
        const user = this.mockUsers[email];
        if (user && user.password === password) {
            const { password: _, ...userWithoutPassword } = user;
            this.setUser(userWithoutPassword);
            return true;
        }
        return false;
    }

    // Obtener información del usuario de prueba
    getTestUsers() {
        return Object.keys(this.mockUsers).map(email => ({
            email,
            name: this.mockUsers[email].name,
            type: this.mockUsers[email].type,
            description: this.getUserDescription(this.mockUsers[email])
        }));
    }

    getUserDescription(user) {
        switch(user.type) {
            case 'client':
                if (user.membership === 'premium') return 'Cliente VIP - Perfil premium';
                if (user.stats.bookings_completed === 0) return 'Usuario nuevo - Primera experiencia';
                return `Cliente activo - ${user.stats.bookings_completed} reservas completadas`;
            case 'professional':
                return `Profesional - Especialidad: ${this.professionals.find(p => p.id === user.professional_id)?.specialty || 'N/A'}`;
            default:
                return 'Usuario estándar';
        }
    }

    // Métodos para obtener datos
    getProfessionals(filters = {}) {
        let result = [...this.professionals];
        
        if (filters.specialty) {
            result = result.filter(p => p.specialty === filters.specialty);
        }
        
        if (filters.available !== undefined) {
            result = result.filter(p => p.available === filters.available);
        }
        
        return result;
    }

    getProfessionalById(id) {
        return this.professionals.find(p => p.id === id);
    }

    getServices(category = null) {
        if (category) {
            return this.services.filter(s => s.category === category);
        }
        return this.services;
    }

    getServiceCategories() {
        return [...new Set(this.services.map(s => s.category))];
    }

    // Simulación de reserva
    createBooking(bookingData) {
        const booking = {
            id: Date.now().toString(),
            ...bookingData,
            status: 'pending',
            created_at: new Date().toISOString()
        };
        
        this.bookings.push(booking);
        this.emit('bookingCreated', booking);
        return booking;
    }

    // === GESTIÓN DE SERVICIOS PROFESIONALES ===
    
    // Obtener servicios de un profesional específico
    getProfessionalServices(professionalId) {
        // Servicios personalizados del profesional
        const customServices = this.customServices ? this.customServices.filter(s => s.professional_id === professionalId) : [];
        
        // Servicios base que puede ofrecer según su especialidad
        const professional = this.getProfessionalById(professionalId);
        if (!professional) return customServices;
        
        const baseServices = this.services.filter(s => s.category === professional.specialty);
        
        // Combinar servicios base con personalizados
        return [...customServices, ...baseServices.map(service => ({
            ...service,
            is_base: true,
            professional_id: professionalId
        }))];
    }

    // Crear servicio personalizado
    createCustomService(professionalId, serviceData) {
        if (!this.customServices) {
            this.customServices = [];
        }

        const customService = {
            id: 'custom_' + Date.now(),
            professional_id: professionalId,
            name: serviceData.name,
            category: serviceData.category,
            description: serviceData.description,
            price_min: serviceData.price_min,
            price_max: serviceData.price_max,
            price_display: `${serviceData.price_min}-${serviceData.price_max}€`,
            duration: serviceData.duration,
            includes: serviceData.includes || [],
            difficulty: serviceData.difficulty || 'Intermedio',
            is_custom: true,
            active: true,
            created_at: new Date().toISOString()
        };

        this.customServices.push(customService);
        this.emit('serviceCreated', customService);
        return customService;
    }

    // Actualizar servicio personalizado
    updateCustomService(serviceId, updates) {
        if (!this.customServices) return null;

        const index = this.customServices.findIndex(s => s.id === serviceId);
        if (index === -1) return null;

        this.customServices[index] = {
            ...this.customServices[index],
            ...updates,
            price_display: updates.price_min && updates.price_max ? 
                `${updates.price_min}-${updates.price_max}€` : 
                this.customServices[index].price_display,
            updated_at: new Date().toISOString()
        };

        this.emit('serviceUpdated', this.customServices[index]);
        return this.customServices[index];
    }

    // Eliminar servicio personalizado
    deleteCustomService(serviceId) {
        if (!this.customServices) return false;

        const index = this.customServices.findIndex(s => s.id === serviceId);
        if (index === -1) return false;

        const deletedService = this.customServices.splice(index, 1)[0];
        this.emit('serviceDeleted', deletedService);
        return true;
    }

    // Alternar disponibilidad de servicio
    toggleServiceAvailability(serviceId) {
        if (!this.customServices) return null;

        const service = this.customServices.find(s => s.id === serviceId);
        if (!service) return null;

        service.active = !service.active;
        service.updated_at = new Date().toISOString();
        
        this.emit('serviceToggled', service);
        return service;
    }
}

export default new AppState();