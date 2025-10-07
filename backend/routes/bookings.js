import express from 'express';
import { body } from 'express-validator';
import {
    getBookings,
    getBooking,
    createBooking,
    updateBooking,
    deleteBooking,
    getAvailability
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Validaciones
const bookingValidation = [
    body('professionalId').trim().notEmpty().withMessage('El ID del profesional es requerido'),
    body('serviceId').trim().notEmpty().withMessage('El ID del servicio es requerido'),
    body('date').isISO8601().withMessage('Fecha inválida'),
    body('time')
        .trim()
        .notEmpty()
        .withMessage('La hora es requerida')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Formato de hora inválido (HH:MM)')
];

// Ruta pública para disponibilidad
router.get('/availability/:professionalId', getAvailability);

// Todas las demás rutas requieren autenticación
router.use(protect);

// Rutas protegidas
router.get('/', getBookings);
router.get('/:id', getBooking);
router.post('/', bookingValidation, createBooking);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);

export default router;
