# 🌟 Kalos MVP - Plataforma de Servicios de Belleza

Una plataforma moderna para conectar clientes con profesionales de belleza, permitiendo reservas de servicios de manera fácil y eficiente.

## ✨ Características

- 🔐 **Autenticación completa** - Registro e inicio de sesión para clientes y profesionales
- 👩‍💼 **Perfiles de profesionales** - Gestión completa de perfiles profesionales
- 📅 **Sistema de reservas** - Booking intuitivo con calendario
- 🗺️ **Mapas interactivos** - Localización de profesionales cercanos
- 💳 **Procesamiento de pagos** - Integración con Stripe
- 📱 **Diseño responsivo** - Interfaz adaptada para móviles y desktop
- ☁️ **Almacenamiento en la nube** - Subida de imágenes con Cloudinary

## 🚀 Instalación Rápida

### Prerequisitos

- Node.js (v16 o superior)
- MongoDB (local o MongoDB Atlas)
- Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/Kenyi001/kalos-mvp.git
cd kalos-mvp
```

### 2. Instalar dependencias

```bash
# Instalar dependencias del frontend
npm install

# Instalar dependencias del backend
cd backend
npm install
cd ..
```

### 3. Configuración de variables de entorno

Copia el archivo de ejemplo `.env.example` a `.env` en la carpeta `backend/`:

```bash
# Windows
copy backend\.env.example backend\.env

# Linux/Mac
cp backend/.env.example backend/.env
```

O crea un archivo `.env` manualmente en la carpeta `backend/` con este contenido:

```env
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

> ⚠️ **IMPORTANTE**: Asegúrate de que el puerto sea **3001** (no 5000)

### 4. Ejecutar la aplicación

```bash
# Ejecutar tanto frontend como backend simultáneamente
npm run dev
```

O ejecutar por separado:

```bash
# Solo backend (puerto 5000)
npm run dev:backend

# Solo frontend (puerto 5173)
npm run dev:frontend
```

## 🌐 URLs de Acceso

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 📁 Estructura del Proyecto

```
kalos-mvp/
├── backend/                 # Servidor Node.js/Express
│   ├── config/             # Configuración de BD y servicios
│   ├── controllers/        # Controladores de API
│   ├── middleware/         # Middlewares personalizados
│   ├── models/            # Modelos de MongoDB
│   ├── routes/            # Rutas de la API
│   └── scripts/           # Scripts de utilidad
├── src/                   # Frontend (Vanilla JS + Vite)
│   ├── components/        # Componentes reutilizables
│   ├── pages/            # Páginas de la aplicación
│   ├── services/         # Servicios para API calls
│   ├── styles/           # Estilos CSS/Tailwind
│   └── utils/            # Utilidades y helpers
└── public/               # Archivos estáticos
```

## 🔧 Scripts Disponibles

### Frontend
- `npm run dev` - Desarrollo con hot reload
- `npm run build` - Build para producción
- `npm run preview` - Preview del build

### Backend
- `npm run dev:backend` - Servidor con nodemon
- `npm run start` - Servidor en producción
- `npm test` - Ejecutar tests

### Combinados
- `npm run dev` - Frontend + Backend simultáneamente

## 🧪 Datos de Prueba

Para poblar la base de datos with datos de prueba:

```bash
cd backend
node scripts/create-test-users.js
```

### Usuarios de prueba:
- **Cliente**: maria.cliente@test.com / 123456
- **Profesional**: sofia.peluquera@test.com / 123456

## 🔗 APIs Principales

### Autenticación
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Usuarios
- `GET /api/users/profile` - Perfil del usuario
- `PUT /api/users/profile` - Actualizar perfil

### Profesionales
- `GET /api/professionals` - Listar profesionales
- `POST /api/professionals` - Crear perfil profesional
- `GET /api/professionals/:id` - Obtener profesional

### Servicios
- `GET /api/services` - Listar servicios
- `POST /api/services` - Crear servicio
- `PUT /api/services/:id` - Actualizar servicio

### Reservas
- `GET /api/bookings` - Listar reservas
- `POST /api/bookings` - Crear reserva
- `PUT /api/bookings/:id` - Actualizar reserva

## 🚀 Despliegue

### Frontend (Vercel/Netlify)
```bash
npm run build
```

### Backend (Railway/Render/Heroku)
Asegúrate de configurar las variables de entorno en tu plataforma de despliegue.

## 🛠️ Stack Tecnológico

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (upload de archivos)
- Cloudinary (almacenamiento de imágenes)

### Frontend
- Vanilla JavaScript + Vite
- Tailwind CSS
- Leaflet (mapas)
- Font Awesome (iconos)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

- **Desarrollo Full Stack** - [Kenyi001](https://github.com/Kenyi001)

## 🆘 Soporte

Si tienes algún problema:

1. Revisa la [Guía de Solución de Problemas](TROUBLESHOOTING.md) 📋
2. Consulta los [Issues existentes](https://github.com/Kenyi001/kalos-mvp/issues)
3. Crea un [nuevo Issue](https://github.com/Kenyi001/kalos-mvp/issues/new)

### Problemas Comunes
- **Error: ERR_CONNECTION_REFUSED en puerto 3001** → Ver [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **MongoDB no conecta** → Ver [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Puerto ya en uso** → Ver [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

⭐ Si este proyecto te fue útil, ¡dale una estrella en GitHub!