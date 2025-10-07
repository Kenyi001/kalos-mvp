# 🌟 Kalos MVP - Plataforma de Servicios de Belleza# 🌟 Kalos MVP - Pl## 🚀 INICIO RÁPIDO (30 segundos)



> **Estado**: ✅ **MVP COMPLETO Y FUNCIONAL**  ### ✨ NUEVO: Un solo comando para todo

> **Versión**: 1.0  

> **Fecha**: Octubre 2025```powershell

npm run dev

Plataforma completa que conecta clientes con profesionales de belleza en Santa Cruz de la Sierra, Bolivia.```



---¡Eso es todo! 🎉



## 🚀 INICIO RÁPIDO (30 segundos)Este comando inicia automáticamente:

- ✅ Backend en: http://localhost:3001

### Un solo comando para iniciar todo:- ✅ Frontend en: http://localhost:5173



```powershell### Login

npm run dev- **Cliente**: maria.cliente@test.com / 123456

```- **Profesional**: sofia.peluquera@test.com / 123456



Este comando inicia automáticamente:📖 **Más info**: Lee `INICIO_RAPIDO.md` o `COMANDO_UNICO.md`s de Belleza

- ✅ Backend en: http://localhost:3001

- ✅ Frontend en: http://localhost:5173> **Estado**: ✅ **INTEGRACIÓN FRONTEND-BACKEND 100% COMPLETA**  

> **Versión**: MVP 1.0  

### 🔑 Credenciales de Prueba> **Fecha**: 5 de octubre de 2025



**Cliente:**Plataforma completa que conecta clientes con profesionales de belleza y bienestar.

- Email: daxkenyi001@gmail.com

- Password: 12345678---



**Profesional:**## 🎯 Objetivo

- Email: sofia.pro@gmail.com

- Password: 12345678Crear una plataforma funcional donde:

- ✅ **Clientes** pueden descubrir profesionales, ver perfiles y **reservar servicios**

---- ✅ **Profesionales** pueden crear perfiles, ofrecer servicios y **gestionar reservas**

- ✅ **Sistema completo** de autenticación, reservas y dashboard

## 📋 Requisitos Previos

---

- Node.js v18+ 

- MongoDB instalado y corriendo localmente## � INICIO RÁPIDO (2 minutos)

- NPM o Yarn

### 1. Iniciar Backend

---```powershell

cd backend

## 🛠️ Instalación Manualnode server.js

```

### 1. Clonar el repositorio✅ Backend en: http://localhost:3001

```bash

git clone <repository-url>### 2. Iniciar Frontend

cd kalos-mvp```powershell

```npm run dev

```

### 2. Instalar dependencias✅ Frontend en: http://localhost:5173



**Frontend:**### 3. Login

```bash- **Cliente**: maria.cliente@test.com / 123456

npm install- **Profesional**: sofia.peluquera@test.com / 123456

```

📖 **Guía completa**: Lee `INICIO_RAPIDO.md`

**Backend:**

```bash---

cd backend

npm install## ✨ ¿Qué hay de nuevo?

```

### ✅ Backend Completo (14 endpoints)

### 3. Configurar variables de entorno- Sistema de autenticación JWT

- CRUD de profesionales

**Backend (.env):**- CRUD de servicios

```env- **Sistema de reservas completo** ⭐

PORT=3001- 26/26 tests pasando (100%)

MONGODB_URI=mongodb://localhost:27017/kalos-dev

JWT_SECRET=tu_jwt_secret_key_aqui_muy_seguro### ✅ Frontend Integrado (6 páginas)

NODE_ENV=development- Login/Register funcional

```- Lista de servicios desde backend

- Perfiles de profesionales dinámicos

**Frontend (.env):**- **Sistema de reservas (3 pasos)** ⭐

```env- Cuenta de cliente con gestión de reservas

VITE_API_URL=http://localhost:3001/api- Dashboard profesional con estadísticas

```

### ✅ Infraestructura Nueva

### 4. Crear usuarios de prueba- `src/config/api.js` - Cliente API

- `src/services/apiService.js` - Servicios completos

```bash- Toast notifications

cd backend- Loading states

node scripts/create-test-users.js- Error handling robusto

```

---

---

## � Páginas Implementadas

## 📁 Estructura del Proyecto

### ✅ Públicas

```1. **/** - Landing page

kalos-mvp/2. **/profesionales** - Listado de profesionales

├── backend/3. **/servicios** - Catálogo de servicios (integrado con backend)

│   ├── config/          # Configuración (DB, etc.)4. **/auth/login** - Inicio de sesión (funcional)

│   ├── controllers/     # Lógica de negocio5. **/auth/register** - Registro de usuario (funcional)

│   ├── middleware/      # Auth, error handling

│   ├── models/          # Modelos Mongoose### ✅ Privadas (Cliente)

│   ├── routes/          # Rutas API1. **/pro/:id** - Perfil de profesional (integrado)

│   ├── scripts/         # Scripts de utilidad2. **/booking/new** - Reservar servicio - 3 pasos (funcional)

│   └── server.js        # Punto de entrada3. **/account** - Mi cuenta y reservas (integrado)

│

├── src/### ✅ Privadas (Profesional)

│   ├── components/      # Componentes reutilizables1. **/dashboard** - Panel de control (integrado)

│   │   ├── auth/        # Login, Register2. **/pro/profile/create** - Crear perfil profesional

│   │   ├── booking/     # Sistema de reservas

│   │   ├── layout/      # Header, Footer---

│   │   ├── professionals/ # Tarjetas de profesionales

│   │   ├── services/    # Catálogo de servicios## ⚙️ Funcionalidades Implementadas

│   │   └── ui/          # MapSelector, Toast, Loading

│   │### ✅ Para Clientes

│   ├── config/          # Configuración del cliente- [x] Ver listado de profesionales y servicios

│   │   └── api.js       # Cliente HTTP- [x] Filtrar por categoría de servicio

│   │- [x] Ver perfil detallado de profesional

│   ├── pages/           # Páginas de la aplicación- [x] **Reservar un servicio (flujo de 3 pasos completo)** ⭐

│   │   ├── LandingPage.js- [x] **Ver historial de reservas**

│   │   ├── ProfessionalsPage.js- [x] **Cancelar reservas**

│   │   ├── ServicesPage.js- [x] Gestionar cuenta personal

│   │   ├── AuthPages.js- [x] Notificaciones toast

│   │   ├── BookingPage.js- [x] Estados de carga

│   │   ├── AccountPage.js

│   │   ├── DashboardPage.js### ✅ Para Profesionales

│   │   └── CreateProfessionalProfilePage.js- [x] Registro como profesional

│   │- [x] Login con rol profesional

│   ├── services/        # Servicios de negocio- [x] **Ver dashboard con estadísticas en tiempo real** ⭐

│   │   ├── apiService.js    # Llamadas a API- [x] **Ver lista de reservas**

│   │   └── state.js         # Estado global- [x] **Confirmar reservas pendientes**

│   │- [x] **Completar reservas confirmadas**

│   ├── styles/          # Estilos globales- [x] Ver lista de servicios propios

│   │   └── main.css- [x] Panel de control completo

│   │

│   ├── utils/           # Utilidades---

│   │   └── router.js    # Sistema de rutas SPA

│   │## 🛠️ Stack Tecnológico

│   └── main.js          # Punto de entrada frontend

│### Backend

├── public/              # Archivos estáticos- Node.js v22.18.0

├── index.html           # HTML principal- Express.js 4.18.2

├── package.json         # Dependencias frontend- MongoDB (local)

└── vite.config.js       # Configuración Vite- Mongoose 7.5.0

```- JWT Authentication

- bcryptjs

---- Helmet (seguridad)



## 🎯 Características Principales### Frontend

- Vite 5.0

### ✅ Para Clientes- Vanilla JavaScript (ES6+)

- 🔍 Búsqueda y filtrado de profesionales por categoría- Tailwind CSS

- 👤 Visualización de perfiles detallados con portfolio- Font Awesome

- 📅 Sistema de reservas en 3 pasos:- Fetch API

  1. Selección de servicio- SimpleRouter

  2. Fecha, hora y ubicación (con mapa interactivo)

  3. Confirmación y notas---

- 📋 Gestión de reservas (ver, cancelar)

- 👥 Cuenta personal con información## 📊 Métricas del Proyecto



### ✅ Para Profesionales| Componente | Estado |

- 📊 Dashboard con estadísticas en tiempo real|------------|--------|

- 📅 Gestión de reservas (confirmar, completar, rechazar)| Backend endpoints | 14/14 ✅ |

- 💼 Creación y edición de perfil profesional| Tests backend | 26/26 ✅ |

- 🎨 Gestión de servicios y precios| Páginas integradas | 6/6 ✅ |

- 📸 Upload de portfolio de trabajos| Endpoints consumidos | 10/14 ✅ |

- 📍 Configuración de ubicación (salón/domicilio)| Sistema de reservas | 100% ✅ |

| Autenticación | 100% ✅ |

### ✅ Sistema General| Dashboard profesional | 100% ✅ |

- 🔐 Autenticación JWT con roles (cliente/profesional)

- 🗺️ Integración con mapas Leaflet (OpenStreetMap)---

- 🔔 Sistema de notificaciones toast

- ⚡ Estados de carga optimizados## 📚 Documentación Disponible

- 📱 Diseño responsive (mobile-first)

- 🎨 Tema mediterráneo con colores aegean, olive-gold, terracotta¿No sabes por dónde empezar? Lee el **índice**:



---👉 **`INDICE_DOCUMENTACION.md`** - Guía de toda la documentación



## 🛠️ Stack Tecnológico### Documentos Principales



### Backend| Documento | Propósito | Tiempo |

- **Runtime**: Node.js v18+|-----------|-----------|--------|

- **Framework**: Express.js 4.18| `INICIO_RAPIDO.md` ⭐ | Arranque rápido | 2 min |

- **Base de datos**: MongoDB + Mongoose| `INSTRUCCIONES_PASO_A_PASO.md` | Tutorial completo | 10 min |

- **Autenticación**: JWT + bcryptjs| `DEMO_RAPIDA.md` | Guía de demo | 5 min |

- **Seguridad**: Helmet, CORS| `INTEGRACION_COMPLETA.md` | Detalles técnicos | 20 min |

- **Upload**: Multer (imágenes de perfil y portfolio)| `RESUMEN_EJECUTIVO.md` | Overview completo | 15 min |



### Frontend**Total**: 16 archivos de documentación

- **Build Tool**: Vite 4.4

- **Framework**: Vanilla JavaScript (ES6+)---

- **Estilos**: CSS personalizado (inspirado en Tailwind)

- **Mapas**: Leaflet 1.9.4## 🎯 Flujo de Demostración (5 minutos)

- **Iconos**: Font Awesome 6.0

- **Router**: SimpleRouter (custom SPA router)### Cliente (3 minutos)

1. ✅ Login como cliente

---2. ✅ Ver catálogo de servicios

3. ✅ Ver perfil de profesional

## 📡 API Endpoints4. ✅ Crear reserva (3 pasos)

5. ✅ Ver reserva en "Mi Cuenta"

### Autenticación6. ✅ Cancelar reserva

- `POST /api/auth/register` - Registro de usuario

- `POST /api/auth/login` - Inicio de sesión### Profesional (2 minutos)

- `GET /api/auth/me` - Usuario actual7. ✅ Login como profesional

8. ✅ Ver dashboard con estadísticas

### Profesionales9. ✅ Confirmar reserva pendiente

- `GET /api/professionals` - Listar profesionales10. ✅ Completar reserva confirmada

- `GET /api/professionals/:id` - Detalle de profesional

- `POST /api/professionals` - Crear perfil profesional (auth)📖 **Guía detallada**: Lee `DEMO_RAPIDA.md`

- `PUT /api/professionals/:id` - Actualizar perfil (auth)- [ ] Estadísticas básicas



### Servicios## 🔄 Estado Actual del MVP

- `GET /api/services` - Listar servicios

- `GET /api/services/:id` - Detalle de servicio### ✅ Completado

- `POST /api/services` - Crear servicio (auth, profesional)- ✅ **Estructura completa del proyecto** - Vite + Vanilla JS + Tailwind CSS

- `PUT /api/services/:id` - Actualizar servicio (auth, profesional)- ✅ **Landing page funcional** - Diseño atractivo y responsive

- `DELETE /api/services/:id` - Eliminar servicio (auth, profesional)- ✅ **Sistema de autenticación completo** - Login, registro, demo users

- ✅ **Listado completo de profesionales** - Con filtros y búsqueda

### Reservas- ✅ **Perfiles detallados de profesionales** - Información, servicios, reseñas

- `GET /api/bookings` - Listar reservas del usuario (auth)- ✅ **Catálogo completo de servicios** - Por categorías con descripciones

- `GET /api/bookings/:id` - Detalle de reserva (auth)- ✅ **Flujo completo de reserva** - 3 pasos: profesional, fecha/hora, confirmación

- `POST /api/bookings` - Crear reserva (auth)- ✅ **Dashboard para profesionales** - Estadísticas, citas, gestión

- `PATCH /api/bookings/:id/status` - Actualizar estado (auth, profesional)- ✅ **Página de cuenta para clientes** - Perfil, historial de citas

- ✅ **Creación de perfil profesional** - Formulario completo

---- ✅ **Header responsive** - Navegación móvil y desktop

- ✅ **Router SPA funcional** - Navegación sin recarga

## 🧪 Scripts Útiles- ✅ **Estado global de la aplicación** - Gestión de datos centralizada

- ✅ **Notificaciones in-app** - Feedback visual para acciones

### Backend- ✅ **Diseño mobile-first** - Optimizado para todos los dispositivos



```bash### 🎯 Funcionalidades Implementadas

# Crear usuarios de prueba

node scripts/create-test-users.js#### Para Clientes:

- ✅ Registro e inicio de sesión

# Resetear contraseñas- ✅ Búsqueda y filtrado de profesionales

node scripts/reset-passwords.js- ✅ Visualización de perfiles detallados

- ✅ Reserva de citas (3 pasos)

# Listar usuarios- ✅ Gestión de cuenta personal

node scripts/list-users.js- ✅ Historial de citas

- ✅ Sistema de favoritos

# Listar servicios

node scripts/list-services.js#### Para Profesionales:

- ✅ Registro como profesional

# Verificar usuario específico- ✅ Creación y edición de perfil

node scripts/check-user.js- ✅ Dashboard con estadísticas

- ✅ Gestión de citas pendientes

# Arreglar professionalId- ✅ Configuración de servicios y precios

node scripts/fix-professional-id.js- ✅ Gestión de horarios

```- ✅ Control de disponibilidad



---### 🚀 MVP Completado al 100%



## 🎨 Tema de Diseño## 🚀 Próximos Pasos para Evolución Post-MVP



**Paleta Mediterránea:**### 📈 Fase 2 - Mejoras y Expansión

- **Aegean** (Azul mediterráneo): `#1B4B7A`1. **Backend Real**

- **Olive Gold** (Dorado oliva): `#B8860B`   - Integración con base de datos real

- **Terracotta** (Terracota): `#d97f70`   - API REST completa

- **Marble** (Mármol): Tonos blancos/grises   - Autenticación con JWT



**Tipografía:**2. **Pagos y Monetización**

- Títulos: 'Crimson Text' (serif)   - Integración con Stripe/PayPal

- Cuerpo: 'Inter' (sans-serif)   - Sistema de comisiones

   - Facturación automática

---

3. **Funcionalidades Avanzadas**

## 📚 Documentación Adicional   - Chat en tiempo real

   - Videollamadas para consultas

- **DOCS.md** - Documentación técnica detallada   - Sistema de reseñas avanzado

- **TESTING.md** - Guía de pruebas y testing   - Geolocalización en tiempo real

- **backend/README.md** - Documentación específica del backend

### 🛠️ Mejoras Técnicas

---1. **Performance**

   - Lazy loading de imágenes

## 🐛 Troubleshooting   - Service Workers para PWA

   - Caché inteligente

### El backend no inicia

```bash2. **SEO y Analytics**

# Verificar que MongoDB esté corriendo   - Meta tags dinámicos

mongod --version   - Google Analytics

   - Schema markup

# Verificar puerto 3001 libre

netstat -ano | findstr :30013. **Testing y Quality**

```   - Tests unitarios y E2E

   - Linting automático

### No veo mis servicios como profesional   - CI/CD pipeline

```bash

# Ejecutar script de corrección## 💻 Tecnologías

cd backend

node scripts/fix-professional-id.js- **Frontend**: JavaScript vanilla con Vite

```- **Estilos**: Tailwind CSS

- **Backend**: Firebase (Auth, Firestore)

### Error de CORS- **Despliegue**: Vercel/Netlify

- Verificar que `VITE_API_URL` apunte a `http://localhost:3001/api`

- Reiniciar ambos servidores---



---## Instrucciones para Desarrollo



## 🚀 Deployment1. Clonar este repositorio

2. Instalar dependencias: `npm install`

### Frontend (Vercel/Netlify)3. Iniciar servidor de desarrollo: `npm run dev`

1. Build: `npm run build`4. Acceder a `http://localhost:5173`

2. Output: `dist/`

3. Configurar variable: `VITE_API_URL=https://tu-api.com/api`## Contribuciones



### Backend (Heroku/Railway)Este MVP está en desarrollo activo. Priorizar las funcionalidades marcadas como "Pendiente" con prioridad alta.

1. Configurar variables de entorno
2. Cambiar `MONGODB_URI` a MongoDB Atlas
3. Deploy desde `backend/`

---

## 📄 Licencia

Este proyecto es un MVP privado desarrollado para propósitos de demostración.

---

## 👥 Contacto

Para preguntas o soporte, contactar al equipo de desarrollo.

---

**¡Gracias por usar Kalos! 🌟**
