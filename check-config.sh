#!/bin/bash

echo "🔍 Verificando configuración del proyecto..."
echo ""

ERROR_COUNT=0

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Verificar Node.js
echo "[1/5] Verificando Node.js..."
if command -v node &> /dev/null; then
    echo -e "${GREEN}✅ Node.js instalado${NC}"
    node --version
else
    echo -e "${RED}❌ Node.js NO instalado${NC}"
    ((ERROR_COUNT++))
fi
echo ""

# Verificar MongoDB
echo "[2/5] Verificando MongoDB..."
if command -v mongod &> /dev/null; then
    echo -e "${GREEN}✅ MongoDB instalado${NC}"
else
    echo -e "${YELLOW}⚠️  MongoDB no encontrado en PATH${NC}"
fi
echo ""

# Verificar archivo .env
echo "[3/5] Verificando archivo .env..."
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✅ Archivo backend/.env existe${NC}"
    echo ""
    echo "📋 Configuración de puerto:"
    grep "PORT" backend/.env
    echo ""
    if grep -q "PORT=3001" backend/.env; then
        echo -e "${GREEN}✅ Puerto configurado correctamente (3001)${NC}"
    else
        echo -e "${RED}❌ Puerto INCORRECTO - NO es 3001${NC}"
        echo ""
        echo "🔧 Ejecuta ./fix-port.sh para corregir"
        ((ERROR_COUNT++))
    fi
else
    echo -e "${RED}❌ Archivo backend/.env NO existe${NC}"
    echo ""
    echo "🔧 Ejecuta ./fix-port.sh para crearlo"
    ((ERROR_COUNT++))
fi
echo ""

# Verificar node_modules
echo "[4/5] Verificando dependencias..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ Dependencias del frontend instaladas${NC}"
else
    echo -e "${RED}❌ Dependencias del frontend NO instaladas${NC}"
    echo "   Ejecuta: npm install"
    ((ERROR_COUNT++))
fi

if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✅ Dependencias del backend instaladas${NC}"
else
    echo -e "${RED}❌ Dependencias del backend NO instaladas${NC}"
    echo "   Ejecuta: cd backend && npm install"
    ((ERROR_COUNT++))
fi
echo ""

# Verificar puertos disponibles
echo "[5/5] Verificando puertos..."
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${YELLOW}⚠️  Puerto 3001 está en uso${NC}"
    echo "   Puede que el backend ya esté corriendo"
else
    echo -e "${GREEN}✅ Puerto 3001 disponible${NC}"
fi

if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${YELLOW}⚠️  Puerto 5173 está en uso${NC}"
    echo "   Puede que el frontend ya esté corriendo"
else
    echo -e "${GREEN}✅ Puerto 5173 disponible${NC}"
fi
echo ""

# Resumen
echo "============================================"
if [ $ERROR_COUNT -eq 0 ]; then
    echo -e "${GREEN}✅ ¡TODO CORRECTO! Puedes ejecutar: npm run dev${NC}"
else
    echo -e "${RED}❌ Se encontraron $ERROR_COUNT errores${NC}"
    echo ""
    echo "📋 Acciones recomendadas:"
    echo "   1. Si el puerto es incorrecto: ./fix-port.sh"
    echo "   2. Si faltan dependencias: ./install.sh"
    echo "   3. Revisa TROUBLESHOOTING.md para más ayuda"
fi
echo "============================================"
echo ""
