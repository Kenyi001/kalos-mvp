import mongoose from 'mongoose';
import User from '../models/User.js';
import Professional from '../models/Professional.js';
import Service from '../models/Service.js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Conectar a MongoDB
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kalos-dev';
        await mongoose.connect(mongoUri);
        console.log('✅ MongoDB conectado a:', mongoUri);
    } catch (error) {
        console.error('❌ Error al conectar MongoDB:', error);
        process.exit(1);
    }
};

// Datos de profesionales de Santa Cruz
const professionalsData = [
    {
        user: {
            firstName: 'María',
            lastName: 'González',
            email: 'maria.gonzalez@kalos.com',
            password: 'kalos2024',
            role: 'professional',
            phone: '+59133456789'
        },
        professional: {
            businessName: 'Estética María - Santa Cruz',
            description: 'Especialista en tratamientos faciales y corporales con más de 10 años de experiencia. Utilizo productos premium importados y técnicas europeas para garantizar los mejores resultados. Mi salón está ubicado en el centro de Santa Cruz.',
            specialties: ['Tratamientos Faciales', 'Depilación', 'Masajes Relajantes'],
            experience: {
                years: 10,
                description: 'Certificada en estética facial y corporal por la Academia Internacional de Belleza. He trabajado en los mejores salones de Santa Cruz y ahora tengo mi propio espacio.'
            },
            serviceLocation: {
                type: 'both',
                salonAddress: {
                    street: 'Av. San Martín #234',
                    city: 'Santa Cruz de la Sierra',
                    state: 'Santa Cruz',
                    zipCode: '00000',
                    coordinates: {
                        lat: -17.7833,
                        lng: -63.1821
                    }
                },
                serviceRadius: 15
            },
            availability: {
                schedule: {
                    monday: { available: true, hours: { start: '09:00', end: '18:00' } },
                    tuesday: { available: true, hours: { start: '09:00', end: '18:00' } },
                    wednesday: { available: true, hours: { start: '09:00', end: '18:00' } },
                    thursday: { available: true, hours: { start: '09:00', end: '18:00' } },
                    friday: { available: true, hours: { start: '09:00', end: '19:00' } },
                    saturday: { available: true, hours: { start: '10:00', end: '17:00' } },
                    sunday: { available: false, hours: { start: '00:00', end: '00:00' } }
                }
            },
            contactInfo: {
                businessPhone: '+59133456789',
                whatsapp: '+59170123456'
            },
            profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
            isAvailable: true
        },
        services: [
            {
                name: 'Limpieza Facial Profunda',
                category: 'facial_limpieza',
                description: 'Limpieza profunda con extracción de impurezas, exfoliación, mascarilla hidratante y tonificación. Incluye masaje facial relajante.',
                pricing: { 
                    basePrice: 180, 
                    priceRange: { min: 150, max: 200 },
                    currency: 'BOB' 
                },
                duration: { estimated: 60, bufferTime: 15 },
                includes: ['Limpieza profunda', 'Extracción', 'Mascarilla', 'Masaje facial'],
                serviceConfig: {
                    location: 'both',
                    requiresDeposit: false
                }
            },
            {
                name: 'Masaje Relajante Corporal',
                category: 'masaje_relajante',
                description: 'Masaje de cuerpo completo con aceites esenciales. Ideal para liberar tensiones y estrés.',
                pricing: { 
                    basePrice: 250, 
                    priceRange: { min: 220, max: 280 },
                    currency: 'BOB' 
                },
                duration: { estimated: 90, bufferTime: 15 },
                includes: ['Masaje corporal completo', 'Aceites esenciales', 'Ambiente relajante'],
                serviceConfig: {
                    location: 'salon',
                    requiresDeposit: false
                }
            },
            {
                name: 'Depilación con Cera - Piernas Completas',
                category: 'depilacion_cera',
                description: 'Depilación profesional con cera de alta calidad. Incluye hidratación post-depilación.',
                pricing: { 
                    basePrice: 120, 
                    priceRange: { min: 100, max: 140 },
                    currency: 'BOB' 
                },
                duration: { estimated: 45, bufferTime: 10 },
                includes: ['Depilación piernas completas', 'Cera de calidad', 'Crema hidratante'],
                serviceConfig: {
                    location: 'salon',
                    requiresDeposit: false
                }
            }
        ]
    },
    {
        user: {
            firstName: 'Carlos',
            lastName: 'Pérez',
            email: 'carlos.perez@kalos.com',
            password: 'kalos2024',
            role: 'professional',
            phone: '+59134567890'
        },
        professional: {
            businessName: 'Barbería Premium Carlos',
            description: 'Barbero profesional especializado en cortes modernos y clásicos. Ofrezco un servicio personalizado en un ambiente relajado. Uso productos de primera calidad y técnicas actualizadas.',
            specialties: ['Corte de Cabello', 'Afeitado', 'Arreglo de Barba'],
            experience: {
                years: 8,
                description: 'Barbero certificado con experiencia en cortes clásicos y modernos. Me especializo en fade cuts, degradados y diseños creativos.'
            },
            serviceLocation: {
                type: 'salon',
                salonAddress: {
                    street: 'Calle Libertad #567',
                    city: 'Santa Cruz de la Sierra',
                    state: 'Santa Cruz',
                    zipCode: '00000',
                    coordinates: {
                        lat: -17.7892,
                        lng: -63.1975
                    }
                }
            },
            availability: {
                schedule: {
                    monday: { available: true, hours: { start: '10:00', end: '20:00' } },
                    tuesday: { available: true, hours: { start: '10:00', end: '20:00' } },
                    wednesday: { available: true, hours: { start: '10:00', end: '20:00' } },
                    thursday: { available: true, hours: { start: '10:00', end: '20:00' } },
                    friday: { available: true, hours: { start: '10:00', end: '21:00' } },
                    saturday: { available: true, hours: { start: '09:00', end: '21:00' } },
                    sunday: { available: true, hours: { start: '10:00', end: '15:00' } }
                }
            },
            contactInfo: {
                businessPhone: '+59134567890',
                whatsapp: '+59171234567'
            },
            profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
            isAvailable: true
        },
        services: [
            {
                name: 'Corte Caballero + Arreglo de Barba',
                category: 'corte_cabello',
                description: 'Corte de cabello moderno con máquina y tijera, incluye arreglo y perfilado de barba con navaja.',
                pricing: { 
                    basePrice: 80, 
                    priceRange: { min: 70, max: 90 },
                    currency: 'BOB' 
                },
                duration: { estimated: 45, bufferTime: 10 },
                includes: ['Corte con máquina y tijera', 'Arreglo de barba', 'Perfilado'],
                serviceConfig: {
                    location: 'salon',
                    requiresDeposit: false
                }
            },
            {
                name: 'Fade Cut Profesional',
                category: 'corte_cabello',
                description: 'Corte degradado profesional con máquina, incluye diseño de líneas y acabado con navaja.',
                pricing: { 
                    basePrice: 90, 
                    priceRange: { min: 80, max: 100 },
                    currency: 'BOB' 
                },
                duration: { estimated: 50, bufferTime: 10 },
                includes: ['Corte fade profesional', 'Diseño de líneas', 'Acabado con navaja'],
                serviceConfig: {
                    location: 'salon',
                    requiresDeposit: false
                }
            },
            {
                name: 'Afeitado Clásico con Navaja',
                category: 'otro',
                description: 'Afeitado tradicional con navaja, toallas calientes y productos premium. Experiencia de barbería clásica.',
                pricing: { 
                    basePrice: 60, 
                    priceRange: { min: 50, max: 70 },
                    currency: 'BOB' 
                },
                duration: { estimated: 30, bufferTime: 10 },
                includes: ['Afeitado con navaja', 'Toallas calientes', 'Productos premium'],
                serviceConfig: {
                    location: 'salon',
                    requiresDeposit: false
                }
            }
        ]
    },
    {
        user: {
            firstName: 'Ana',
            lastName: 'Rodríguez',
            email: 'ana.rodriguez@kalos.com',
            password: 'kalos2024',
            role: 'professional',
            phone: '+59135678901'
        },
        professional: {
            businessName: 'Ana Nails & Beauty',
            description: 'Especialista en manicura, pedicura y uñas esculpidas. Trabajo con productos de última generación y técnicas modernas. Mi objetivo es que luzcas unas manos y pies hermosos.',
            specialties: ['Manicura', 'Pedicura', 'Uñas Esculpidas', 'Nail Art'],
            experience: {
                years: 6,
                description: 'Manicurista certificada con especialización en uñas acrílicas, gel y diseños personalizados. Actualizo constantemente mis conocimientos con las últimas tendencias.'
            },
            serviceLocation: {
                type: 'both',
                salonAddress: {
                    street: 'Av. Cristo Redentor #890',
                    city: 'Santa Cruz de la Sierra',
                    state: 'Santa Cruz',
                    zipCode: '00000',
                    coordinates: {
                        lat: -17.7764,
                        lng: -63.1812
                    }
                },
                serviceRadius: 10
            },
            availability: {
                schedule: {
                    monday: { available: true, hours: { start: '09:00', end: '19:00' } },
                    tuesday: { available: true, hours: { start: '09:00', end: '19:00' } },
                    wednesday: { available: true, hours: { start: '09:00', end: '19:00' } },
                    thursday: { available: true, hours: { start: '09:00', end: '19:00' } },
                    friday: { available: true, hours: { start: '09:00', end: '20:00' } },
                    saturday: { available: true, hours: { start: '10:00', end: '18:00' } },
                    sunday: { available: false, hours: { start: '00:00', end: '00:00' } }
                }
            },
            contactInfo: {
                businessPhone: '+59135678901',
                whatsapp: '+59172345678'
            },
            profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
            isAvailable: true
        },
        services: [
            {
                name: 'Manicura Completa + Esmaltado Permanente',
                category: 'manicura',
                description: 'Manicura profesional con limado, cutícula, hidratación y esmaltado semipermanente que dura hasta 3 semanas.',
                pricing: { 
                    basePrice: 100, 
                    priceRange: { min: 80, max: 120 },
                    currency: 'BOB' 
                },
                duration: { estimated: 60, bufferTime: 15 },
                includes: ['Limado', 'Arreglo de cutícula', 'Hidratación', 'Esmaltado semipermanente'],
                serviceConfig: {
                    location: 'both',
                    requiresDeposit: false
                }
            },
            {
                name: 'Pedicura Spa Completa',
                category: 'pedicura',
                description: 'Pedicura spa con exfoliación, hidratación profunda, masaje de pies y esmaltado permanente. Incluye baño de sales.',
                pricing: { 
                    basePrice: 120, 
                    priceRange: { min: 100, max: 140 },
                    currency: 'BOB' 
                },
                duration: { estimated: 75, bufferTime: 15 },
                includes: ['Baño de sales', 'Exfoliación', 'Masaje de pies', 'Esmaltado permanente'],
                serviceConfig: {
                    location: 'salon',
                    requiresDeposit: false
                }
            },
            {
                name: 'Uñas Esculpidas en Gel',
                category: 'unas_gel',
                description: 'Uñas esculpidas en gel con diseño personalizado. Incluye decoración básica y acabado brillante.',
                pricing: { 
                    basePrice: 150, 
                    priceRange: { min: 130, max: 180 },
                    currency: 'BOB' 
                },
                duration: { estimated: 90, bufferTime: 15 },
                includes: ['Uñas esculpidas en gel', 'Diseño personalizado', 'Decoración básica', 'Acabado brillante'],
                serviceConfig: {
                    location: 'salon',
                    requiresDeposit: true
                }
            },
            {
                name: 'Diseño de Uñas (Nail Art)',
                category: 'manicura',
                description: 'Diseño artístico personalizado en uñas naturales o esculpidas. Incluye decoraciones, strass y efectos especiales.',
                pricing: { 
                    basePrice: 80, 
                    priceRange: { min: 60, max: 100 },
                    currency: 'BOB' 
                },
                duration: { estimated: 45, bufferTime: 10 },
                includes: ['Diseño artístico', 'Decoraciones', 'Strass', 'Efectos especiales'],
                serviceConfig: {
                    location: 'both',
                    requiresDeposit: false
                }
            }
        ]
    }
];

// Función para crear profesionales y servicios
const seedProfessionals = async () => {
    try {
        console.log('\n🌱 Iniciando seeder de profesionales de Santa Cruz...\n');
        
        for (const data of professionalsData) {
            console.log(`\n👤 Procesando: ${data.user.firstName} ${data.user.lastName} (${data.user.email})`);
            
            // 1. Verificar si el usuario ya existe
            let user = await User.findOne({ email: data.user.email });
            
            if (user) {
                console.log(`   ⚠️  Usuario ya existe (ID: ${user._id})`);
                console.log(`   Actualizando información...`);
                user.firstName = data.user.firstName;
                user.lastName = data.user.lastName;
                user.role = data.user.role;
                user.phone = data.user.phone;
                await user.save();
            } else {
                // Crear usuario
                user = await User.create(data.user);
                console.log(`   ✅ Usuario creado (ID: ${user._id})`);
            }
            
            // 2. Verificar si el perfil profesional existe
            let professional = await Professional.findOne({ user: user._id });
            
            if (professional) {
                console.log(`   ⚠️  Perfil profesional ya existe (ID: ${professional._id})`);
                console.log(`   Actualizando información...`);
                Object.assign(professional, data.professional);
                professional.user = user._id;
                await professional.save();
            } else {
                // Crear perfil profesional
                professional = await Professional.create({
                    ...data.professional,
                    user: user._id
                });
                console.log(`   ✅ Perfil profesional creado (ID: ${professional._id})`);
            }
            
            // 3. Crear o actualizar servicios
            console.log(`   📋 Procesando ${data.services.length} servicios...`);
            
            for (const serviceData of data.services) {
                // Verificar si el servicio ya existe
                const existingService = await Service.findOne({
                    professional: professional._id,
                    name: serviceData.name
                });
                
                if (existingService) {
                    console.log(`      ⚠️  Servicio ya existe: ${serviceData.name}`);
                    Object.assign(existingService, serviceData);
                    existingService.professional = professional._id;
                    await existingService.save();
                } else {
                    await Service.create({
                        ...serviceData,
                        professional: professional._id
                    });
                    console.log(`      ✅ Servicio creado: ${serviceData.name}`);
                }
            }
            
            console.log(`   ✨ ${data.professional.businessName} - ¡Completado!`);
        }
        
        console.log('\n\n✅ ¡Seeder completado exitosamente!\n');
        
    } catch (error) {
        console.error('❌ Error en el seeder:', error);
        throw error;
    }
};

// Función para mostrar resumen
const showSummary = async () => {
    console.log('📊 RESUMEN DE DATOS CREADOS:\n');
    console.log('═'.repeat(60));
    
    const users = await User.find({ role: 'professional' });
    console.log(`\n👥 Total de profesionales: ${users.length}\n`);
    
    for (const user of users) {
        const professional = await Professional.findOne({ user: user._id });
        if (professional) {
            const services = await Service.find({ professional: professional._id });
            
            console.log(`📌 ${professional.businessName}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Contraseña: kalos2024`);
            console.log(`   Ubicación: ${professional.serviceLocation?.salonAddress?.city || 'N/A'}`);
            console.log(`   Servicios: ${services.length}`);
            services.forEach(s => {
                console.log(`      • ${s.name} - Bs ${s.pricing.basePrice} (${s.duration.estimated} min)`);
            });
            console.log('');
        }
    }
    
    console.log('═'.repeat(60));
    console.log('\n🔑 CREDENCIALES DE ACCESO:\n');
    console.log('   Email: maria.gonzalez@kalos.com | Password: kalos2024');
    console.log('   Email: carlos.perez@kalos.com   | Password: kalos2024');
    console.log('   Email: ana.rodriguez@kalos.com  | Password: kalos2024');
    console.log('\n');
};

// Ejecutar script
const run = async () => {
    try {
        await connectDB();
        await seedProfessionals();
        await showSummary();
        
        await mongoose.connection.close();
        console.log('🔌 Conexión cerrada');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error fatal:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

run();
