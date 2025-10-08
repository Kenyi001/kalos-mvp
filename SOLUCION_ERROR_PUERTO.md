# ✅ SOLUCIÓN AL ERROR ERR_CONNECTION_REFUSED

## 🔴 Problema Original

Cuando intentas registrarte en otra PC, aparece:
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
http://localhost:3001/api/auth/register
```

**Backend dice:**
```
[BACKEND] 🚀 Kalos API ejecutándose en puerto 5000  ❌ INCORRECTO
```

**Frontend espera:**
```
http://localhost:3001  ✅ CORRECTO
```

---

## ✅ SOLUCIÓN APLICADA

### 1. Scripts de instalación corregidos ✅

**Antes:**
- `install.bat` y `install.sh` creaban `.env` con `PORT=5000` ❌

**Ahora:**
- Copian automáticamente `backend/.env.example` (que tiene `PORT=3001`) ✅
- Si no existe el example, crean `.env` con `PORT=3001` ✅

### 2. Documentación actualizada ✅

**Archivos nuevos:**
- `TROUBLESHOOTING.md` - Guía completa de solución de problemas 📋
- `QUICKSTART.md` - Inicio rápido en 3 pasos ⚡

**Archivos actualizados:**
- `README.md` - Corregido puerto de 5000 a 3001
- `install.bat` - Copia `.env.example` automáticamente
- `install.sh` - Copia `.env.example` automáticamente

---

## 🚀 PARA LA OTRA PC - PASOS A SEGUIR

### ⚡ Opción 1: Script automático (MÁS FÁCIL) ✅

```bash
# 1. Ir al directorio del proyecto
cd C:\Proyectos\kalos-mvp

# 2. Hacer pull de los cambios
git pull origin main

# 3. Ejecutar el script de corrección
# Windows:
fix-port.bat

# Linux/Mac:
chmod +x fix-port.sh
./fix-port.sh

# 4. Iniciar
npm run dev
```

### Opción 2: Re-clonar

```bash
# 1. Eliminar el repositorio anterior (si existe)
cd C:\Proyectos
rmdir /s /q kalos-mvp

# 2. Clonar nuevamente
git clone https://github.com/Kenyi001/kalos-mvp.git
cd kalos-mvp

# 3. Ejecutar instalador (creará .env con PORT=3001 automáticamente)
# Windows:
install.bat

# Linux/Mac:
chmod +x install.sh
./install.sh

# 4. Iniciar
npm run dev
```

### Opción 3: Manual

```bash
# 1. Ir al directorio del proyecto
cd C:\Proyectos\kalos-mvp

# 2. Hacer pull de los cambios
git pull origin main

# 3. Eliminar el .env actual (que tiene puerto incorrecto)
# Windows:
del backend\.env

# Linux/Mac:
rm backend/.env

# 4. Copiar desde .env.example
# Windows:
copy backend\.env.example backend\.env

# Linux/Mac:
cp backend/.env.example backend/.env

# 5. Reiniciar
npm run dev
```

---

## ✅ VERIFICACIÓN

Después de iniciar, deberías ver:

```
[BACKEND] 🚀 Kalos API ejecutándose en puerto 3001  ✅ CORRECTO
[BACKEND] 🌍 Entorno: development
[BACKEND] 📱 Frontend URL: http://localhost:5173
[BACKEND] 🏥 Health check: http://localhost:3001/health
[BACKEND] 📊 MongoDB conectado: localhost
```

---

## 📝 CAMBIOS REALIZADOS Y SUBIDOS A GITHUB

### Commit 1: Cambio de moneda
```
💱 Cambiar moneda de Euros (€) a Bolivianos (Bs) en toda la aplicación
- 12 archivos modificados
- Cambios en frontend y backend
```

### Commit 2: Fix del puerto
```
🔧 Fix: Corregir configuración de puerto a 3001 y agregar documentación
- Archivos creados: TROUBLESHOOTING.md, QUICKSTART.md
- Archivos modificados: README.md, install.bat, install.sh
- Scripts de instalación ahora copian .env.example automáticamente
```

---

## 🎯 RESULTADO FINAL

✅ Scripts de instalación corregidos
✅ Documentación completa agregada
✅ Puerto correcto (3001) en todos los archivos
✅ `.env.example` tiene configuración correcta
✅ Cambios subidos a GitHub
✅ README actualizado con guías

---

## 📞 SI PERSISTE EL ERROR

Revisa [TROUBLESHOOTING.md](TROUBLESHOOTING.md) o ejecuta estos comandos:

```bash
# Verificar archivo .env
# Windows:
type backend\.env | findstr PORT

# Linux/Mac:
cat backend/.env | grep PORT

# Debe mostrar:
# PORT=3001
```

Si muestra `PORT=5000`, edita el archivo manualmente o vuelve a copiarlo desde `.env.example`.
