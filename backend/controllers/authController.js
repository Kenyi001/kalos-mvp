import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

// Generar JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// @desc    Registrar usuario
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
    try {
        // Validar entrada
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Datos de entrada inválidos',
                    status: 400,
                    details: errors.array()
                }
            });
        }

        const { name, firstName, lastName, email, password, role } = req.body;

        // Verificar si el usuario ya existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({
                success: false,
                error: {
                    message: 'Este email ya está registrado',
                    status: 409
                }
            });
        }

        // Si se envía 'name', dividirlo en firstName y lastName
        let userFirstName = firstName;
        let userLastName = lastName;
        
        if (name && !firstName && !lastName) {
            const nameParts = name.trim().split(' ');
            userFirstName = nameParts[0];
            userLastName = nameParts.slice(1).join(' ') || nameParts[0];
        }

        // Crear usuario
        const user = await User.create({
            firstName: userFirstName,
            lastName: userLastName,
            email,
            password,
            role
        });

        // Si es profesional, buscar su perfil profesional (por si se crea automáticamente)
        let professionalId = null;
        if (role === 'professional') {
            const Professional = await import('../models/Professional.js');
            const professionalProfile = await Professional.default.findOne({ user: user._id });
            if (professionalProfile) {
                professionalId = professionalProfile._id;
            }
        }

        // Generar token
        const token = generateToken(user._id);

        const userData = {
            id: user._id,
            name: user.fullName,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        };

        // Agregar professionalId si existe
        if (professionalId) {
            userData.professionalId = professionalId;
        }

        res.status(201).json({
            success: true,
            data: {
                user: userData,
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login de usuario
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
    try {
        // Validar entrada
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Datos de entrada inválidos',
                    status: 400,
                    details: errors.array()
                }
            });
        }

        const { email, password } = req.body;

        console.log('🔐 Intento de login:');
        console.log('   Email recibido:', email);
        console.log('   Password length:', password?.length);

        // Buscar usuario y incluir password
        const user = await User.findOne({ email }).select('+password');
        console.log('   Usuario encontrado:', !!user);
        
        if (!user) {
            console.log('   ❌ Usuario no existe en BD');
            return res.status(401).json({
                success: false,
                error: {
                    message: 'Credenciales inválidas',
                    status: 401
                }
            });
        }

        console.log('   Usuario ID:', user._id);
        console.log('   Rol del usuario:', user.role);

        // Verificar contraseña
        const isMatch = await user.matchPassword(password);
        console.log('   ¿Password coincide?:', isMatch);
        
        if (!isMatch) {
            console.log('   ❌ Password incorrecto');
            return res.status(401).json({
                success: false,
                error: {
                    message: 'Credenciales inválidas',
                    status: 401
                }
            });
        }
        
        console.log('   ✅ Login exitoso');

        // Si es profesional, buscar su perfil profesional
        let professionalId = null;
        if (user.role === 'professional') {
            const Professional = await import('../models/Professional.js');
            const professionalProfile = await Professional.default.findOne({ user: user._id });
            if (professionalProfile) {
                professionalId = professionalProfile._id;
            }
        }

        // Generar token
        const token = generateToken(user._id);

        const userData = {
            id: user._id,
            name: user.fullName,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        };

        // Agregar professionalId si existe
        if (professionalId) {
            userData.professionalId = professionalId;
        }

        res.status(200).json({
            success: true,
            data: {
                user: userData,
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Obtener perfil del usuario autenticado
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Actualizar perfil
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
    try {
        const fieldsToUpdate = {};
        
        if (req.body.firstName) fieldsToUpdate.firstName = req.body.firstName;
        if (req.body.lastName) fieldsToUpdate.lastName = req.body.lastName;
        if (req.body.email) fieldsToUpdate.email = req.body.email;
        if (req.body.phone) fieldsToUpdate.phone = req.body.phone;
        
        // Si se envía 'name', dividirlo en firstName y lastName
        if (req.body.name && !req.body.firstName && !req.body.lastName) {
            const nameParts = req.body.name.trim().split(' ');
            fieldsToUpdate.firstName = nameParts[0];
            fieldsToUpdate.lastName = nameParts.slice(1).join(' ') || nameParts[0];
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            fieldsToUpdate,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};
