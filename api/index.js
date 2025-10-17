import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración de __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar rutas del backend
import authRoutes from '../backend/routes/auth.js';
import professionalRoutes from '../backend/routes/professionals.js';
import serviceRoutes from '../backend/routes/services.js';
import bookingRoutes from '../backend/routes/bookings.js';
import userRoutes from '../backend/routes/users.js';
import uploadRoutes from '../backend/routes/upload.js';

// Health check
app.get('/api', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Kalos API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

// Manejo de rutas no encontradas
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    message: err.message || 'Error del servidor',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Para Vercel Serverless Functions
export default app;
