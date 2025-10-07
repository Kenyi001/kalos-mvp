import Service from '../models/Service.js';
import { validationResult } from 'express-validator';

// @desc    Obtener todos los servicios
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res, next) => {
    try {
        const { category, professionalId } = req.query;
        let query = {};

        if (category && category !== 'all') {
            query.category = category;
        }

        if (professionalId) {
            query.professional = professionalId;
        }

        const services = await Service.find(query)
            .populate('professional', 'specialty rating');

        res.status(200).json({
            success: true,
            count: services.length,
            data: services
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Obtener un servicio
// @route   GET /api/services/:id
// @access  Public
export const getService = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id)
            .populate('professional');

        if (!service) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Servicio no encontrado',
                    status: 404
                }
            });
        }

        res.status(200).json({
            success: true,
            data: service
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Crear servicio
// @route   POST /api/services
// @access  Private
export const createService = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Datos de entrada inválidos',
                    status: 400,
                    details: errors.array()
                }
            });
        }

        // Buscar el perfil profesional del usuario
        const Professional = await import('../models/Professional.js');
        const professionalProfile = await Professional.default.findOne({ user: req.user.id });
        
        if (!professionalProfile) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Debes crear un perfil profesional antes de añadir servicios',
                    status: 404
                }
            });
        }

        // Preparar datos del servicio
        const serviceData = {
            professional: req.body.professional || professionalProfile._id,
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            pricing: req.body.pricing,
            duration: req.body.duration,
            includes: req.body.includes || [],
            requirements: req.body.requirements,
            serviceConfig: req.body.serviceConfig || {
                location: 'salon', // Default
                maxClientsSimultaneous: 1,
                requiresDeposit: false,
                advanceBookingRequired: 24
            },
            images: req.body.images || [],
            tags: req.body.tags || [],
            isActive: req.body.isActive !== undefined ? req.body.isActive : true
        };

        const service = await Service.create(serviceData);
        
        // Poblar información del profesional
        await service.populate('professional', 'specialties metrics.averageRating');

        res.status(201).json({
            success: true,
            data: service
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Actualizar servicio
// @route   PUT /api/services/:id
// @access  Private
export const updateService = async (req, res, next) => {
    try {
        let service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Servicio no encontrado',
                    status: 404
                }
            });
        }

        // Buscar el perfil profesional del usuario autenticado
        const Professional = await import('../models/Professional.js');
        const professionalProfile = await Professional.default.findOne({ user: req.user.id });
        
        if (!professionalProfile) {
            return res.status(403).json({
                success: false,
                error: {
                    message: 'No tienes un perfil profesional',
                    status: 403
                }
            });
        }

        // Verificar permisos - comparar Professional IDs
        // service.professional puede ser un ObjectId o un objeto poblado
        const serviceProfessionalId = service.professional._id || service.professional;
        
        if (serviceProfessionalId.toString() !== professionalProfile._id.toString()) {
            return res.status(403).json({
                success: false,
                error: {
                    message: 'No autorizado para actualizar este servicio',
                    status: 403
                }
            });
        }

        service = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            data: service
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Eliminar servicio
// @route   DELETE /api/services/:id
// @access  Private
export const deleteService = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Servicio no encontrado',
                    status: 404
                }
            });
        }

        // Buscar el perfil profesional del usuario autenticado
        const Professional = await import('../models/Professional.js');
        const professionalProfile = await Professional.default.findOne({ user: req.user.id });
        
        if (!professionalProfile) {
            return res.status(403).json({
                success: false,
                error: {
                    message: 'No tienes un perfil profesional',
                    status: 403
                }
            });
        }

        // Verificar permisos - comparar Professional IDs
        // service.professional puede ser un ObjectId o un objeto poblado
        const serviceProfessionalId = service.professional._id || service.professional;
        
        if (serviceProfessionalId.toString() !== professionalProfile._id.toString()) {
            return res.status(403).json({
                success: false,
                error: {
                    message: 'No autorizado para eliminar este servicio',
                    status: 403
                }
            });
        }

        await service.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};
