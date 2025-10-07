import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Conectar a MongoDB
const connectDB = async () => {
    try {
        // Usar la misma BD que el servidor: kalos-dev
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kalos-dev';
        await mongoose.connect(mongoUri);
        console.log('✅ MongoDB conectado a:', mongoUri);
    } catch (error) {
        console.error('❌ Error al conectar MongoDB:', error);
        process.exit(1);
    }
};

// Crear usuarios de prueba
const createTestUsers = async () => {
    try {
        console.log('\n📝 Creando usuarios de prueba...\n');
        
        const usersData = [
            {
                firstName: 'Kenyi',
                lastName: 'Test 001',
                email: 'daxkenyi001@gmail.com',
                password: '12345678',
                role: 'professional'
            },
            {
                firstName: 'Kenyi',
                lastName: 'Test 003',
                email: 'daxkenyi003@gmail.com',
                password: '12345678',
                role: 'professional'
            }
        ];
        
        for (const userData of usersData) {
            // Verificar si el usuario ya existe
            const existingUser = await User.findOne({ email: userData.email });
            
            if (existingUser) {
                console.log(`⚠️  Usuario ya existe: ${userData.email}`);
                console.log(`   Actualizando rol a 'professional'...`);
                existingUser.role = 'professional';
                await existingUser.save();
                console.log(`   ✅ Usuario actualizado`);
            } else {
                // Crear nuevo usuario
                const user = await User.create(userData);
                console.log(`✅ Usuario creado exitosamente:`);
                console.log(`   ID: ${user._id}`);
                console.log(`   Nombre: ${user.firstName} ${user.lastName}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Rol: ${user.role}`);
            }
            console.log('');
        }
        
        console.log('✅ Proceso completado\n');
        
    } catch (error) {
        console.error('❌ Error al crear usuarios:', error);
    }
};

// Ejecutar script
const run = async () => {
    await connectDB();
    await createTestUsers();
    
    // Listar todos los usuarios después de crearlos
    console.log('📋 Verificando usuarios creados:\n');
    const users = await User.find({});
    users.forEach((user, index) => {
        console.log(`👤 Usuario ${index + 1}:`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Rol: ${user.role}`);
        console.log('');
    });
    
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
    process.exit(0);
};

run();
