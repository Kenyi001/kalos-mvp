# 🔧 Solución de problemas - Vercel Deployment

## ❌ Error: "Unexpected token 'T', 'The page c'... is not valid JSON"

Este error significa que Vercel está devolviendo HTML (página 404) en lugar de JSON desde la API.

---

## ✅ Solución paso a paso

### **1. Verificar que el proyecto esté configurado correctamente en Vercel**

En tu proyecto de Vercel:

1. Ve a **Settings** → **General**
2. Verifica:
   - **Framework Preset:** `Other` o `Vite`
   - **Root Directory:** `./` (dejar vacío)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### **2. Verificar Variables de Entorno**

Ve a **Settings** → **Environment Variables** y asegúrate de tener:

```
MONGODB_URI = mongodb+srv://kalosadmin:h1DoRvbXKLhvvxuz@cluster0.j1i2bux.mongodb.net/kalos?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET = kalos_jwt_secret_super_seguro_2024_123456789
JWT_EXPIRE = 30d
NODE_ENV = production
VITE_API_URL = /api
```

**⚠️ IMPORTANTE:** Después de agregar/modificar variables, debes hacer **Redeploy**.

### **3. Forzar Redeploy**

1. Ve a **Deployments**
2. Click en el deployment más reciente
3. Click en el menú **"⋯"** (tres puntos)
4. Selecciona **"Redeploy"**
5. ✅ Marca **"Use existing Build Cache"** como `false`
6. Click en **"Redeploy"**

### **4. Verificar estructura de carpetas**

Tu proyecto debe tener esta estructura:

```
KalosMVP/
├── api/
│   └── index.js          ← Serverless function
├── backend/
│   ├── routes/           ← Rutas Express
│   ├── models/           ← Modelos Mongoose
│   ├── controllers/      ← Controladores
│   └── middleware/       ← Middlewares
├── dist/                 ← Build del frontend (generado)
├── src/                  ← Código fuente frontend
├── vercel.json           ← Configuración de Vercel
└── package.json
```

### **5. Verificar logs de Vercel**

1. Ve a tu proyecto en Vercel
2. Click en el deployment más reciente
3. Click en **"View Function Logs"**
4. Busca errores en **rojo**

Errores comunes:
- `Cannot find module` → Falta instalar dependencias
- `MongooseError` → URI de MongoDB incorrecta
- `CORS error` → Variables de entorno faltantes

---

## 🧪 Probar la API después del deploy

### Test 1: Health Check
```bash
curl https://tu-proyecto.vercel.app/api
```

**Esperado:**
```json
{
  "success": true,
  "status": "ok",
  "message": "Kalos API is running",
  "timestamp": "2025-10-16T..."
}
```

### Test 2: Health Check alternativo
```bash
curl https://tu-proyecto.vercel.app/api/health
```

**Esperado:**
```json
{
  "success": true,
  "status": "healthy",
  "uptime": 123.45,
  "timestamp": "2025-10-16T..."
}
```

### Test 3: Login
```bash
curl -X POST https://tu-proyecto.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

**Si funciona:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Si falla con 404:**
- El rewrite de `/api/*` no está funcionando
- Verifica `vercel.json`

---

## 🔍 Diagnóstico rápido

### Problema: API devuelve HTML en lugar de JSON

**Causa 1:** `vercel.json` no está configurado correctamente

✅ **Solución:**
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "functions": {
    "api/index.js": {
      "memory": 1024,
      "maxDuration": 10
    }
  },
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/index"
    }
  ]
}
```

**Causa 2:** El archivo `api/index.js` no exporta correctamente

✅ **Solución:** Verifica que la última línea sea:
```javascript
export default app;
```

**Causa 3:** Vercel no detecta el archivo `api/index.js`

✅ **Solución:**
1. Asegúrate de que el archivo esté en la raíz: `/api/index.js`
2. No debe estar en `/backend/api/index.js`
3. Haz commit y push del archivo

---

## 🔄 Si nada funciona - Reset completo

### 1. Eliminar el proyecto de Vercel
1. Settings → General → Delete Project
2. Confirma la eliminación

### 2. Limpiar configuración local
```bash
# Eliminar configuración de Vercel local
rm -rf .vercel

# Verificar que todos los archivos estén en Git
git status
git add .
git commit -m "Fix: Vercel configuration"
git push origin main
```

### 3. Crear nuevo proyecto en Vercel
1. Ve a https://vercel.com/new
2. Import Git Repository
3. Selecciona `kalos-mvp`
4. **⚠️ IMPORTANTE:** Antes de Deploy:
   - Agrega TODAS las variables de entorno
   - Framework Preset: `Other`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click en **Deploy**

---

## 📞 Contacto

Si el problema persiste:
1. Copia los logs de Vercel
2. Captura de pantalla del error
3. URL del proyecto en Vercel
4. Abre un issue en: https://github.com/Kenyi001/kalos-mvp/issues

---

## ✅ Checklist final

- [ ] `vercel.json` está en la raíz del proyecto
- [ ] `api/index.js` está en la raíz del proyecto (no en backend)
- [ ] `package.json` tiene el script `"vercel-build": "npm run build"`
- [ ] Todas las 5 variables de entorno están en Vercel
- [ ] Se hizo Redeploy después de cambiar variables
- [ ] Los logs de Vercel no muestran errores
- [ ] El health check `/api` responde JSON

Si todos están marcados y aún falla, contacta soporte de Vercel: https://vercel.com/support
