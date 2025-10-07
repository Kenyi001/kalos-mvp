import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

// Importar rutas
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import professionalRoutes from './routes/professionals.js';
import serviceRoutes from './routes/services.js';
import bookingRoutes from './routes/bookings.js';
import uploadRoutes from './routes/upload.js';

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();

// Conectar a la base de datos
connectDB();

// Configurar Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // límite de 100 requests por ventana por IP
    message: {
        success: false,
        error: {
            message: 'Demasiadas solicitudes desde esta IP, intenta nuevamente en 15 minutos.',
            status: 429
        }
    }
});

// Middlewares globales
app.use(helmet()); // Seguridad HTTP
app.use(compression()); // Compresión GZIP
app.use(limiter); // Rate limiting
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(morgan('combined')); // Logging de requests
app.use(express.json({ limit: '10mb' })); // Parser JSON
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parser URL encoded

// Ruta de salud del servidor
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Kalos API funcionando correctamente',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/upload', uploadRoutes);

// Middleware para rutas no encontradas
app.use(notFound);

// Middleware global de manejo de errores
app.use(errorHandler);

// Configurar puerto
const PORT = process.env.PORT || 3001;

// Iniciar servidor
const server = app.listen(PORT, () => {
    console.log(`🚀 Kalos API ejecutándose en puerto ${PORT}`);
    console.log(`🌍 Entorno: ${process.env.NODE_ENV}`);
    console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

// Manejo graceful de cierre del servidor
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM recibido. Cerrando servidor HTTP gracefully...');
    server.close(() => {
        console.log('✅ Proceso terminado');
    });
});

export default app;