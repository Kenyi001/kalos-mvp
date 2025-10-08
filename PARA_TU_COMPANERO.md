# 🚨 SOLUCIÓN INMEDIATA PARA TU COMPAÑERO

## ❌ Error que está teniendo:
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
http://localhost:3001/api/auth/register
```

**Backend muestra:**
```
[BACKEND] 🚀 Kalos API ejecutándose en puerto 5000  ❌ INCORRECTO
```

---

## ✅ SOLUCIÓN EN 3 PASOS

### Paso 1: Actualizar el código desde GitHub

```bash
cd C:\Proyectos\kalos-mvp
git pull origin main
```

### Paso 2: Ejecutar el script de corrección automática

```bash
fix-port.bat
```

Este script:
- ✅ Eliminará el archivo `.env` incorrecto
- ✅ Creará uno nuevo con `PORT=3001`
- ✅ Mostrará el contenido para verificar

### Paso 3: Reiniciar el servidor

```bash
npm run dev
```

**Ahora debe mostrar:**
```
[BACKEND] 🚀 Kalos API ejecutándose en puerto 3001  ✅ CORRECTO
```

---

## 🔍 VERIFICACIÓN ADICIONAL (Opcional)

Si quieres verificar todo antes de iniciar:

```bash
check-config.bat
```

Este script verificará:
- ✅ Node.js instalado
- ✅ MongoDB instalado
- ✅ Archivo `.env` existe
- ✅ Puerto configurado a 3001
- ✅ Dependencias instaladas
- ✅ Puertos 3001 y 5173 disponibles

---

## 📋 COMANDOS COMPLETOS PASO A PASO

Copia y pega estos comandos en PowerShell:

```powershell
# 1. Ir al proyecto
cd C:\Proyectos\kalos-mvp

# 2. Actualizar código
git pull origin main

# 3. Corregir puerto
fix-port.bat

# 4. Verificar configuración (opcional)
check-config.bat

# 5. Iniciar
npm run dev
```

---

## ✅ RESULTADO ESPERADO

Después de ejecutar `npm run dev`, deberías ver:

```
[BACKEND] 
[BACKEND] > kalos-mvp@1.0.0 dev:backend
[BACKEND] > cd backend && npm run dev
[BACKEND]
[BACKEND] 🚀 Kalos API ejecutándose en puerto 3001    ✅ CORRECTO
[BACKEND] 🌍 Entorno: development
[BACKEND] 📱 Frontend URL: http://localhost:5173
[BACKEND] 🏥 Health check: http://localhost:3001/health
[BACKEND] 📊 MongoDB conectado: localhost

[FRONTEND]
[FRONTEND] > kalos-mvp@1.0.0 dev:frontend
[FRONTEND] > vite
[FRONTEND]
[FRONTEND]   VITE v4.5.14  ready in 560 ms
[FRONTEND]
[FRONTEND]   ➜  Local:   http://localhost:5173/
```

---

## 🎯 PROBAR EL REGISTRO

1. Abre el navegador: http://localhost:5173
2. Haz clic en "Registrarse" o "Crear cuenta"
3. Llena el formulario
4. Haz clic en "Crear cuenta"
5. ✅ Debe registrarte correctamente (ya NO debe salir el error)

---

## 🆘 SI TODAVÍA NO FUNCIONA

### 1. Verifica manualmente el archivo .env

```powershell
# Ver contenido del .env
type backend\.env
```

**Debe contener:**
```
PORT=3001
```

**NO debe decir:**
```
PORT=5000  ❌
```

### 2. Si el archivo .env está mal, edítalo manualmente

Abre el archivo `backend\.env` con el bloc de notas y cambia:
```
PORT=5000
```

Por:
```
PORT=3001
```

Guarda y reinicia el servidor.

---

## 📦 BONUS: Agregar profesionales de prueba

Una vez que el servidor funcione correctamente:

```bash
cd backend
node scripts/seed-santa-cruz-professionals.js
cd ..
```

Esto creará 3 profesionales de Santa Cruz con servicios completos:
- 👨‍🦱 Carlos Mendoza - Barbería profesional
- 💇‍♀️ Ana Pérez - Estilista y colorista
- 💅 Laura Gutiérrez - Especialista en manicura

---

## 📞 CONTACTO

Si después de estos pasos sigue sin funcionar:

1. Toma captura de pantalla de:
   - La consola del backend
   - El error en el navegador
   - El contenido de `backend\.env` (ejecuta: `type backend\.env`)

2. Comparte las capturas para ayudarte mejor

---

## ✅ CHECKLIST FINAL

- [ ] Ejecuté `git pull origin main`
- [ ] Ejecuté `fix-port.bat`
- [ ] El script mostró que el puerto es 3001
- [ ] Ejecuté `npm run dev`
- [ ] El backend muestra "puerto 3001"
- [ ] Puedo abrir http://localhost:5173
- [ ] El registro funciona sin errores

---

**Última actualización:** 7 de octubre de 2025
**Scripts agregados:** `fix-port.bat`, `check-config.bat`, `seed-santa-cruz-professionals.js`
