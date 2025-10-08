import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    // Información básica
    firstName: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true,
        maxlength: [50, 'El nombre no puede exceder 50 caracteres']
    },
    lastName: {
        type: String,
        required: [true, 'El apellido es requerido'],
        trim: true,
        maxlength: [50, 'El apellido no puede exceder 50 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        unique: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Email inválido'
        ]
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
        select: false // No incluir en queries por defecto
    },
    phone: {
        type: String,
        match: [/^\+?[1-9]\d{1,14}$/, 'Número de teléfono inválido']
    },
    avatar: {
        type: String, // URL de la imagen
        default: null
    },
    
    // Rol del usuario
    role: {
        type: String,
        enum: ['client', 'professional', 'admin'],
        default: 'client'
    },
    
    // Estado de la cuenta
    isActive: {
        type: Boolean,
        default: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    
    // Información de ubicación
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: {
            type: String,
            default: 'España'
        }
    },
    
    // Fecha de nacimiento
    birthDate: {
        type: Date
    },
    
    // Género
    gender: {
        type: String,
        enum: ['male', 'female', 'other', 'prefer_not_to_say'],
        default: 'prefer_not_to_say'
    },
    
    // Preferencias del usuario
    preferences: {
        language: {
            type: String,
            default: 'es'
        },
        currency: {
            type: String,
            default: 'BOB'
        },
        notifications: {
            email: {
                type: Boolean,
                default: true
            },
            sms: {
                type: Boolean,
                default: false
            },
            push: {
                type: Boolean,
                default: true
            }
        }
    },
    
    // Metadatos
    lastLogin: {
        type: Date
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockedUntil: {
        type: Date
    },
    
    // Tokens para reset de contraseña y verificación de email
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    emailVerificationToken: String,
    emailVerificationExpire: Date
    
}, {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual para nombre completo
userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Virtual para verificar si la cuenta está bloqueada
userSchema.virtual('isLocked').get(function() {
    return !!(this.lockedUntil && this.lockedUntil > Date.now());
});

// Índices para optimizar consultas
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });

// Middleware pre-save para hashear password
userSchema.pre('save', async function(next) {
    // Solo hashear si el password fue modificado
    if (!this.isModified('password')) {
        next();
    }
    
    // Hashear password
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Método para incrementar intentos de login fallidos
userSchema.methods.incLoginAttempts = function() {
    // Si tenemos un lock anterior y expiró, reiniciar
    if (this.lockedUntil && this.lockedUntil < Date.now()) {
        return this.updateOne({
            $unset: { lockedUntil: 1 },
            $set: { loginAttempts: 1 }
        });
    }
    
    const updates = { $inc: { loginAttempts: 1 } };
    
    // Bloquear después de 5 intentos fallidos por 2 horas
    if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
        updates.$set = {
            lockedUntil: Date.now() + 2 * 60 * 60 * 1000 // 2 horas
        };
    }
    
    return this.updateOne(updates);
};

// Método para resetear intentos de login
userSchema.methods.resetLoginAttempts = function() {
    return this.updateOne({
        $unset: { loginAttempts: 1, lockedUntil: 1 }
    });
};

// Método para obtener datos públicos del usuario
userSchema.methods.getPublicData = function() {
    return {
        id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        fullName: this.fullName,
        email: this.email,
        avatar: this.avatar,
        role: this.role,
        isActive: this.isActive,
        createdAt: this.createdAt
    };
};

export default mongoose.model('User', userSchema);