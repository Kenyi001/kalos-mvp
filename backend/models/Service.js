import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    // Referencia al profesional que ofrece el servicio
    professional: {
        type: mongoose.Schema.ObjectId,
        ref: 'Professional',
        required: [true, 'El servicio debe estar asociado a un profesional']
    },
    
    // Información básica del servicio
    name: {
        type: String,
        required: [true, 'El nombre del servicio es requerido'],
        trim: true,
        maxlength: [100, 'El nombre del servicio no puede exceder 100 caracteres']
    },
    description: {
        type: String,
        required: [true, 'La descripción del servicio es requerida'],
        maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
    },
    category: {
        type: String,
        required: [true, 'La categoría del servicio es requerida'],
        enum: [
            'corte_cabello',
            'peinado',
            'coloracion',
            'tratamiento_capilar',
            'manicura',
            'pedicura',
            'unas_gel',
            'unas_acrilicas',
            'facial_limpieza',
            'facial_hidratante',
            'facial_antiedad',
            'depilacion_cera',
            'depilacion_laser',
            'masaje_relajante',
            'masaje_descontracturante',
            'maquillaje_dia',
            'maquillaje_noche',
            'maquillaje_novias',
            'cejas_pestanas',
            'otro'
        ]
    },
    
    // Precios
    pricing: {
        basePrice: {
            type: Number,
            required: [true, 'El precio base es requerido'],
            min: [0, 'El precio no puede ser negativo']
        },
        priceRange: {
            min: {
                type: Number,
                required: [true, 'El precio mínimo es requerido'],
                min: [0, 'El precio no puede ser negativo']
            },
            max: {
                type: Number,
                required: [true, 'El precio máximo es requerido'],
                min: [0, 'El precio no puede ser negativo']
            }
        },
        currency: {
            type: String,
            default: 'BOB'
        },
        // Precios variables según opciones
        options: [{
            name: {
                type: String,
                required: true,
                trim: true
            },
            description: String,
            additionalPrice: {
                type: Number,
                default: 0
            }
        }]
    },
    
    // Duración del servicio
    duration: {
        estimated: {
            type: Number, // En minutos
            required: [true, 'La duración estimada es requerida'],
            min: [15, 'La duración mínima es 15 minutos'],
            max: [480, 'La duración máxima es 8 horas']
        },
        flexible: {
            type: Boolean,
            default: false
        },
        bufferTime: {
            type: Number, // Tiempo adicional entre servicios
            default: 15
        }
    },
    
    // Qué incluye el servicio
    includes: [{
        type: String,
        required: true,
        trim: true
    }],
    
    // Requisitos y preparación
    requirements: {
        clientPreparation: [String], // Lo que el cliente debe hacer antes
        contraindications: [String], // Contraindicaciones
        ageRestriction: {
            min: {
                type: Number,
                default: 0
            },
            max: {
                type: Number,
                default: 120
            }
        }
    },
    
    // Configuración del servicio
    serviceConfig: {
        location: {
            type: String,
            enum: ['salon', 'home', 'both'],
            required: true
        },
        maxClientsSimultaneous: {
            type: Number,
            default: 1,
            min: 1
        },
        requiresDeposit: {
            type: Boolean,
            default: false
        },
        advanceBookingRequired: {
            type: Number, // Horas de anticipación requeridas
            default: 24
        },
        cancellationPolicy: {
            hoursBeforeService: {
                type: Number,
                default: 24
            },
            penaltyPercentage: {
                type: Number,
                min: 0,
                max: 100,
                default: 0
            }
        }
    },
    
    // Imágenes del servicio
    images: [{
        url: {
            type: String,
            required: true
        },
        title: String,
        description: String,
        isMainImage: {
            type: Boolean,
            default: false
        }
    }],
    
    // Nivel de dificultad/experiencia requerida
    difficulty: {
        type: String,
        enum: ['principiante', 'intermedio', 'avanzado', 'experto'],
        default: 'intermedio'
    },
    
    // Tags para búsqueda
    tags: [{
        type: String,
        lowercase: true,
        trim: true
    }],
    
    // Estado del servicio
    isActive: {
        type: Boolean,
        default: true
    },
    isCustom: {
        type: Boolean,
        default: true // true para servicios creados por profesionales, false para servicios base del sistema
    },
    
    // Métricas del servicio
    metrics: {
        totalBookings: {
            type: Number,
            default: 0
        },
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        totalReviews: {
            type: Number,
            default: 0
        },
        popularityScore: {
            type: Number,
            default: 0
        }
    },
    
    // SEO y marketing
    seo: {
        metaTitle: String,
        metaDescription: String,
        keywords: [String]
    }
    
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Poblar automáticamente la información del profesional
serviceSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'professional',
        select: 'user businessName serviceLocation metrics verification',
        populate: {
            path: 'user',
            select: 'firstName lastName avatar'
        }
    });
    next();
});

// Virtual para obtener el precio promedio
serviceSchema.virtual('averagePrice').get(function() {
    return Math.round((this.pricing.priceRange.min + this.pricing.priceRange.max) / 2);
});

// Virtual para obtener la imagen principal
serviceSchema.virtual('mainImage').get(function() {
    const mainImg = this.images.find(img => img.isMainImage);
    return mainImg ? mainImg.url : (this.images.length > 0 ? this.images[0].url : null);
});

// Virtual para obtener reviews del servicio
serviceSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'service'
});

// Índices para optimizar consultas
serviceSchema.index({ professional: 1 });
serviceSchema.index({ category: 1 });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ 'pricing.priceRange.min': 1 });
serviceSchema.index({ 'pricing.priceRange.max': 1 });
serviceSchema.index({ tags: 1 });
serviceSchema.index({ createdAt: -1 });
serviceSchema.index({ 'metrics.averageRating': -1 });
serviceSchema.index({ 'metrics.popularityScore': -1 });

// Texto completo para búsqueda
serviceSchema.index({
    name: 'text',
    description: 'text',
    tags: 'text'
});

// Validaciones personalizadas
serviceSchema.pre('save', function(next) {
    // Verificar que el precio mínimo sea menor o igual al máximo
    if (this.pricing.priceRange.min > this.pricing.priceRange.max) {
        return next(new Error('El precio mínimo no puede ser mayor al precio máximo'));
    }
    
    // Verificar que el precio base esté dentro del rango
    if (this.pricing.basePrice < this.pricing.priceRange.min || 
        this.pricing.basePrice > this.pricing.priceRange.max) {
        this.pricing.basePrice = Math.round((this.pricing.priceRange.min + this.pricing.priceRange.max) / 2);
    }
    
    // Asegurar que solo una imagen sea la principal
    const mainImages = this.images.filter(img => img.isMainImage);
    if (mainImages.length > 1) {
        this.images.forEach((img, index) => {
            img.isMainImage = index === 0;
        });
    } else if (mainImages.length === 0 && this.images.length > 0) {
        this.images[0].isMainImage = true;
    }
    
    next();
});

// Método para verificar disponibilidad del servicio
serviceSchema.methods.isAvailable = function() {
    return this.isActive && this.professional && this.professional.isAvailable;
};

// Método para calcular precio total con opciones
serviceSchema.methods.calculatePrice = function(selectedOptions = []) {
    let totalPrice = this.pricing.basePrice;
    
    selectedOptions.forEach(optionId => {
        const option = this.pricing.options.id(optionId);
        if (option) {
            totalPrice += option.additionalPrice;
        }
    });
    
    return totalPrice;
};

// Método para actualizar métricas
serviceSchema.methods.updateMetrics = async function() {
    const BookingModel = mongoose.model('Booking');
    const ReviewModel = mongoose.model('Review');
    
    // Obtener estadísticas de bookings
    const bookingCount = await BookingModel.countDocuments({
        service: this._id,
        status: { $in: ['confirmed', 'completed'] }
    });
    
    // Obtener estadísticas de reviews
    const reviewStats = await ReviewModel.aggregate([
        { $match: { service: this._id } },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 }
            }
        }
    ]);
    
    // Actualizar métricas
    this.metrics.totalBookings = bookingCount;
    
    if (reviewStats.length > 0) {
        this.metrics.averageRating = Math.round(reviewStats[0].averageRating * 10) / 10;
        this.metrics.totalReviews = reviewStats[0].totalReviews;
    }
    
    // Calcular popularidad (fórmula simple: bookings + reviews + rating)
    this.metrics.popularityScore = 
        this.metrics.totalBookings * 1 + 
        this.metrics.totalReviews * 2 + 
        this.metrics.averageRating * 10;
    
    await this.save();
};

// Método estático para obtener categorías populares
serviceSchema.statics.getPopularCategories = async function() {
    return this.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
    ]);
};

// Método estático para búsqueda de servicios
serviceSchema.statics.searchServices = async function(query, filters = {}) {
    const searchQuery = {
        isActive: true,
        ...filters
    };
    
    if (query) {
        searchQuery.$text = { $search: query };
    }
    
    return this.find(searchQuery)
        .sort(query ? { score: { $meta: 'textScore' } } : { 'metrics.popularityScore': -1 })
        .populate('professional');
};

export default mongoose.model('Service', serviceSchema);