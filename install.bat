@echo off
echo 🚀 Instalando Kalos MVP...
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado. Por favor instala Node.js v16 o superior.
    pause
    exit /b 1
)

echo ✅ Node.js detectado: 
node --version

REM Instalar dependencias del frontend
echo ✅ Instalando dependencias del frontend...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Error instalando dependencias del frontend
    pause
    exit /b 1
)

REM Instalar dependencias del backend
echo ✅ Instalando dependencias del backend...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Error instalando dependencias del backend
    pause
    exit /b 1
)

cd ..

REM Crear archivo .env del backend si no existe
if not exist "backend\.env" (
    echo ⚠️  Creando archivo .env de ejemplo en backend\
    (
        echo # Database
        echo MONGODB_URI=mongodb://localhost:27017/kalos
        echo.
        echo # JWT
        echo JWT_SECRET=tu_jwt_secret_muy_seguro_cambialo_en_produccion
        echo.
        echo # Server
        echo PORT=5000
        echo NODE_ENV=development
        echo.
        echo # Cloudinary ^(opcional - para subida de imágenes^)
        echo # CLOUDINARY_CLOUD_NAME=tu_cloud_name
        echo # CLOUDINARY_API_KEY=tu_api_key
        echo # CLOUDINARY_API_SECRET=tu_api_secret
        echo.
        echo # Stripe ^(opcional - para pagos^)
        echo # STRIPE_SECRET_KEY=sk_test_tu_stripe_secret_key
        echo # STRIPE_PUBLISHABLE_KEY=pk_test_tu_stripe_publishable_key
        echo.
        echo # Email ^(opcional - para notificaciones^)
        echo # EMAIL_HOST=smtp.gmail.com
        echo # EMAIL_PORT=587
        echo # EMAIL_USER=tu_email@gmail.com
        echo # EMAIL_PASS=tu_password_de_aplicacion
    ) > backend\.env
    echo ⚠️  ¡IMPORTANTE! Edita backend\.env con tus credenciales reales
)

echo.
echo ✅ ¡Instalación completada! 🎉
echo.
echo 📋 Próximos pasos:
echo    1. Edita backend\.env con tus credenciales
echo    2. Asegúrate de que MongoDB esté corriendo
echo    3. Ejecuta: npm run dev
echo    4. Abre: http://localhost:5173
echo.
echo ✅ ¡Disfruta usando Kalos MVP!
echo.
pause