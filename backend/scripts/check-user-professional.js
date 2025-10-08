import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Professional from '../models/Professional.js';

// Cargar variables de entorno
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kalos-dev';

async function checkUserAndProfessional(email) {
    try {
        // Conectar a MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado a MongoDB\n');

        // Buscar usuario por email
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log(`❌ No se encontró usuario con email: ${email}`);
            return;
        }

        console.log('👤 Usuario encontrado:');
        console.log(`   ID: ${user._id}`);
        console.log(`   Nombre: ${user.firstName} ${user.lastName}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Rol: ${user.role}`);
        console.log(`   Cuenta activa: ${user.isActive ? 'Sí' : 'No'}`);
        console.log(`   Email verificado: ${user.emailVerified ? 'Sí' : 'No'}\n`);

        // Buscar perfil profesional
        const professional = await Professional.findOne({ user: user._id });
        
        if (!professional) {
            console.log('⚠️  Este usuario NO tiene perfil profesional');
            console.log('   Para crear servicios, primero debes crear un perfil profesional\n');
            return;
        }

        console.log('✅ Perfil profesional encontrado:');
        console.log(`   ID: ${professional._id}`);
        console.log(`   Negocio: ${professional.businessName || 'Sin nombre'}`);
        console.log(`   Estado: ${professional.profileStatus}`);
        console.log(`   Disponible: ${professional.isAvailable ? 'Sí' : 'No'}`);
        console.log(`   Ubicación: ${professional.serviceLocation?.type || 'No especificado'}`);
        console.log(`   Completitud: ${professional.profileCompleteness}%\n`);

        // Contar servicios
        const Service = (await import('../models/Service.js')).default;
        const serviceCount = await Service.countDocuments({ professional: professional._id });
        console.log(`📋 Servicios creados: ${serviceCount}\n`);

        if (serviceCount > 0) {
            const services = await Service.find({ professional: professional._id })
                .select('name category pricing.basePrice isActive')
                .limit(5);
            
            console.log('   Últimos servicios:');
            services.forEach(service => {
                console.log(`   - ${service.name} (${service.category}) - Bs ${service.pricing.basePrice} ${service.isActive ? '✅' : '❌'}`);
            });
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('\n✅ Conexión cerrada');
    }
}

// Obtener email de los argumentos o usar uno por defecto
const email = process.argv[2] || 'daxkenyi001@gmail.com';

console.log(`\n🔍 Verificando usuario: ${email}\n`);
console.log('='.repeat(50) + '\n');

checkUserAndProfessional(email);
