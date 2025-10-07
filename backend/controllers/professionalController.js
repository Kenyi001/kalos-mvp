import Professional from '../models/Professional.js';
import { validationResult } from 'express-validator';

// @desc    Obtener todos los profesionales
// @route   GET /api/professionals
// @access  Public
export const getProfessionals = async (req, res, next) => {
    try {
        const { category, search, sort } = req.query;
        let query = {};

        // Filtrar por categoría
        if (category && category !== 'all') {
            query.specialty = category;
        }

        // Búsqueda por nombre o especialidad
        if (search) {
            query.$or = [
                { 'user.name': { $regex: search, $options: 'i' } },
                { specialty: { $regex: search, $options: 'i' } }
            ];
        }

        let professionals = Professional.find(query).populate('user', 'name email');

        // Ordenar
        if (sort === 'rating') {
            professionals = professionals.sort('-rating');
        } else if (sort === 'popular') {
            professionals = professionals.sort('-reviewCount');
        }

        const results = await professionals;

        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Obtener un profesional
// @route   GET /api/professionals/:id
// @access  Public
export const getProfessional = async (req, res, next) => {
    try {
        const professional = await Professional.findById(req.params.id)
            .populate('user', 'name email')
            .populate('services');

        if (!professional) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Profesional no encontrado',
                    status: 404
                }
            });
        }

        res.status(200).json({
            success: true,
            data: professional
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Crear perfil profesional
// @route   POST /api/professionals
// @access  Private
export const createProfessional = async (req, res, next) => {
    try {
        // Verificar si ya existe un perfil profesional para este usuario
        const existingProfessional = await Professional.findOne({ user: req.user.id });
        if (existingProfessional) {
            return res.status(409).json({
                success: false,
                error: {
                    message: 'Ya existe un perfil profesional para este usuario',
                    status: 409
                }
            });
        }

        // Preparar datos del profesional
        const professionalData = {
            user: req.user.id,
            description: req.body.description,
            specialties: req.body.specialties || [],
            businessName: req.body.businessName,
            experience: req.body.experience,
            certifications: req.body.certifications || [],
            portfolio: req.body.portfolio || [],
            contactInfo: req.body.contactInfo,
            serviceLocation: req.body.serviceLocation,
            availability: req.body.availability,
            pricingConfig: req.body.pricingConfig
        };

        // Crear profesional
        const professional = await Professional.create(professionalData);

        // Actualizar el usuario con el professionalId
        const User = (await import('../models/User.js')).default;
        await User.findByIdAndUpdate(req.user.id, {
            professionalId: professional._id
        });

        // Poblar información del usuario
        await professional.populate('user', 'firstName lastName email avatar phone');

        res.status(201).json({
            success: true,
            data: professional
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Actualizar profesional
// @route   PUT /api/professionals/:id
// @access  Private
export const updateProfessional = async (req, res, next) => {
    try {
        let professional = await Professional.findById(req.params.id);

        if (!professional) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Profesional no encontrado',
                    status: 404
                }
            });
        }

        // Verificar que el usuario sea el dueño del perfil
        // Manejar tanto professional.user como ObjectId y objeto poblado
        const professionalUserId = professional.user?._id?.toString() || professional.user?.toString();
        if (professionalUserId !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: {
                    message: 'No autorizado para actualizar este perfil',
                    status: 403
                }
            });
        }

        professional = await Professional.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            data: professional
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Eliminar profesional
// @route   DELETE /api/professionals/:id
// @access  Private
export const deleteProfessional = async (req, res, next) => {
    try {
        const professional = await Professional.findById(req.params.id);

        if (!professional) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Profesional no encontrado',
                    status: 404
                }
            });
        }

        // Verificar que el usuario sea el dueño del perfil
        // Manejar tanto professional.user como ObjectId y objeto poblado
        const professionalUserId = professional.user?._id?.toString() || professional.user?.toString();
        if (professionalUserId !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: {
                    message: 'No autorizado para eliminar este perfil',
                    status: 403
                }
            });
        }

        await professional.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};
