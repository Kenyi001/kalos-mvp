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

// Función para revisar y corregir usuarios
const fixUsers = async () => {
    try {
        const emails = ['daxkenyi001@gmail.com', 'daxkenyi003@gmail.com'];
        
        console.log('\n📋 Buscando usuarios...\n');
        
        for (const email of emails) {
            const user = await User.findOne({ email });
            
            if (user) {
                console.log(`\n👤 Usuario encontrado: ${email}`);
                console.log(`   ID: ${user._id}`);
                console.log(`   Nombre: ${user.firstName} ${user.lastName}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Rol actual: ${user.role}`);
                console.log(`   Fecha de creación: ${user.createdAt}`);
                
                // Verificar si el rol es correcto
                if (user.role !== 'professional') {
                    console.log(`   ⚠️  Rol incorrecto, corrigiendo...`);
                    user.role = 'professional';
                    await user.save();
                    console.log(`   ✅ Rol actualizado a 'professional'`);
                } else {
                    console.log(`   ✅ Rol correcto: professional`);
                }
            } else {
                console.log(`\n❌ Usuario no encontrado: ${email}`);
            }
        }
        
        console.log('\n✅ Proceso completado\n');
        
    } catch (error) {
        console.error('❌ Error al procesar usuarios:', error);
    }
};

// Ejecutar script
const run = async () => {
    await connectDB();
    await fixUsers();
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
    process.exit(0);
};

run();
