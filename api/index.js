import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Cargar variables de entorno
dotenv.config();

// Conectar a MongoDB (con cache para serverless)
let cachedDb = null;

const connectDB = async () => {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    cachedDb = db;
    console.log('✅ MongoDB conectado');
    return db;
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    throw error;
  }
};

// Crear app Express
const app = express();

// CORS para todas las origins
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Conectar a BD antes de cada request
app.use(async (req, res, next) => {
  // Log para debugging en Vercel
  console.log(`📍 ${req.method} ${req.path} - Query:`, req.query);
  
  try {
    await connectDB();
    next();
  } catch (error) {
    return res.status(500).json({ 
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

// Debug middleware
app.use((req, res, next) => {
  console.log('📍 Request:', {
    method: req.method,
    path: req.path,
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl
  });
  next();
});

// Health check en la raíz de /api
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    status: 'ok', 
    message: 'Kalos API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    success: true,
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Montar rutas CON el prefijo /api para Vercel
app.use('/api/auth', authRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    error: {
      message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
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

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 API local en puerto ${PORT}`);
  });
}

// Exportar para Vercel Serverless Functions
export default app;
