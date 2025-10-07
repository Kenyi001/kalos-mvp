import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    // Referencias
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El cliente es requerido']
    },
    professional: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Professional',
        required: [true, 'El profesional es requerido']
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: [true, 'El servicio es requerido']
    },

    // Información de la cita
    date: {
        type: Date,
        required: [true, 'La fecha es requerida']
    },
    time: {
        type: String,
        required: [true, 'La hora es requerida'],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)']
    },
    duration: {
        type: Number, // Duración en minutos
        required: [true, 'La duración es requerida']
    },
    endTime: {
        type: String, // Calculado automáticamente
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)']
    },

    // Estado de la reserva
    status: {
        type: String,
        enum: {
            values: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'],
            message: 'Estado no válido'
        },
        default: 'pending'
    },

    // Precio y pago
    pricing: {
        basePrice: {
            type: Number,
            required: [true, 'El precio base es requerido'],
            min: [0, 'El precio no puede ser negativo']
        },
        finalPrice: {
            type: Number,
            required: [true, 'El precio final es requerido'],
            min: [0, 'El precio no puede ser negativo']
        },
        currency: {
            type: String,
            default: 'EUR'
        },
        depositPaid: {
            type: Boolean,
            default: false
        },
        depositAmount: {
            type: Number,
            default: 0
        },
        isPaid: {
            type: Boolean,
            default: false
        },
        paymentMethod: {
            type: String,
            enum: ['cash', 'card', 'transfer', 'online', null],
            default: null
        },
        paidAt: {
            type: Date
        }
    },

    // Ubicación del servicio
    location: {
        type: {
            type: String,
            enum: ['salon', 'home', 'other'],
            required: true
        },
        address: {
            type: String
        },
        coordinates: {
            lat: Number,
            lng: Number
        },
        notes: String
    },

    // Notas y comunicación
    clientNotes: {
        type: String,
        maxlength: [500, 'Las notas no pueden exceder 500 caracteres']
    },
    professionalNotes: {
        type: String,
        maxlength: [500, 'Las notas no pueden exceder 500 caracteres']
    },
    internalNotes: {
        type: String,
        maxlength: [1000, 'Las notas internas no pueden exceder 1000 caracteres']
    },

    // Recordatorios y notificaciones
    reminders: {
        email: {
            sent: { type: Boolean, default: false },
            sentAt: Date
        },
        sms: {
            sent: { type: Boolean, default: false },
            sentAt: Date
        },
        push: {
            sent: { type: Boolean, default: false },
            sentAt: Date
        }
    },

    // Cancelación
    cancellation: {
        cancelled: {
            type: Boolean,
            default: false
        },
        cancelledBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        cancelledAt: {
            type: Date
        },
        reason: {
            type: String,
            maxlength: [500, 'La razón no puede exceder 500 caracteres']
        },
        refundIssued: {
            type: Boolean,
            default: false
        }
    },

    // Metadata
    source: {
        type: String,
        enum: ['web', 'mobile', 'admin', 'api'],
        default: 'web'
    },
    ipAddress: String,
    userAgent: String

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Índices para optimización
bookingSchema.index({ client: 1, date: -1 });
bookingSchema.index({ professional: 1, date: -1 });
bookingSchema.index({ service: 1 });
bookingSchema.index({ status: 1, date: -1 });
bookingSchema.index({ date: 1, time: 1 });

// Virtual para fecha y hora combinadas
bookingSchema.virtual('dateTime').get(function() {
    if (this.date && this.time) {
        const [hours, minutes] = this.time.split(':');
        const dateTime = new Date(this.date);
        dateTime.setHours(parseInt(hours), parseInt(minutes));
        return dateTime;
    }
    return null;
});

// Virtual para saber si la cita es futura
bookingSchema.virtual('isFuture').get(function() {
    return this.dateTime && this.dateTime > new Date();
});

// Virtual para saber si la cita es hoy
bookingSchema.virtual('isToday').get(function() {
    if (!this.date) return false;
    const today = new Date();
    const bookingDate = new Date(this.date);
    return bookingDate.toDateString() === today.toDateString();
});

// Middleware: Calcular hora de finalización antes de guardar
bookingSchema.pre('save', function(next) {
    if (this.time && this.duration) {
        const [hours, minutes] = this.time.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + this.duration;
        const endHours = Math.floor(totalMinutes / 60) % 24;
        const endMinutes = totalMinutes % 60;
        this.endTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
    }
    next();
});

// Middleware: Actualizar estado de cancelación
bookingSchema.pre('save', function(next) {
    if (this.status === 'cancelled' && !this.cancellation.cancelled) {
        this.cancellation.cancelled = true;
        this.cancellation.cancelledAt = new Date();
    }
    next();
});

// Método: Verificar si se puede cancelar
bookingSchema.methods.canBeCancelled = function() {
    if (this.status === 'cancelled' || this.status === 'completed') {
        return false;
    }
    // No se puede cancelar si la cita es en menos de 2 horas
    if (!this.date || !this.time) return false;
    
    const [hours, minutes] = this.time.split(':').map(Number);
    const bookingDateTime = new Date(this.date);
    bookingDateTime.setHours(hours, minutes, 0, 0);
    
    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    
    return bookingDateTime > twoHoursFromNow;
};

// Método: Verificar si se puede confirmar
bookingSchema.methods.canBeConfirmed = function() {
    if (this.status !== 'pending') return false;
    
    if (!this.date || !this.time) return false;
    
    const [hours, minutes] = this.time.split(':').map(Number);
    const bookingDateTime = new Date(this.date);
    bookingDateTime.setHours(hours, minutes, 0, 0);
    
    return bookingDateTime > new Date();
};

// Método: Verificar si se puede completar
bookingSchema.methods.canBeCompleted = function() {
    return this.status === 'confirmed' || this.status === 'in_progress';
};

// Método estático: Buscar disponibilidad
bookingSchema.statics.findAvailability = async function(professionalId, date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await this.find({
        professional: professionalId,
        date: { $gte: startOfDay, $lte: endOfDay },
        status: { $in: ['pending', 'confirmed', 'in_progress'] }
    }).sort('time');

    return bookings;
};

// Método estático: Verificar conflictos
bookingSchema.statics.hasConflict = async function(professionalId, date, time, duration, excludeBookingId = null) {
    const [hours, minutes] = time.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + duration;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const query = {
        professional: professionalId,
        date: { $gte: startOfDay, $lte: endOfDay },
        status: { $in: ['pending', 'confirmed', 'in_progress'] }
    };

    if (excludeBookingId) {
        query._id = { $ne: excludeBookingId };
    }

    const bookings = await this.find(query);

    for (const booking of bookings) {
        const [bookingHours, bookingMinutes] = booking.time.split(':').map(Number);
        const bookingStart = bookingHours * 60 + bookingMinutes;
        const bookingEnd = bookingStart + booking.duration;

        // Verificar solapamiento
        if (
            (startMinutes >= bookingStart && startMinutes < bookingEnd) ||
            (endMinutes > bookingStart && endMinutes <= bookingEnd) ||
            (startMinutes <= bookingStart && endMinutes >= bookingEnd)
        ) {
            return true;
        }
    }

    return false;
};

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
