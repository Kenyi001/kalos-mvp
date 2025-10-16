# 🚀 Desplegar Kalos MVP en Vercel

## 📋 Pre-requisitos

1. ✅ Cuenta en [Vercel](https://vercel.com)
2. ✅ Cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
3. ✅ Repositorio en GitHub conectado
4. ✅ Node.js instalado localmente

---

## 🔧 Pasos para desplegar

### **Paso 1: Configurar MongoDB Atlas**

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un cluster GRATUITO (M0 Sandbox)
3. En **Network Access**:
   - Click en "Add IP Address"
   - Selecciona "Allow Access from Anywhere" (0.0.0.0/0)
4. En **Database Access**:
   - Crea un usuario con contraseña
   - Rol: "Atlas admin" o "Read and write to any database"
5. Obtén tu **Connection String**:
   - Click en "Connect" → "Connect your application"
   - Copia la URI (se ve así: `mongodb+srv://usuario:<password>@cluster.mongodb.net/`)
   - Reemplaza `<password>` con tu contraseña
   - Agrega el nombre de la base de datos al final: `mongodb+srv://usuario:password@cluster.mongodb.net/kalos`

---

### **Paso 2: Configurar Vercel**

#### 2.1 Importar el proyecto

1. Ve a [vercel.com](https://vercel.com) y haz login
2. Click en **"Add New..."** → **"Project"**
3. Importa tu repositorio `kalos-mvp` desde GitHub
4. Selecciona la rama **`vercel-deployment`**
5. **NO hagas click en Deploy todavía**

#### 2.2 Configurar Variables de Entorno

En la sección **"Environment Variables"**, agrega las siguientes variables:

| Variable | Valor | Ejemplo |
|----------|-------|---------|
| `MONGODB_URI` | Tu URI de MongoDB Atlas | `mongodb+srv://user:pass@cluster.mongodb.net/kalos` |
| `JWT_SECRET` | Un string aleatorio de 32+ caracteres | `mi_super_secreto_jwt_key_12345678` |
| `JWT_EXPIRE` | Tiempo de expiración del token | `30d` |
| `NODE_ENV` | Ambiente de producción | `production` |
| `VITE_API_URL` | URL de tu API | `/api` (Vercel lo manejará automáticamente) |

**💡 Tip:** Para generar un JWT_SECRET seguro, ejecuta en tu terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 2.3 Configuración del proyecto

- **Framework Preset:** `Vite`
- **Root Directory:** `./` (dejar vacío)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

---

### **Paso 3: Desplegar** 🚀

1. Haz click en **"Deploy"**
2. Espera 2-5 minutos mientras Vercel construye tu proyecto
3. Una vez completado, obtendrás una URL como: `https://kalos-mvp.vercel.app`

---

## ✅ Verificar el despliegue

### Frontend
```
https://tu-proyecto.vercel.app
```

### API Health Check
```
https://tu-proyecto.vercel.app/api/health
```

Deberías ver algo como:
```json
{
  "status": "healthy",
  "uptime": 123.45,
  "timestamp": "2025-10-16T..."
}
```

### Probar Login
```
POST https://tu-proyecto.vercel.app/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

---

## 🐛 Solución de problemas comunes

### ❌ Error: "Cannot find module"
**Causa:** Falta una dependencia  
**Solución:**
```bash
npm install
git add package.json package-lock.json
git commit -m "Add missing dependencies"
git push origin vercel-deployment
```

### ❌ Error: "MongoDB connection failed"
**Causas posibles:**
1. URI incorrecta en las variables de entorno
2. IP no permitida en MongoDB Atlas
3. Contraseña incorrecta

**Solución:**
- Verifica la URI en Vercel → Settings → Environment Variables
- En MongoDB Atlas → Network Access → Agrega `0.0.0.0/0`
- Verifica que la contraseña no contenga caracteres especiales sin codificar

### ❌ Error 404 en `/api/*`
**Causa:** `vercel.json` mal configurado  
**Solución:** Verifica que `vercel.json` existe en la raíz del proyecto

### ❌ Error: "Build failed"
**Solución:**
1. Revisa los logs en Vercel Dashboard
2. Ejecuta localmente: `npm run build`
3. Si funciona local pero no en Vercel, verifica las variables de entorno

### ❌ CORS Error
**Causa:** Frontend y API en dominios diferentes  
**Solución:** Ya está configurado en `api/index.js`, pero si persiste:
```javascript
// En api/index.js
app.use(cors({
  origin: '*', // Permitir todos los orígenes temporalmente para debug
  credentials: true
}));
```

---

## 🔄 Actualizaciones futuras

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Descripción de cambios"
git push origin vercel-deployment
```

Vercel automáticamente detectará los cambios y redesplegará.

---

## 📊 Monitoreo

### Ver logs en tiempo real:
1. Ve a Vercel Dashboard
2. Selecciona tu proyecto
3. Click en "Deployments" → Selecciona el último
4. Click en "View Function Logs"

### Analytics:
- Vercel → Tu Proyecto → Analytics
- Aquí verás tráfico, errores, velocidad de carga, etc.

---

## 🎯 Próximos pasos recomendados

### 1. Dominio personalizado
- Vercel → Settings → Domains
- Agrega `www.kalos.com` (tu dominio)

### 2. Monitoreo de errores
- Integra Sentry: https://vercel.com/integrations/sentry

### 3. Base de datos de producción
- Crea un cluster separado en MongoDB Atlas solo para producción

### 4. Variables de entorno por ambiente
```bash
# Development
VITE_API_URL=http://localhost:3001/api

# Production
VITE_API_URL=/api
```

---

## 📚 Recursos útiles

- [Documentación de Vercel](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/docs/cli)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Troubleshooting Vercel](https://vercel.com/docs/concepts/deployments/troubleshoot-a-build)

---

## 💡 Tips finales

1. **Usa variables de entorno:** Nunca hardcodees claves o URIs
2. **Revisa los logs:** Los errores siempre dejan rastro en los logs
3. **Prueba local primero:** `npm run build && npm run preview`
4. **Configura notificaciones:** Vercel puede notificarte por email/Slack cuando hay errores
5. **Habilita Preview Deployments:** Cada push a una rama genera una preview URL

---

## 🆘 ¿Necesitas ayuda?

- [Vercel Support](https://vercel.com/support)
- [MongoDB Support](https://support.mongodb.com/)
- [GitHub Issues](https://github.com/Kenyi001/kalos-mvp/issues)

---

**¡Éxito con tu despliegue!** 🎉
