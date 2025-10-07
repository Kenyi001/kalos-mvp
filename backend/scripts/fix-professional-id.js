import mongoose from 'mongoose';
import User from '../models/User.js';
import Professional from '../models/Professional.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kalos-dev';

async function fixProfessionalId() {
    try {
        console.log('🔗 Conectando a MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado a MongoDB\n');

        // Buscar el usuario
        const user = await User.findOne({ email: 'daxkenyi001@gmail.com' });
        
        if (!user) {
            console.log('❌ Usuario no encontrado');
            return;
        }

        console.log('👤 Usuario encontrado:');
        console.log('   User ID:', user._id.toString());
        console.log('   Professional ID actual:', user.professionalId || 'NO TIENE');

        // Buscar el profesional asociado
        const professional = await Professional.findOne({ user: user._id });
        
        if (!professional) {
            console.log('\n❌ No se encontró perfil profesional para este usuario');
            return;
        }

        console.log('\n🎯 Profesional encontrado:');
        console.log('   Professional ID:', professional._id.toString());
        console.log('   Negocio:', professional.businessName);

        // Actualizar el usuario con el professionalId
        user.professionalId = professional._id;
        await user.save();

        console.log('\n✅ Usuario actualizado con professionalId:', professional._id.toString());
        console.log('\n🎉 Problema resuelto! Ahora el usuario puede ver sus servicios.');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n✅ Desconectado de MongoDB');
    }
}

fixProfessionalId();
