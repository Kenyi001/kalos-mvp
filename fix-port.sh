#!/bin/bash

echo "🔧 Corrigiendo configuración del puerto..."
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Verificar si existe el archivo .env
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✅ Archivo .env encontrado${NC}"
    echo ""
    echo "📋 Contenido actual del .env:"
    cat backend/.env
    echo ""
    echo ""
    echo -e "${YELLOW}⚠️  Eliminando archivo .env antiguo...${NC}"
    rm backend/.env
else
    echo -e "${YELLOW}⚠️  Archivo .env no existe${NC}"
fi

echo ""
echo -e "${GREEN}✅ Creando nuevo archivo .env con configuración correcta...${NC}"

# Intentar copiar desde .env.example
if [ -f "backend/.env.example" ]; then
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✅ Copiado desde .env.example${NC}"
else
    echo -e "${YELLOW}⚠️  .env.example no existe, creando manualmente...${NC}"
    cat > backend/.env << 'EOL'
# Variables de entorno para desarrollo
NODE_ENV=development
PORT=3001

# Base de datos
MONGODB_URI=mongodb://localhost:27017/kalos-dev

# JWT
JWT_SECRET=kalos_jwt_secret_2024_super_secure_key_change_in_production
JWT_EXPIRE=7d

# Cloudinary para imágenes
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Stripe para pagos
STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:5173
EOL
    echo -e "${GREEN}✅ Archivo .env creado manualmente${NC}"
fi

echo ""
echo "📋 Nuevo contenido del .env:"
cat backend/.env

echo ""
echo ""
echo -e "${GREEN}✅ ¡Configuración corregida! Puerto cambiado a 3001${NC}"
echo ""
echo "📋 Ahora ejecuta:"
echo "   npm run dev"
echo ""
echo "💡 El backend debe mostrar:"
echo "   [BACKEND] 🚀 Kalos API ejecutándose en puerto 3001"
echo ""
