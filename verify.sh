#!/bin/bash

echo "🔍 Verificando instalación de Kalos MVP..."
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

success=0
warnings=0
errors=0

check_success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((success++))
}

check_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((warnings++))
}

check_error() {
    echo -e "${RED}❌ $1${NC}"
    ((errors++))
}

echo -e "${BLUE}📋 Verificando prerequisitos...${NC}"

# Verificar Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_MAJOR" -ge 16 ]; then
        check_success "Node.js $NODE_VERSION (compatible)"
    else
        check_error "Node.js $NODE_VERSION (requiere v16+)"
    fi
else
    check_error "Node.js no está instalado"
fi

# Verificar npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    check_success "npm $NPM_VERSION instalado"
else
    check_error "npm no está disponible"
fi

# Verificar MongoDB
echo -e "${BLUE}📋 Verificando MongoDB...${NC}"
if command -v mongosh &> /dev/null; then
    if mongosh --eval "quit()" > /dev/null 2>&1; then
        check_success "MongoDB está corriendo (mongosh)"
    else
        check_warning "MongoDB CLI disponible pero no está corriendo"
    fi
elif command -v mongo &> /dev/null; then
    if mongo --eval "quit()" > /dev/null 2>&1; then
        check_success "MongoDB está corriendo (mongo)"
    else
        check_warning "MongoDB CLI disponible pero no está corriendo"
    fi
else
    check_warning "MongoDB CLI no encontrado"
fi

echo -e "${BLUE}📋 Verificando archivos del proyecto...${NC}"

# Verificar archivos principales
files=(
    "package.json"
    "backend/package.json"
    "backend/server.js"
    "src/main.js"
    "index.html"
    "vite.config.js"
    ".gitignore"
    "README.md"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        check_success "Archivo $file existe"
    else
        check_error "Falta archivo $file"
    fi
done

# Verificar .env
if [ -f "backend/.env" ]; then
    check_success "Archivo backend/.env configurado"
else
    if [ -f "backend/.env.example" ]; then
        check_warning "Archivo backend/.env no existe (usa .env.example como base)"
    else
        check_error "Faltan archivos de configuración .env"
    fi
fi

# Verificar node_modules
echo -e "${BLUE}📋 Verificando dependencias...${NC}"

if [ -d "node_modules" ]; then
    check_success "Dependencias frontend instaladas"
else
    check_warning "Dependencias frontend no instaladas (ejecuta: npm install)"
fi

if [ -d "backend/node_modules" ]; then
    check_success "Dependencias backend instaladas"
else
    check_warning "Dependencias backend no instaladas (ejecuta: cd backend && npm install)"
fi

# Verificar puertos
echo -e "${BLUE}📋 Verificando puertos...${NC}"

if command -v netstat &> /dev/null; then
    if netstat -tuln | grep -q ":5173 "; then
        check_warning "Puerto 5173 (frontend) está en uso"
    else
        check_success "Puerto 5173 (frontend) disponible"
    fi
    
    if netstat -tuln | grep -q ":5000 "; then
        check_warning "Puerto 5000 (backend) está en uso"
    else
        check_success "Puerto 5000 (backend) disponible"
    fi
else
    check_warning "No se pudo verificar puertos (netstat no disponible)"
fi

# Resumen
echo ""
echo -e "${BLUE}📊 RESUMEN DE VERIFICACIÓN${NC}"
echo "=================================="
echo -e "${GREEN}✅ Exitosos: $success${NC}"
echo -e "${YELLOW}⚠️  Advertencias: $warnings${NC}"
echo -e "${RED}❌ Errores: $errors${NC}"
echo ""

if [ $errors -eq 0 ]; then
    if [ $warnings -eq 0 ]; then
        echo -e "${GREEN}🎉 ¡Todo perfecto! El proyecto está listo para usar.${NC}"
        echo ""
        echo "🚀 Para iniciar:"
        echo "   npm run dev"
        echo ""
        echo "🌐 URLs:"
        echo "   Frontend: http://localhost:5173"
        echo "   Backend:  http://localhost:5000"
    else
        echo -e "${YELLOW}⚠️  Proyecto funcional con algunas advertencias.${NC}"
        echo "   Revisa las advertencias arriba y configura lo necesario."
    fi
else
    echo -e "${RED}❌ Hay errores que necesitan ser corregidos.${NC}"
    echo "   Revisa los errores arriba antes de continuar."
fi

echo ""
echo "📚 Documentación disponible:"
echo "   README.md - Guía completa"
echo "   QUICK_START.md - Inicio rápido"
echo "   GITHUB_SETUP.md - Configuración GitHub"