// Middleware global para manejo de errores
export const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log del error para debugging
    console.error('❌ Error:', err);

    // Error de validación de Mongoose
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = {
            message,
            status: 400
        };
    }

    // Error de duplicado de Mongoose
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        error = {
            message: `El ${field} ya está en uso`,
            status: 409
        };
    }

    // Error de casting de Mongoose (ID inválido)
    if (err.name === 'CastError') {
        error = {
            message: 'ID de recurso inválido',
            status: 404
        };
    }

    // Error de JWT
    if (err.name === 'JsonWebTokenError') {
        error = {
            message: 'Token inválido',
            status: 401
        };
    }

    // Error de JWT expirado
    if (err.name === 'TokenExpiredError') {
        error = {
            message: 'Token expirado',
            status: 401
        };
    }

    res.status(error.status || 500).json({
        success: false,
        error: {
            message: error.message || 'Error interno del servidor',
            status: error.status || 500,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};