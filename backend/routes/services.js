import express from 'express';
import { body } from 'express-validator';
import {
    getServices,
    getService,
    createService,
    updateService,
    deleteService
} from '../controllers/serviceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Validaciones
const serviceValidation = [
    body('name').trim().notEmpty().withMessage('El nombre es requerido'),
    body('description').trim().notEmpty().withMessage('La descripción es requerida'),
    body('pricing.basePrice').isNumeric().withMessage('El precio base debe ser un número'),
    body('pricing.priceRange.min').isNumeric().withMessage('El precio mínimo debe ser un número'),
    body('pricing.priceRange.max').isNumeric().withMessage('El precio máximo debe ser un número'),
    body('duration.estimated').isNumeric().withMessage('La duración debe ser un número'),
    body('category')
        .trim()
        .notEmpty()
        .withMessage('La categoría es requerida')
        .isIn([
            'corte_cabello', 'peinado', 'coloracion', 'tratamiento_capilar',
            'manicura', 'pedicura', 'unas_gel', 'unas_acrilicas',
            'facial_limpieza', 'facial_hidratante', 'facial_antiedad',
            'depilacion_cera', 'depilacion_laser',
            'masaje_relajante', 'masaje_descontracturante',
            'maquillaje_dia', 'maquillaje_noche', 'maquillaje_novias',
            'cejas_pestanas', 'otro'
        ])
        .withMessage('Categoría inválida'),
    body('serviceConfig.location')
        .optional()
        .isIn(['salon', 'home', 'both'])
        .withMessage('Ubicación de servicio inválida')
];

// Rutas públicas
router.get('/', getServices);
router.get('/:id', getService);

// Rutas protegidas (solo profesionales)
router.post('/', protect, serviceValidation, createService);
router.put('/:id', protect, updateService);
router.delete('/:id', protect, deleteService);

export default router;
