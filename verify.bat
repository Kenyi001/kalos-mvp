@echo off
echo 🔍 Verificando instalación de Kalos MVP...
echo.

set success=0
set warnings=0
set errors=0

echo 📋 Verificando prerequisitos...

REM Verificar Node.js
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js está instalado
    node --version
    set /a success+=1
) else (
    echo ❌ Node.js no está instalado
    set /a errors+=1
)

REM Verificar npm
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ npm está disponible
    set /a success+=1
) else (
    echo ❌ npm no está disponible
    set /a errors+=1
)

echo.
echo 📋 Verificando archivos del proyecto...

REM Verificar archivos principales
if exist "package.json" (
    echo ✅ Archivo package.json existe
    set /a success+=1
) else (
    echo ❌ Falta archivo package.json
    set /a errors+=1
)

if exist "backend\package.json" (
    echo ✅ Archivo backend\package.json existe
    set /a success+=1
) else (
    echo ❌ Falta archivo backend\package.json
    set /a errors+=1
)

if exist "backend\server.js" (
    echo ✅ Archivo backend\server.js existe
    set /a success+=1
) else (
    echo ❌ Falta archivo backend\server.js
    set /a errors+=1
)

if exist "src\main.js" (
    echo ✅ Archivo src\main.js existe
    set /a success+=1
) else (
    echo ❌ Falta archivo src\main.js
    set /a errors+=1
)

if exist "index.html" (
    echo ✅ Archivo index.html existe
    set /a success+=1
) else (
    echo ❌ Falta archivo index.html
    set /a errors+=1
)

if exist "README.md" (
    echo ✅ Archivo README.md existe
    set /a success+=1
) else (
    echo ❌ Falta archivo README.md
    set /a errors+=1
)

REM Verificar .env
if exist "backend\.env" (
    echo ✅ Archivo backend\.env configurado
    set /a success+=1
) else (
    if exist "backend\.env.example" (
        echo ⚠️  Archivo backend\.env no existe ^(usa .env.example como base^)
        set /a warnings+=1
    ) else (
        echo ❌ Faltan archivos de configuración .env
        set /a errors+=1
    )
)

echo.
echo 📋 Verificando dependencias...

if exist "node_modules" (
    echo ✅ Dependencias frontend instaladas
    set /a success+=1
) else (
    echo ⚠️  Dependencias frontend no instaladas ^(ejecuta: npm install^)
    set /a warnings+=1
)

if exist "backend\node_modules" (
    echo ✅ Dependencias backend instaladas
    set /a success+=1
) else (
    echo ⚠️  Dependencias backend no instaladas ^(ejecuta: cd backend ^&^& npm install^)
    set /a warnings+=1
)

echo.
echo 📋 Verificando puertos...

netstat -an | findstr ":5173" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Puerto 5173 ^(frontend^) está en uso
    set /a warnings+=1
) else (
    echo ✅ Puerto 5173 ^(frontend^) disponible
    set /a success+=1
)

netstat -an | findstr ":5000" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Puerto 5000 ^(backend^) está en uso
    set /a warnings+=1
) else (
    echo ✅ Puerto 5000 ^(backend^) disponible
    set /a success+=1
)

echo.
echo 📊 RESUMEN DE VERIFICACIÓN
echo ==================================
echo ✅ Exitosos: %success%
echo ⚠️  Advertencias: %warnings%
echo ❌ Errores: %errors%
echo.

if %errors% equ 0 (
    if %warnings% equ 0 (
        echo 🎉 ¡Todo perfecto! El proyecto está listo para usar.
        echo.
        echo 🚀 Para iniciar:
        echo    npm run dev
        echo.
        echo 🌐 URLs:
        echo    Frontend: http://localhost:5173
        echo    Backend:  http://localhost:5000
    ) else (
        echo ⚠️  Proyecto funcional con algunas advertencias.
        echo    Revisa las advertencias arriba y configura lo necesario.
    )
) else (
    echo ❌ Hay errores que necesitan ser corregidos.
    echo    Revisa los errores arriba antes de continuar.
)

echo.
echo 📚 Documentación disponible:
echo    README.md - Guía completa
echo    QUICK_START.md - Inicio rápido
echo    GITHUB_SETUP.md - Configuración GitHub
echo.
pause