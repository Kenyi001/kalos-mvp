import mongoose from 'mongoose';

const professionalSchema = new mongoose.Schema({
    // Referencia al usuario
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    
    // Información profesional
    profileImage: {
        type: String,
        default: null // URL o Base64 de la foto de perfil
    },
    businessName: {
        type: String,
        trim: true,
        maxlength: [100, 'El nombre del negocio no puede exceder 100 caracteres']
    },
    description: {
        type: String,
        maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
    },
    specialties: [{
        type: String,
        trim: true
    }],
    
    // Experiencia y certificaciones
    experience: {
        years: {
            type: Number,
            min: [0, 'Los años de experiencia no pueden ser negativos'],
            max: [50, 'Los años de experiencia no pueden exceder 50']
        },
        description: {
            type: String,
            maxlength: [500, 'La descripción de experiencia no puede exceder 500 caracteres']
        }
    },
    certifications: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        institution: {
            type: String,
            required: true,
            trim: true
        },
        date: {
            type: Date,
            required: true
        },
        certificateUrl: String // URL del certificado
    }],
    
    // Portfolio
    portfolio: [{
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: String,
        imageUrl: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    
    // Información de contacto y ubicación
    contactInfo: {
        businessPhone: {
            type: String,
            match: [/^\+?[1-9]\d{1,14}$/, 'Número de teléfono inválido']
        },
        businessEmail: {
            type: String,
            lowercase: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Email inválido'
            ]
        },
        website: {
            type: String,
            match: [/^https?:\/\/.+/, 'URL inválida']
        },
        socialMedia: {
            instagram: String,
            facebook: String,
            tiktok: String,
            youtube: String
        }
    },
    
    // Ubicación del servicio
    serviceLocation: {
        type: {
            type: String,
            enum: ['home_service', 'salon_service', 'both'],
            required: true
        },
        salonAddress: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: {
                type: String,
                default: 'España'
            },
            coordinates: {
                lat: Number,
                lng: Number
            }
        },
        serviceRadius: {
            type: Number, // Radio en km para servicios a domicilio
            default: 10
        }
    },
    
    // Configuración de disponibilidad
    availability: {
        schedule: {
            monday: {
                available: { type: Boolean, default: true },
                hours: {
                    start: { type: String, default: '09:00' },
                    end: { type: String, default: '18:00' }
                }
            },
            tuesday: {
                available: { type: Boolean, default: true },
                hours: {
                    start: { type: String, default: '09:00' },
                    end: { type: String, default: '18:00' }
                }
            },
            wednesday: {
                available: { type: Boolean, default: true },
                hours: {
                    start: { type: String, default: '09:00' },
                    end: { type: String, default: '18:00' }
                }
            },
            thursday: {
                available: { type: Boolean, default: true },
                hours: {
                    start: { type: String, default: '09:00' },
                    end: { type: String, default: '18:00' }
                }
            },
            friday: {
                available: { type: Boolean, default: true },
                hours: {
                    start: { type: String, default: '09:00' },
                    end: { type: String, default: '18:00' }
                }
            },
            saturday: {
                available: { type: Boolean, default: true },
                hours: {
                    start: { type: String, default: '10:00' },
                    end: { type: String, default: '16:00' }
                }
            },
            sunday: {
                available: { type: Boolean, default: false },
                hours: {
                    start: { type: String, default: '10:00' },
                    end: { type: String, default: '16:00' }
                }
            }
        },
        blackoutDates: [{ // Fechas no disponibles
            date: {
                type: Date,
                required: true
            },
            reason: String
        }]
    },
    
    // Configuración de precios
    pricingConfig: {
        currency: {
            type: String,
            default: 'BOB'
        },
        acceptsDeposits: {
            type: Boolean,
            default: true
        },
        depositPercentage: {
            type: Number,
            min: 0,
            max: 100,
            default: 20
        },
        cancellationPolicy: {
            hoursBeforeService: {
                type: Number,
                default: 24
            },
            refundPercentage: {
                type: Number,
                min: 0,
                max: 100,
                default: 50
            }
        }
    },
    
    // Estado del perfil
    profileStatus: {
        type: String,
        enum: ['pending', 'approved', 'suspended', 'rejected'],
        default: 'pending'
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    
    // Métricas y reviews
    metrics: {
        totalBookings: {
            type: Number,
            default: 0
        },
        completedBookings: {
            type: Number,
            default: 0
        },
        cancelledBookings: {
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
        responseTime: {
            type: Number, // En minutos
            default: 60
        }
    },
    
    // Verificación del perfil
    verification: {
        idVerified: {
            type: Boolean,
            default: false
        },
        certificatesVerified: {
            type: Boolean,
            default: false
        },
        backgroundCheck: {
            type: Boolean,
            default: false
        },
        lastVerificationDate: Date
    }
    
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Poblar automáticamente la información del usuario
professionalSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'firstName lastName email avatar phone createdAt'
    });
    next();
});

// Virtual para obtener el nombre completo
professionalSchema.virtual('fullName').get(function() {
    return this.user ? `${this.user.firstName} ${this.user.lastName}` : '';
});

// Virtual para calcular el porcentaje de completitud del perfil
professionalSchema.virtual('profileCompleteness').get(function() {
    let completeness = 0;
    const totalFields = 10;
    
    if (this.description) completeness += 1;
    if (this.specialties && this.specialties.length > 0) completeness += 1;
    if (this.experience && this.experience.years !== undefined) completeness += 1;
    if (this.certifications && this.certifications.length > 0) completeness += 1;
    if (this.portfolio && this.portfolio.length > 0) completeness += 1;
    if (this.contactInfo && this.contactInfo.businessPhone) completeness += 1;
    if (this.serviceLocation && this.serviceLocation.type) completeness += 1;
    if (this.serviceLocation && this.serviceLocation.salonAddress && this.serviceLocation.salonAddress.street) completeness += 1;
    if (this.availability && this.availability.schedule) completeness += 1;
    if (this.user && this.user.avatar) completeness += 1;
    
    return Math.round((completeness / totalFields) * 100);
});

// Virtual para obtener servicios asociados
professionalSchema.virtual('services', {
    ref: 'Service',
    localField: '_id',
    foreignField: 'professional'
});

// Virtual para obtener reviews
professionalSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'professional'
});

// Índices para optimizar consultas
professionalSchema.index({ user: 1 });
professionalSchema.index({ profileStatus: 1 });
professionalSchema.index({ isAvailable: 1 });
professionalSchema.index({ specialties: 1 });
professionalSchema.index({ 'serviceLocation.salonAddress.city': 1 });
professionalSchema.index({ 'metrics.averageRating': -1 });
professionalSchema.index({ createdAt: -1 });

// Método para verificar disponibilidad en una fecha específica
professionalSchema.methods.isAvailableOnDate = function(date) {
    const dayOfWeek = date.toLocaleLowerCase();
    const daySchedule = this.availability.schedule[dayOfWeek];
    
    if (!daySchedule || !daySchedule.available) {
        return false;
    }
    
    // Verificar blackout dates
    const isBlackedOut = this.availability.blackoutDates.some(blackout => {
        return blackout.date.toDateString() === date.toDateString();
    });
    
    return !isBlackedOut;
};

// Método para actualizar métricas
professionalSchema.methods.updateMetrics = async function() {
    const BookingModel = mongoose.model('Booking');
    const ReviewModel = mongoose.model('Review');
    
    // Obtener estadísticas de bookings
    const bookingStats = await BookingModel.aggregate([
        { $match: { professional: this._id } },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);
    
    // Obtener estadísticas de reviews
    const reviewStats = await ReviewModel.aggregate([
        { $match: { professional: this._id } },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 }
            }
        }
    ]);
    
    // Actualizar métricas
    let totalBookings = 0;
    let completedBookings = 0;
    let cancelledBookings = 0;
    
    bookingStats.forEach(stat => {
        totalBookings += stat.count;
        if (stat._id === 'completed') completedBookings = stat.count;
        if (stat._id === 'cancelled') cancelledBookings = stat.count;
    });
    
    this.metrics.totalBookings = totalBookings;
    this.metrics.completedBookings = completedBookings;
    this.metrics.cancelledBookings = cancelledBookings;
    
    if (reviewStats.length > 0) {
        this.metrics.averageRating = Math.round(reviewStats[0].averageRating * 10) / 10;
        this.metrics.totalReviews = reviewStats[0].totalReviews;
    }
    
    await this.save();
};

export default mongoose.model('Professional', professionalSchema);