import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Cargar variables de entorno
dotenv.config();

console.log('🔍 Probando conexión a MongoDB Atlas...\n');
console.log('📍 URI:', process.env.MONGODB_URI?.replace(/:[^:@]+@/, ':****@')); // Oculta la contraseña

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('\n✅ ¡Conexión exitosa a MongoDB Atlas!');
        console.log('📊 Base de datos:', mongoose.connection.name);
        console.log('🌍 Host:', mongoose.connection.host);
        console.log('✨ Estado:', mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado');
        
        // Cerrar la conexión
        mongoose.connection.close();
        console.log('\n👋 Conexión cerrada correctamente');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Error al conectar a MongoDB Atlas:');
        console.error('Mensaje:', error.message);
        console.error('\n💡 Verifica:');
        console.error('   - Que la URI en .env sea correcta');
        console.error('   - Que la contraseña no tenga caracteres especiales sin codificar');
        console.error('   - Que en MongoDB Atlas → Network Access esté configurado 0.0.0.0/0');
        console.error('   - Que el usuario tenga permisos de lectura/escritura');
        process.exit(1);
    });
