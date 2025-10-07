import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Conectar a MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/kalos-mvp');
        console.log('✅ MongoDB conectado');
    } catch (error) {
        console.error('❌ Error al conectar MongoDB:', error);
        process.exit(1);
    }
};

// Listar todos los usuarios
const listUsers = async () => {
    try {
        const users = await User.find({});
        
        console.log(`\n📋 Total de usuarios en la base de datos: ${users.length}\n`);
        
        if (users.length === 0) {
            console.log('❌ No hay usuarios registrados en la base de datos');
        } else {
            users.forEach((user, index) => {
                console.log(`\n👤 Usuario ${index + 1}:`);
                console.log(`   ID: ${user._id}`);
                console.log(`   Nombre: ${user.firstName} ${user.lastName}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Rol: ${user.role}`);
                console.log(`   Fecha de creación: ${user.createdAt}`);
            });
        }
        
        console.log('\n');
        
    } catch (error) {
        console.error('❌ Error al listar usuarios:', error);
    }
};

// Ejecutar script
const run = async () => {
    await connectDB();
    await listUsers();
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
    process.exit(0);
};

run();
