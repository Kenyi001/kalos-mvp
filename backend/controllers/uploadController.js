// Placeholder para uploadController
// Implementar con Multer y Cloudinary según necesidades

export const uploadImage = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            data: {
                url: 'https://via.placeholder.com/400',
                message: 'Función de upload en desarrollo'
            }
        });
    } catch (error) {
        next(error);
    }
};
