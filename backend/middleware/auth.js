import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware para proteger rutas (autenticación requerida)
export const protect = async (req, res, next) => {
    try {
        let token;

        // Verificar si el token existe en el header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                error: {
                    message: 'No autorizado, token requerido',
                    status: 401
                }
            });
        }

        try {
            // Verificar token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Obtener usuario del token
            const user = await User.findById(decoded.id).select('-password');
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: {
                        message: 'No autorizado, usuario no encontrado',
                        status: 401
                    }
                });
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                error: {
                    message: 'No autorizado, token inválido',
                    status: 401
                }
            });
        }
    } catch (error) {
        next(error);
    }
};

// Middleware para autorizar roles específicos
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: {
                    message: `Rol '${req.user.role}' no autorizado para acceder a este recurso`,
                    status: 403
                }
            });
        }
        next();
    };
};

// Middleware para verificar si el usuario es profesional
export const isProfessional = (req, res, next) => {
    if (req.user.role !== 'professional') {
        return res.status(403).json({
            success: false,
            error: {
                message: 'Acceso restringido solo para profesionales',
                status: 403
            }
        });
    }
    next();
};

// Middleware para verificar si el usuario es admin
export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            error: {
                message: 'Acceso restringido solo para administradores',
                status: 403
            }
        });
    }
    next();
};