#!/bin/bash

echo "🚀 Instalando Kalos MVP..."
echo ""

# Colores para los mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
show_message() {
    echo -e "${GREEN}✅ $1${NC}"
}

show_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

show_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    show_error "Node.js no está instalado. Por favor instala Node.js v16 o superior."
    exit 1
fi

# Verificar versión de Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    show_error "Node.js versión $NODE_VERSION detectada. Se requiere v16 o superior."
    exit 1
fi

show_message "Node.js $(node -v) detectado"

# Instalar dependencias del frontend
show_message "Instalando dependencias del frontend..."
npm install

if [ $? -ne 0 ]; then
    show_error "Error instalando dependencias del frontend"
    exit 1
fi

# Instalar dependencias del backend
show_message "Instalando dependencias del backend..."
cd backend
npm install

if [ $? -ne 0 ]; then
    show_error "Error instalando dependencias del backend"
    exit 1
fi

cd ..

# Crear archivo .env del backend si no existe
if [ ! -f "backend/.env" ]; then
    show_warning "Creando archivo .env desde .env.example..."
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
        show_message "Archivo .env creado en backend/"
    else
        show_warning "Creando .env manualmente..."
        cat > backend/.env << EOL
# Database
MONGODB_URI=mongodb://localhost:27017/kalos-dev

# JWT
JWT_SECRET=kalos_jwt_secret_2024_super_secure_key_change_in_production

# Server
PORT=3001
NODE_ENV=development

# Cloudinary (opcional - para subida de imágenes)
# CLOUDINARY_CLOUD_NAME=tu_cloud_name
# CLOUDINARY_API_KEY=tu_api_key
# CLOUDINARY_API_SECRET=tu_api_secret

# Stripe (opcional - para pagos)
# STRIPE_SECRET_KEY=sk_test_tu_stripe_secret_key
# STRIPE_PUBLISHABLE_KEY=pk_test_tu_stripe_publishable_key

# Email (opcional - para notificaciones)
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USER=tu_email@gmail.com
# EMAIL_PASS=tu_password_de_aplicacion
EOL
    show_warning "¡IMPORTANTE! Edita backend/.env con tus credenciales reales"
fi

# Verificar si MongoDB está corriendo
show_message "Verificando conexión a MongoDB..."
if command -v mongosh &> /dev/null; then
    if mongosh --eval "quit()" > /dev/null 2>&1; then
        show_message "MongoDB está corriendo"
    else
        show_warning "MongoDB no está corriendo. Inicia MongoDB antes de usar la aplicación."
    fi
elif command -v mongo &> /dev/null; then
    if mongo --eval "quit()" > /dev/null 2>&1; then
        show_message "MongoDB está corriendo"
    else
        show_warning "MongoDB no está corriendo. Inicia MongoDB antes de usar la aplicación."
    fi
else
    show_warning "MongoDB CLI no encontrado. Asegúrate de que MongoDB esté instalado y corriendo."
fi

echo ""
show_message "¡Instalación completada! 🎉"
echo ""
echo "📋 Próximos pasos:"
echo "   1. Edita backend/.env con tus credenciales"
echo "   2. Asegúrate de que MongoDB esté corriendo"
echo "   3. Ejecuta: npm run dev"
echo "   4. Abre: http://localhost:5173"
echo ""
show_message "¡Disfruta usando Kalos MVP!"