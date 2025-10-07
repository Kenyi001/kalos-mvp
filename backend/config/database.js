import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`📊 MongoDB conectado: ${conn.connection.host}`);
        
        // Eventos de conexión
        mongoose.connection.on('connected', () => {
            console.log('✅ Mongoose conectado a MongoDB');
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ Error de conexión MongoDB:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('📤 Mongoose desconectado de MongoDB');
        });

        // Manejo graceful de cierre
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('👋 Conexión MongoDB cerrada debido a terminación de aplicación');
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error.message);
        process.exit(1);
    }
};