import User from '../models/User.js';

// @desc    Obtener todos los usuarios
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Obtener un usuario
// @route   GET /api/users/:id
// @access  Private
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Usuario no encontrado',
                    status: 404
                }
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Actualizar usuario
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req, res, next) => {
    try {
        // Verificar que solo el usuario pueda actualizarse a sí mismo
        if (req.params.id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: {
                    message: 'No autorizado',
                    status: 403
                }
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Usuario no encontrado',
                    status: 404
                }
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Eliminar usuario
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Usuario no encontrado',
                    status: 404
                }
            });
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};
