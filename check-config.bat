@echo off
echo 🔍 Verificando configuración del proyecto...
echo.

set ERROR_COUNT=0

REM Verificar Node.js
echo [1/5] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js instalado
    node --version
) else (
    echo ❌ Node.js NO instalado
    set /a ERROR_COUNT+=1
)
echo.

REM Verificar MongoDB
echo [2/5] Verificando MongoDB...
where mongod >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ MongoDB instalado
) else (
    echo ⚠️  MongoDB no encontrado en PATH
)
echo.

REM Verificar archivo .env
echo [3/5] Verificando archivo .env...
if exist "backend\.env" (
    echo ✅ Archivo backend\.env existe
    echo.
    echo 📋 Configuración de puerto:
    findstr /C:"PORT" backend\.env
    echo.
    findstr /C:"PORT=3001" backend\.env >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Puerto configurado correctamente (3001)
    ) else (
        echo ❌ Puerto INCORRECTO - NO es 3001
        echo.
        echo 🔧 Ejecuta fix-port.bat para corregir
        set /a ERROR_COUNT+=1
    )
) else (
    echo ❌ Archivo backend\.env NO existe
    echo.
    echo 🔧 Ejecuta fix-port.bat para crearlo
    set /a ERROR_COUNT+=1
)
echo.

REM Verificar node_modules
echo [4/5] Verificando dependencias...
if exist "node_modules\" (
    echo ✅ Dependencias del frontend instaladas
) else (
    echo ❌ Dependencias del frontend NO instaladas
    echo    Ejecuta: npm install
    set /a ERROR_COUNT+=1
)

if exist "backend\node_modules\" (
    echo ✅ Dependencias del backend instaladas
) else (
    echo ❌ Dependencias del backend NO instaladas
    echo    Ejecuta: cd backend ^&^& npm install
    set /a ERROR_COUNT+=1
)
echo.

REM Verificar puertos disponibles
echo [5/5] Verificando puertos...
netstat -ano | findstr ":3001" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Puerto 3001 está en uso
    echo    Puede que el backend ya esté corriendo
) else (
    echo ✅ Puerto 3001 disponible
)

netstat -ano | findstr ":5173" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Puerto 5173 está en uso
    echo    Puede que el frontend ya esté corriendo
) else (
    echo ✅ Puerto 5173 disponible
)
echo.

REM Resumen
echo ============================================
if %ERROR_COUNT% equ 0 (
    echo ✅ ¡TODO CORRECTO! Puedes ejecutar: npm run dev
) else (
    echo ❌ Se encontraron %ERROR_COUNT% errores
    echo.
    echo 📋 Acciones recomendadas:
    echo    1. Si el puerto es incorrecto: fix-port.bat
    echo    2. Si faltan dependencias: install.bat
    echo    3. Revisa TROUBLESHOOTING.md para más ayuda
)
echo ============================================
echo.
pause
