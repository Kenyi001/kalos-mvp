import express from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Ruta protegida para subir imágenes
router.post('/', protect, uploadImage);

export default router;
