import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kalos-dev';

async function checkUser() {
    try {
        console.log('🔗 Conectando a MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado a MongoDB\n');

        // Buscar el usuario daxkenyi001@gmail.com
        const user = await User.findOne({ email: 'daxkenyi001@gmail.com' });
        
        if (!user) {
            console.log('❌ Usuario no encontrado');
            return;
        }

        console.log('👤 Usuario encontrado:');
        console.log('   Email:', user.email);
        console.log('   Nombre:', user.firstName, user.lastName);
        console.log('   User ID (_id):', user._id.toString());
        console.log('   Professional ID:', user.professionalId ? user.professionalId.toString() : 'NO TIENE');
        console.log('   Rol:', user.role);
        console.log('\n📋 Objeto completo:');
        console.log(JSON.stringify(user, null, 2));

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n✅ Desconectado de MongoDB');
    }
}

checkUser();
