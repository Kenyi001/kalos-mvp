# 🚀 Inicio Rápido - Kalos MVP

¿Quieres probar Kalos MVP en menos de 5 minutos? ¡Aquí tienes todo lo que necesitas!

## ⚡ Instalación Express (Windows)

### Opción 1: Script Automático
```cmd
# Ejecutar el instalador automático
install.bat
```

### Opción 2: Instalación Manual
```cmd
# 1. Instalar dependencias
npm install
cd backend && npm install && cd ..

# 2. Configurar variables de entorno
# Editar backend/.env (se crea automáticamente)

# 3. Ejecutar la aplicación
npm run dev
```

## ⚡ Instalación Express (Linux/Mac)

### Opción 1: Script Automático
```bash
# Hacer ejecutable y ejecutar
chmod +x install.sh
./install.sh
```

### Opción 2: Instalación Manual
```bash
# 1. Instalar dependencias
npm install
cd backend && npm install && cd ..

# 2. Configurar variables de entorno
cp backend/.env.example backend/.env
# Editar backend/.env con tus credenciales

# 3. Ejecutar la aplicación
npm run dev
```

## 🌐 URLs de Acceso

Una vez iniciada la aplicación:

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000 (o el puerto configurado en .env)

## 👤 Usuarios de Prueba

Puedes usar estos usuarios para probar la aplicación:

### Cliente
- **Email**: maria.cliente@test.com
- **Password**: 123456

### Profesional
- **Email**: sofia.peluquera@test.com
- **Password**: 123456

## 🛠️ Comandos Útiles

```bash
# Desarrollo completo (frontend + backend)
npm run dev

# Solo frontend
npm run dev:frontend

# Solo backend
npm run dev:backend

# Build para producción
npm run build

# Crear usuarios de prueba
cd backend && node scripts/create-test-users.js
```

## 🔧 Configuración Mínima

### MongoDB
Asegúrate de que MongoDB esté corriendo:
```bash
# Windows (si instalado como servicio)
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
# o
mongod
```

### Variables de Entorno
El archivo `backend/.env` debe tener al menos:
```env
MONGODB_URI=mongodb://localhost:27017/kalos
JWT_SECRET=tu_secreto_jwt_muy_seguro
PORT=5000
NODE_ENV=development
```

## 🎯 Funcionalidades a Probar

### Como Cliente:
1. ✅ Regístrate como cliente
2. ✅ Explora profesionales y servicios
3. ✅ Reserva un servicio
4. ✅ Ve tu historial en "Mi Cuenta"

### Como Profesional:
1. ✅ Regístrate como profesional
2. ✅ Crea tu perfil profesional
3. ✅ Ve tu dashboard
4. ✅ Gestiona reservas

## 🆘 Problemas Comunes

### El backend no inicia
- Verifica que MongoDB esté corriendo
- Revisa que el puerto 5000 esté libre
- Asegúrate de que el archivo .env exista

### El frontend no conecta con el backend
- Verifica que ambos servidores estén corriendo
- Revisa las URLs en la consola del navegador
- Asegúrate de que no hay errores de CORS

### No aparecen datos
- Ejecuta el script de usuarios de prueba
- Verifica la conexión a MongoDB
- Revisa los logs del backend

## 📞 Soporte

Si necesitas ayuda:
1. Revisa este documento
2. Consulta el README principal
3. Abre un issue en GitHub
4. Contacta al equipo de desarrollo

---

¡Disfruta explorando Kalos MVP! 🌟