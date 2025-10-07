import mongoose from 'mongoose';
import Service from '../models/Service.js';
import Professional from '../models/Professional.js';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kalos-dev';

async function listServices() {
    try {
        console.log('🔗 Conectando a MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado a MongoDB\n');

        // Obtener todos los servicios con población del profesional
        const services = await Service.find().populate('professional');
        
        console.log(`📋 Total de servicios en la base de datos: ${services.length}\n`);
        
        if (services.length === 0) {
            console.log('⚠️  No hay servicios en la base de datos');
        } else {
            services.forEach((service, index) => {
                console.log(`\n${index + 1}. ${service.name}`);
                console.log(`   ID del servicio: ${service._id}`);
                console.log(`   Professional ID (campo): ${service.professional}`);
                
                if (service.professional && typeof service.professional === 'object') {
                    console.log(`   Professional ID (poblado): ${service.professional._id}`);
                    console.log(`   Professional User ID: ${service.professional.user}`);
                    console.log(`   Professional Nombre: ${service.professional.businessName || 'N/A'}`);
                } else {
                    console.log(`   ⚠️  Professional no poblado correctamente`);
                }
                
                console.log(`   Categoría: ${service.category}`);
                console.log(`   Precio: ${service.pricing?.priceRange?.min || 0}€ - ${service.pricing?.priceRange?.max || 0}€`);
                console.log(`   Activo: ${service.isActive}`);
            });
        }

        // Obtener profesionales para comparación
        console.log('\n\n👥 Profesionales en la base de datos:');
        const professionals = await Professional.find().populate('user');
        professionals.forEach((prof, index) => {
            console.log(`\n${index + 1}. ${prof.businessName || 'Sin nombre'}`);
            console.log(`   Professional ID: ${prof._id}`);
            console.log(`   User ID: ${prof.user?._id || prof.user}`);
            if (prof.user && typeof prof.user === 'object') {
                console.log(`   Email: ${prof.user.email}`);
                console.log(`   Rol: ${prof.user.role}`);
            }
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n✅ Desconectado de MongoDB');
    }
}

listServices();
