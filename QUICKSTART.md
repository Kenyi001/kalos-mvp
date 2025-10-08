# 🚀 Inicio Rápido - Kalos MVP

## ⚡ Instalación en 3 pasos

### Paso 1: Clonar el repositorio
```bash
git clone https://github.com/Kenyi001/kalos-mvp.git
cd kalos-mvp
```

### Paso 2: Ejecutar el instalador automático

**Windows:**
```bash
install.bat
```

**Linux/Mac:**
```bash
chmod +x install.sh
./install.sh
```

### Paso 3: Iniciar la aplicación
```bash
npm run dev
```

¡Eso es todo! 🎉

---

## 🌐 Acceder a la aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

---

## ⚠️ ¿Problemas al iniciar?

### Error: `ERR_CONNECTION_REFUSED` en puerto 3001

**Solución rápida:**

1. Asegúrate de que el archivo `backend/.env` existe:
   ```bash
   # Windows
   dir backend\.env
   
   # Linux/Mac
   ls backend/.env
   ```

2. Si NO existe, créalo desde el ejemplo:
   ```bash
   # Windows
   copy backend\.env.example backend\.env
   
   # Linux/Mac
   cp backend/.env.example backend/.env
   ```

3. Verifica que el puerto sea **3001**:
   - Abre `backend/.env`
   - Busca la línea: `PORT=3001`
   - Si dice `PORT=5000`, cámbialo a `PORT=3001`

4. Reinicia el servidor:
   ```bash
   # Detener con Ctrl+C
   # Luego:
   npm run dev
   ```

### Error: MongoDB no conecta

**Solución:**

1. **Verifica si MongoDB está instalado:**
   ```bash
   mongod --version
   ```

2. **Inicia MongoDB:**
   
   **Windows:**
   ```powershell
   # Como servicio
   net start MongoDB
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
   mongosh
   # O si tienes MongoDB 4.x:
   mongo
   ```

---

## 👥 Usuarios de prueba

Después de iniciar la app, crea profesionales de Santa Cruz con servicios:

```bash
cd backend
node scripts/seed-santa-cruz-professionals.js
cd ..
```

**Credenciales de profesionales:**
- 🧖‍♀️ **María González** - maria.gonzalez@kalos.com / kalos2024
- ✂️ **Carlos Pérez** - carlos.perez@kalos.com / kalos2024
- 💅 **Ana Rodríguez** - ana.rodriguez@kalos.com / kalos2024

O crea usuarios básicos de prueba:
```bash
cd backend
node scripts/create-test-users.js
cd ..
```

---

## 📋 Más información

- **Guía completa**: [README.md](README.md)
- **Solución de problemas**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Documentación de la API**: Próximamente

---

## ✅ Lista de verificación

Antes de empezar, asegúrate de tener:

- [ ] Node.js v16+ instalado (`node --version`)
- [ ] MongoDB instalado y corriendo
- [ ] Git instalado
- [ ] Puerto 3001 disponible
- [ ] Puerto 5173 disponible

---

## 🎯 Próximos pasos

1. ✅ Instalar la aplicación
2. 🔐 Crear una cuenta
3. 👨‍💼 Explorar perfiles de profesionales
4. 📅 Hacer una reserva
5. 🎨 Personalizar tu perfil

---

¿Necesitas ayuda? Revisa [TROUBLESHOOTING.md](TROUBLESHOOTING.md) o abre un [issue en GitHub](https://github.com/Kenyi001/kalos-mvp/issues).
