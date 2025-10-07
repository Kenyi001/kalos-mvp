import express from 'express';
import { body } from 'express-validator';
import {
    getProfessionals,
    getProfessional,
    createProfessional,
    updateProfessional,
    deleteProfessional
} from '../controllers/professionalController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Validaciones para crear profesional (solo lo esencial)
const professionalValidation = [
    body('serviceLocation.type')
        .notEmpty()
        .withMessage('El tipo de servicio es requerido')
        .isIn(['home_service', 'salon_service', 'both'])
        .withMessage('Tipo de servicio inválido')
];

// Rutas públicas
router.get('/', getProfessionals);
router.get('/:id', getProfessional);

// Rutas protegidas
router.post('/', protect, professionalValidation, createProfessional);
router.put('/:id', protect, updateProfessional);
router.delete('/:id', protect, deleteProfessional);

export default router;
