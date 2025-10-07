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

Crea un archivo `.env` en la carpeta `backend/`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/kalos

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro

# Cloudinary (para subida de imágenes)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Stripe (para pagos)
STRIPE_SECRET_KEY=sk_test_tu_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_tu_stripe_publishable_key

# Email (opcional - para notificaciones)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_password_de_aplicacion

# Server
PORT=5000
NODE_ENV=development
```

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
- **Backend API**: http://localhost:5000
- **API Docs**: http://localhost:5000/api/docs (próximamente)

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

Si tienes algún problema o pregunta:

1. Revisa los [Issues existentes](https://github.com/Kenyi001/kalos-mvp/issues)
2. Crea un [nuevo Issue](https://github.com/Kenyi001/kalos-mvp/issues/new)
3. Contacta al equipo: kenyi@ejemplo.com

---

⭐ Si este proyecto te fue útil, ¡dale una estrella en GitHub!