# 🔧 Solución de Problemas Comunes

## ❌ Error: `ERR_CONNECTION_REFUSED` en puerto 3001

### Síntoma
Al intentar registrarse o iniciar sesión, aparece un error:
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
http://localhost:3001/api/auth/register
```

### Causa
El backend no está configurado correctamente o está usando el puerto incorrecto (5000 en lugar de 3001).

### Solución

#### 1. Verificar que existe el archivo `.env` en la carpeta `backend/`

```bash
# En Windows
dir backend\.env

# En Linux/Mac
ls backend/.env
```

Si **NO existe** el archivo `.env`:

**Opción A - Copiar desde .env.example (Recomendado):**
```bash
# En Windows
copy backend\.env.example backend\.env

# En Linux/Mac
cp backend/.env.example backend/.env
```

**Opción B - Crear manualmente:**
Crea el archivo `backend/.env` con este contenido:

```properties
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
```

#### 2. Verificar que el puerto sea 3001

Abre el archivo `backend/.env` y asegúrate de que la línea del puerto diga:
```
PORT=3001
```

**NO debe decir:**
```
PORT=5000  ❌ Incorrecto
```

#### 3. Reiniciar el servidor

Detén el servidor (Ctrl+C) y vuelve a iniciarlo:
```bash
npm run dev
```

Deberías ver:
```
[BACKEND] 🚀 Kalos API ejecutándose en puerto 3001
```

---

## ❌ Error: MongoDB no conecta

### Síntoma
```
[BACKEND] ❌ Error conectando MongoDB
```

### Solución

1. **Verifica que MongoDB esté instalado:**
   ```bash
   mongod --version
   ```

2. **Inicia MongoDB:**
   
   **Windows:**
   ```powershell
   # Como servicio (recomendado)
   net start MongoDB
   
   # O manualmente
   "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
   ```
   
   **Linux:**
   ```bash
   sudo systemctl start mongod
   ```
   
   **Mac:**
   ```bash
   brew services start mongodb-community
   ```

3. **Verifica la conexión:**
   ```bash
   # MongoDB 5.0+
   mongosh
   
   # MongoDB 4.x o anterior
   mongo
   ```

---

## ❌ Error: Puerto 5173 ya en uso

### Síntoma
```
[FRONTEND] Error: Port 5173 is already in use
```

### Solución

**Opción 1 - Matar el proceso que usa el puerto:**

**Windows:**
```powershell
netstat -ano | findstr :5173
taskkill /PID [número_de_proceso] /F
```

**Linux/Mac:**
```bash
lsof -ti:5173 | xargs kill -9
```

**Opción 2 - Usar otro puerto:**

Edita `vite.config.js` y cambia el puerto:
```javascript
export default defineConfig({
  server: {
    port: 5174  // Cambia a otro puerto
  }
})
```

---

## ❌ Error: Módulos no encontrados

### Síntoma
```
Error: Cannot find module 'express'
```

### Solución

Reinstala las dependencias:
```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

O usa el script de instalación:
```bash
# Windows
install.bat

# Linux/Mac
./install.sh
```

---

## 🆘 Instalación limpia desde cero

Si tienes múltiples problemas, intenta una instalación limpia:

```bash
# 1. Eliminar dependencias existentes
rm -rf node_modules
rm -rf backend/node_modules
rm package-lock.json
rm backend/package-lock.json

# 2. Crear archivo .env
cp backend/.env.example backend/.env

# 3. Reinstalar todo
npm install
cd backend
npm install
cd ..

# 4. Verificar MongoDB
# (ver sección anterior)

# 5. Iniciar
npm run dev
```

---

## 📞 ¿Necesitas más ayuda?

Si el problema persiste:

1. Revisa los logs completos del terminal
2. Verifica que tengas las versiones correctas:
   - Node.js: v16 o superior
   - MongoDB: v5.0 o superior
3. Abre un issue en GitHub: https://github.com/Kenyi001/kalos-mvp/issues

---

## ✅ Verificación rápida

Para verificar que todo está configurado correctamente:

```bash
npm run verify
```

Este comando verificará:
- ✅ Node.js y npm instalados
- ✅ MongoDB corriendo
- ✅ Archivo .env existe
- ✅ Dependencias instaladas
- ✅ Puertos disponibles (3001, 5173)
