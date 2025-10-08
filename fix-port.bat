@echo off
echo 🔧 Corrigiendo configuración del puerto...
echo.

REM Verificar si existe el archivo .env
if exist "backend\.env" (
    echo ✅ Archivo .env encontrado
    echo.
    echo 📋 Contenido actual del .env:
    type backend\.env
    echo.
    echo.
    echo ⚠️  Eliminando archivo .env antiguo...
    del backend\.env
) else (
    echo ⚠️  Archivo .env no existe
)

echo.
echo ✅ Creando nuevo archivo .env con configuración correcta...

REM Intentar copiar desde .env.example
if exist "backend\.env.example" (
    copy backend\.env.example backend\.env >nul
    echo ✅ Copiado desde .env.example
) else (
    echo ⚠️  .env.example no existe, creando manualmente...
    (
        echo # Variables de entorno para desarrollo
        echo NODE_ENV=development
        echo PORT=3001
        echo.
        echo # Base de datos
        echo MONGODB_URI=mongodb://localhost:27017/kalos-dev
        echo.
        echo # JWT
        echo JWT_SECRET=kalos_jwt_secret_2024_super_secure_key_change_in_production
        echo JWT_EXPIRE=7d
        echo.
        echo # Cloudinary para imágenes
        echo CLOUDINARY_CLOUD_NAME=your_cloud_name
        echo CLOUDINARY_API_KEY=your_api_key
        echo CLOUDINARY_API_SECRET=your_api_secret
        echo.
        echo # Email ^(Nodemailer^)
        echo EMAIL_HOST=smtp.gmail.com
        echo EMAIL_PORT=587
        echo EMAIL_USER=your_email@gmail.com
        echo EMAIL_PASS=your_app_password
        echo.
        echo # Stripe para pagos
        echo STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
        echo STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
        echo.
        echo # Frontend URL ^(para CORS^)
        echo FRONTEND_URL=http://localhost:5173
    ) > backend\.env
    echo ✅ Archivo .env creado manualmente
)

echo.
echo 📋 Nuevo contenido del .env:
type backend\.env

echo.
echo.
echo ✅ ¡Configuración corregida! Puerto cambiado a 3001
echo.
echo 📋 Ahora ejecuta:
echo    npm run dev
echo.
echo 💡 El backend debe mostrar:
echo    [BACKEND] 🚀 Kalos API ejecutándose en puerto 3001
echo.
pause
