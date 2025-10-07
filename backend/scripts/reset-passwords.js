import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
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

// Verificar y resetear contraseñas
const resetPasswords = async () => {
    try {
        const emails = ['daxkenyi001@gmail.com', 'daxkenyi003@gmail.com'];
        const newPassword = '12345678';
        
        console.log('\n🔑 Reseteando contraseñas...\n');
        
        for (const email of emails) {
            // Buscar usuario con password incluido
            const user = await User.findOne({ email }).select('+password');
            
            if (user) {
                console.log(`\n👤 Usuario encontrado: ${email}`);
                console.log(`   Password hash actual: ${user.password.substring(0, 30)}...`);
                
                // Verificar si la contraseña actual funciona
                const isMatch = await user.matchPassword(newPassword);
                console.log(`   ¿Password '${newPassword}' funciona?: ${isMatch}`);
                
                if (!isMatch) {
                    console.log(`   ⚠️  Password no coincide, actualizando...`);
                    
                    // Actualizar manualmente con hash
                    const salt = await bcrypt.genSalt(12);
                    const hashedPassword = await bcrypt.hash(newPassword, salt);
                    
                    await User.updateOne(
                        { _id: user._id },
                        { $set: { password: hashedPassword } }
                    );
                    
                    // Verificar que funcionó
                    const updatedUser = await User.findOne({ email }).select('+password');
                    const newMatch = await updatedUser.matchPassword(newPassword);
                    
                    if (newMatch) {
                        console.log(`   ✅ Password actualizado y verificado correctamente`);
                    } else {
                        console.log(`   ❌ Error: Password actualizado pero no funciona`);
                    }
                } else {
                    console.log(`   ✅ Password ya es correcto`);
                }
            } else {
                console.log(`\n❌ Usuario no encontrado: ${email}`);
            }
        }
        
        console.log('\n✅ Proceso completado\n');
        
    } catch (error) {
        console.error('❌ Error al resetear contraseñas:', error);
    }
};

// Ejecutar script
const run = async () => {
    await connectDB();
    await resetPasswords();
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
    process.exit(0);
};

run();
