# 🧪 Guía de Usuarios de Prueba - Kalos MVP

Esta guía contiene información detallada sobre todos los usuarios de prueba disponibles en la aplicación Kalos MVP para facilitar las pruebas de funcionalidades.

## 📋 Acceso Rápido

### URL Directa
Visita `/test-users` para ver una interfaz completa con todos los usuarios de prueba.

### Desde Login
En la página de login (`/auth/login`), haz clic en "Mostrar" bajo "Usuarios de prueba" para ver opciones de acceso rápido.

---

## 👥 Usuarios de Prueba Disponibles

### 1. 👤 **María García** - Cliente Activa
- **Email:** `maria.cliente@test.com`
- **Contraseña:** `123456`
- **Tipo:** Cliente regular con experiencia
- **Características:**
  - 12 reservas completadas
  - €540 gastados en total
  - Miembro desde enero 2024
  - Preferencias: Peluquería, Manicura
  - Ubicación: Madrid Centro
  - Presupuesto: Medio
  - Profesionales favoritos: Sofia Rodriguez, Carmen Gutierrez

### 2. 🌱 **Luis Rodríguez** - Usuario Nuevo
- **Email:** `luis.nuevo@test.com`
- **Contraseña:** `123456`
- **Tipo:** Cliente principiante
- **Características:**
  - Primera vez en la plataforma
  - Sin reservas previas
  - Perfil sin verificar
  - Ubicación: Madrid Sur
  - Presupuesto: Económico
  - Sin preferencias establecidas

### 3. 👑 **Carmen Deluxe** - Cliente VIP
- **Email:** `carmen.vip@test.com`
- **Contraseña:** `123456`
- **Tipo:** Cliente premium
- **Características:**
  - 48 reservas completadas
  - €2,340 gastados en total
  - Membresía Premium activa
  - Miembro desde junio 2023
  - Preferencias: Estética, Maquillaje, Masajes
  - Ubicación: Salamanca
  - Presupuesto: Alto
  - Enfocada en servicios de lujo

### 4. ✂️ **Sofia Rodriguez** - Profesional Senior
- **Email:** `sofia.peluquera@test.com`
- **Contraseña:** `123456`
- **Tipo:** Profesional experimentado
- **Características:**
  - 12 años de experiencia
  - Rating: 4.9/5 (234 reseñas)
  - Especialidad: Peluquería premium
  - €2,450 ingresos mensuales
  - 89 clientes recurrentes
  - Certificaciones internacionales
  - Negocio: "Estudio Sofia Hair"
  - Ubicación: Gran Vía 15, Madrid

### 5. 💅 **Ana López** - Profesional Junior
- **Email:** `ana.manicura@test.com`
- **Contraseña:** `123456`
- **Tipo:** Profesional en crecimiento
- **Características:**
  - 3 años de experiencia
  - Rating: 4.4/5 (67 reseñas)
  - Especialidad: Manicura y nail art
  - €680 ingresos mensuales
  - 12 clientes recurrentes
  - En proceso de construcción de clientela
  - Negocio: "Nails by Ana"
  - Ubicación: Fuencarral 82, Madrid

---

## 🎯 Casos de Uso por Usuario

### Para Clientes

#### **María García (Cliente Activa)**
- ✅ Probar flujo de reserva con historial
- ✅ Gestión de citas existentes
- ✅ Visualizar profesionales favoritos
- ✅ Experiencia de usuario recurrente
- ✅ Notificaciones y recordatorios

#### **Luis Rodríguez (Usuario Nuevo)**
- ✅ Primera experiencia en la plataforma
- ✅ Onboarding y tutorial
- ✅ Búsqueda inicial de profesionales
- ✅ Primera reserva paso a paso
- ✅ Verificación de cuenta

#### **Carmen Deluxe (Cliente VIP)**
- ✅ Servicios premium y de alta gama
- ✅ Funcionalidades exclusivas
- ✅ Historial extenso de servicios
- ✅ Profesionales de élite
- ✅ Experiencia personalizada

### Para Profesionales

#### **Sofia Rodriguez (Senior)**
- ✅ Dashboard con métricas avanzadas
- ✅ Gestión de agenda compleja
- ✅ Clientes recurrentes
- ✅ Ingresos estables
- ✅ Reputación establecida
- ✅ Herramientas de profesional experimentado

#### **Ana López (Junior)**
- ✅ Perfil en construcción
- ✅ Estrategias de crecimiento
- ✅ Construcción de clientela
- ✅ Herramientas para profesionales nuevos
- ✅ Gestión de disponibilidad básica

---

## 📊 Datos de Prueba Incluidos

### Reservas de Ejemplo
Cada usuario tiene reservas pre-cargadas con diferentes estados:
- ✅ **Completadas:** Con reseñas y calificaciones
- ⏳ **Pendientes:** Para probar confirmaciones
- 🔄 **En proceso:** Para diferentes flujos

### Servicios Populares
28 servicios distribuidos en categorías:
- **Peluquería:** 6 servicios (€20-120)
- **Manicura:** 5 servicios (€15-80)
- **Estética:** 5 servicios (€35-150)
- **Depilación:** 4 servicios (€0-60)
- **Maquillaje:** 4 servicios (€40-250)
- **Masajes:** 4 servicios (€40-95)

### Profesionales Disponibles
8 profesionales con diferentes perfiles:
- Especialidades variadas
- Diferentes niveles de experiencia
- Rangos de precios diversos
- Ubicaciones en Madrid
- Disponibilidad realista

---

## 🔄 Flujos de Prueba Recomendados

### Flujo Completo Cliente Nuevo (Luis)
1. **Registro/Login** → Usar luis.nuevo@test.com
2. **Exploración** → Navegar por profesionales y servicios
3. **Primera Reserva** → Seleccionar profesional → Elegir servicio → Confirmar cita
4. **Verificación** → Simular verificación de cuenta
5. **Seguimiento** → Ver estado de la reserva

### Flujo Cliente Experimentado (María)
1. **Login** → Usar maria.cliente@test.com
2. **Dashboard** → Revisar reservas anteriores y favoritos
3. **Nueva Reserva** → Con profesional conocido
4. **Gestión** → Modificar o cancelar citas existentes
5. **Evaluación** → Dejar reseñas de servicios completados

### Flujo Cliente Premium (Carmen)
1. **Login** → Usar carmen.vip@test.com
2. **Servicios Premium** → Explorar opciones de alta gama
3. **Reserva Múltiple** → Varios servicios o profesionales
4. **Experiencia VIP** → Funcionalidades exclusivas
5. **Historial** → Revisar gastos y preferencias

### Flujo Profesional Establecido (Sofia)
1. **Login** → Usar sofia.peluquera@test.com
2. **Dashboard Pro** → Revisar métricas y estadísticas
3. **Gestión Agenda** → Configurar disponibilidad
4. **Clientes** → Gestionar reservas y clientes recurrentes
5. **Perfil** → Actualizar servicios y precios

### Flujo Profesional Nuevo (Ana)
1. **Login** → Usar ana.manicura@test.com
2. **Configuración** → Completar perfil profesional
3. **Primeras Reservas** → Gestionar primeros clientes
4. **Crecimiento** → Estrategias para aumentar visibilidad
5. **Construcción** → Desarrollar base de clientes

---

## 🛠️ Datos Técnicos

### Estructura de Usuarios
```javascript
{
  id: 'user_1',
  email: 'maria.cliente@test.com',
  name: 'María García',
  type: 'client|professional',
  verified: true|false,
  preferences: { ... },
  stats: { ... }
}
```

### Estados de Reserva
- `pending` - Pendiente de confirmación
- `confirmed` - Confirmada
- `completed` - Completada
- `cancelled` - Cancelada

### Métodos de Testing
```javascript
// Login programático
state.loginWithTestUser(email, password)

// Obtener usuarios de prueba
state.getTestUsers()

// Datos mock
state.mockUsers[email]
state.professionals
state.services
state.bookings
```

---

## 💡 Tips para Testing

### Navegación Rápida
1. **Homepage** → `/` - Página principal
2. **Login** → `/auth/login` - Con usuarios de prueba visibles
3. **Test Users** → `/test-users` - Página completa de usuarios
4. **Profesionales** → `/profesionales` - Lista con filtros
5. **Servicios** → `/servicios` - Catálogo completo
6. **Dashboard** → `/dashboard` - Solo para profesionales

### Casos Edge
- Usuario sin verificar (Luis)
- Profesional sin reservas recientes
- Cliente con muchas reservas (María, Carmen)
- Diferentes rangos de precios
- Servicios populares vs nichó

### Validaciones
- Formularios con datos reales
- Flujos completos de extremo a extremo
- Estados de carga y error
- Responsive design en diferentes dispositivos
- Funcionalidad sin JavaScript (graceful degradation)

---

## 📞 Soporte

Si encuentras problemas con los usuarios de prueba:
1. Verifica que estés usando las credenciales exactas
2. Revisa la consola del navegador para errores
3. Asegúrate de que el localStorage esté habilitado
4. Prueba en modo incógnito si hay problemas de caché

---

*Última actualización: Diciembre 2024*