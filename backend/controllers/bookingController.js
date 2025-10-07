import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Professional from '../models/Professional.js';
import { validationResult } from 'express-validator';

// @desc    Obtener todas las reservas del usuario autenticado
// @route   GET /api/bookings
// @access  Private
export const getBookings = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { status, date, upcoming, past } = req.query;

        // Construir query base
        let query = {};

        // Verificar si el usuario es profesional
        const professional = await Professional.findOne({ user: userId });

        if (professional) {
            // Si es profesional, mostrar reservas de sus servicios
            query.professional = professional._id;
        } else {
            // Si es cliente, mostrar sus reservas
            query.client = userId;
        }

        // Filtros adicionales
        if (status) {
            query.status = status;
        }

        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            query.date = { $gte: startOfDay, $lte: endOfDay };
        }

        if (upcoming === 'true') {
            query.date = { $gte: new Date() };
            query.status = { $in: ['pending', 'confirmed'] };
        }

        if (past === 'true') {
            query.date = { $lt: new Date() };
        }

        // Obtener reservas con populate
        const bookings = await Booking.find(query)
            .populate({
                path: 'client',
                select: 'firstName lastName email phone'
            })
            .populate({
                path: 'professional',
                populate: {
                    path: 'user',
                    select: 'firstName lastName email'
                }
            })
            .populate('service')
            .sort('-date -time');

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Obtener una reserva específica
// @route   GET /api/bookings/:id
// @access  Private
export const getBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate({
                path: 'client',
                select: 'firstName lastName email phone'
            })
            .populate({
                path: 'professional',
                populate: {
                    path: 'user',
                    select: 'firstName lastName email phone'
                }
            })
            .populate('service');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Reserva no encontrada'
            });
        }

        // Verificar permisos
        const userId = req.user._id.toString();
        const professional = await Professional.findOne({ user: userId });

        const isClient = booking.client._id.toString() === userId;
        const isProfessional = professional && booking.professional._id.toString() === professional._id.toString();

        if (!isClient && !isProfessional) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para ver esta reserva'
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Crear una nueva reserva
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res, next) => {
    try {
        // Validar errores de express-validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const {
            professionalId,
            serviceId,
            date,
            time,
            clientNotes,
            location
        } = req.body;

        // Verificar que el servicio existe
        const service = await Service.findById(serviceId).populate('professional');
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Servicio no encontrado'
            });
        }

        // Verificar que el profesional existe y coincide
        const professional = await Professional.findById(professionalId);
        if (!professional) {
            return res.status(404).json({
                success: false,
                message: 'Profesional no encontrado'
            });
        }

        if (service.professional._id.toString() !== professionalId) {
            return res.status(400).json({
                success: false,
                message: 'El servicio no pertenece a este profesional'
            });
        }

        // Verificar que la fecha es futura
        const bookingDate = new Date(date);
        const now = new Date();
        if (bookingDate < now) {
            return res.status(400).json({
                success: false,
                message: 'No puedes reservar en una fecha pasada'
            });
        }

        // Verificar disponibilidad (no hay conflictos de horario)
        const duration = service.duration.estimated;
        const hasConflict = await Booking.hasConflict(
            professionalId,
            bookingDate,
            time,
            duration
        );

        if (hasConflict) {
            return res.status(409).json({
                success: false,
                message: 'El horario seleccionado no está disponible'
            });
        }

        // Crear la reserva
        const booking = await Booking.create({
            client: req.user._id,
            professional: professionalId,
            service: serviceId,
            date: bookingDate,
            time,
            duration,
            pricing: {
                basePrice: service.pricing.basePrice,
                finalPrice: service.pricing.basePrice, // Puede ajustarse con descuentos
                currency: 'EUR',
                depositAmount: service.serviceConfig.requiresDeposit ? 
                    service.pricing.basePrice * 0.2 : 0
            },
            location: location || {
                type: service.serviceConfig.location === 'both' ? 'salon' : service.serviceConfig.location
            },
            clientNotes,
            source: 'web'
        });

        // Populate antes de devolver
        await booking.populate([
            {
                path: 'client',
                select: 'firstName lastName email phone'
            },
            {
                path: 'professional',
                populate: {
                    path: 'user',
                    select: 'firstName lastName email'
                }
            },
            {
                path: 'service'
            }
        ]);

        res.status(201).json({
            success: true,
            data: booking,
            message: 'Reserva creada exitosamente'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Actualizar una reserva
// @route   PUT /api/bookings/:id
// @access  Private
export const updateBooking = async (req, res, next) => {
    try {
        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Reserva no encontrada'
            });
        }

        // Verificar permisos
        const userId = req.user._id.toString();
        const professional = await Professional.findOne({ user: userId });

        const isClient = booking.client.toString() === userId;
        const isProfessional = professional && booking.professional.toString() === professional._id.toString();

        if (!isClient && !isProfessional) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para actualizar esta reserva'
            });
        }

        // Campos que pueden actualizarse
        const allowedUpdates = {
            client: ['clientNotes', 'location'],
            professional: ['status', 'professionalNotes', 'pricing.isPaid', 'pricing.paymentMethod']
        };

        // Determinar qué campos puede actualizar el usuario
        const updates = {};
        const role = isClient ? 'client' : 'professional';

        Object.keys(req.body).forEach(key => {
            if (allowedUpdates[role].includes(key) || 
                (role === 'professional' && key.startsWith('pricing.'))) {
                if (key.includes('.')) {
                    // Manejar campos anidados
                    const [parent, child] = key.split('.');
                    if (!updates[parent]) updates[parent] = {};
                    updates[parent][child] = req.body[key];
                } else {
                    updates[key] = req.body[key];
                }
            }
        });

        // Validaciones especiales para cambios de estado
        if (updates.status) {
            if (updates.status === 'confirmed' && !booking.canBeConfirmed()) {
                return res.status(400).json({
                    success: false,
                    message: 'No se puede confirmar esta reserva'
                });
            }
            if (updates.status === 'completed' && !booking.canBeCompleted()) {
                return res.status(400).json({
                    success: false,
                    message: 'No se puede completar esta reserva'
                });
            }
        }

        // Aplicar actualizaciones
        Object.keys(updates).forEach(key => {
            if (typeof updates[key] === 'object' && !Array.isArray(updates[key])) {
                booking[key] = { ...booking[key], ...updates[key] };
            } else {
                booking[key] = updates[key];
            }
        });

        await booking.save();

        // Populate antes de devolver
        await booking.populate([
            {
                path: 'client',
                select: 'firstName lastName email phone'
            },
            {
                path: 'professional',
                populate: {
                    path: 'user',
                    select: 'firstName lastName email'
                }
            },
            {
                path: 'service'
            }
        ]);

        res.status(200).json({
            success: true,
            data: booking,
            message: 'Reserva actualizada exitosamente'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Cancelar/Eliminar una reserva
// @route   DELETE /api/bookings/:id
// @access  Private
export const deleteBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Reserva no encontrada'
            });
        }

        // Verificar permisos
        const userId = req.user._id.toString();
        const professional = await Professional.findOne({ user: userId });

        const isClient = booking.client.toString() === userId;
        const isProfessional = professional && booking.professional.toString() === professional._id.toString();

        if (!isClient && !isProfessional) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para cancelar esta reserva'
            });
        }

        // Verificar si se puede cancelar
        if (!booking.canBeCancelled()) {
            return res.status(400).json({
                success: false,
                message: 'No se puede cancelar esta reserva (debe ser con al menos 2 horas de anticipación)'
            });
        }

        // Actualizar a cancelada en lugar de eliminar
        booking.status = 'cancelled';
        booking.cancellation = {
            cancelled: true,
            cancelledBy: req.user._id,
            cancelledAt: new Date(),
            reason: req.body.reason || 'Sin razón especificada'
        };

        await booking.save();

        res.status(200).json({
            success: true,
            data: {},
            message: 'Reserva cancelada exitosamente'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Obtener disponibilidad de un profesional
// @route   GET /api/bookings/availability/:professionalId
// @access  Public
export const getAvailability = async (req, res, next) => {
    try {
        const { professionalId } = req.params;
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'La fecha es requerida'
            });
        }

        const professional = await Professional.findById(professionalId);
        if (!professional) {
            return res.status(404).json({
                success: false,
                message: 'Profesional no encontrado'
            });
        }

        const bookings = await Booking.findAvailability(professionalId, new Date(date));

        // Obtener horario del profesional
        const dateObj = new Date(date);
        const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const schedule = professional.availability?.schedule?.[dayOfWeek];

        res.status(200).json({
            success: true,
            data: {
                bookings: bookings.map(b => ({
                    time: b.time,
                    endTime: b.endTime,
                    duration: b.duration
                })),
                schedule: schedule || { available: false }
            }
        });
    } catch (error) {
        next(error);
    }
};
