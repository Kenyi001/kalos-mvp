import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

// Conectar a MongoDB (con cache para serverless)
let cachedDb = null;

const connectDB = async () => {
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log('✅ Usando conexión existente de MongoDB');
    return cachedDb;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    cachedDb = db;
    console.log('✅ MongoDB conectado:', db.connection.host);
    return db;
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    throw error;
  }
};

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Conectar a BD antes de cada request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: { 
        message: 'Error de conexión a la base de datos',
        status: 500
      }
    });
  }
});

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
    success: true,
    status: 'ok', 
    message: 'Kalos API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
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
  res.status(404).json({ 
    success: false,
    error: {
      message: 'API endpoint not found',
      status: 404
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    success: false,
    error: {
      message: err.message || 'Error del servidor',
      status: err.status || 500,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// Para Vercel Serverless Functions - exportar el handler
export default async (req, res) => {
  // Permitir que Express maneje la request
  return app(req, res);
};
