# 🛠️ Documentación Técnica - Kalos MVP

## 📋 Arquitectura del Proyecto

### Estructura de Archivos
```
kalos-mvp/
├── index.html              # Punto de entrada HTML
├── package.json            # Dependencias y scripts
├── vite.config.js         # Configuración de Vite
├── tailwind.config.js     # Configuración de Tailwind CSS
├── postcss.config.js      # Configuración de PostCSS
├── README.md              # Documentación del proyecto
├── DOCS.md               # Esta documentación técnica
└── src/
    ├── main.js           # Punto de entrada JavaScript
    ├── components/       # Componentes reutilizables
    │   └── layout/
    │       └── Header.js # Componente de navegación
    ├── pages/            # Páginas de la aplicación
    │   ├── LandingPage.js
    │   ├── ProfessionalsPage.js
    │   ├── ProfessionalProfilePage.js
    │   ├── ServicesPage.js
    │   ├── AuthPages.js
    │   ├── BookingPage.js
    │   ├── DashboardPage.js
    │   ├── AccountPage.js
    │   └── CreateProfessionalProfilePage.js
    ├── services/         # Servicios y lógica de negocio
    │   └── state.js      # Estado global de la aplicación
    └── utils/            # Utilidades y helpers
        └── router.js     # Router SPA personalizado
```

## 🎯 Tecnologías Utilizadas

### Frontend
- **Vite**: Build tool y servidor de desarrollo
- **Vanilla JavaScript (ES6+)**: Sin frameworks, máximo rendimiento
- **Tailwind CSS**: Framework de CSS utilitario
- **Font Awesome**: Iconografía
- **Module System**: Imports/exports nativos del navegador

### Herramientas de Desarrollo
- **NPM**: Gestión de paquetes
- **PostCSS**: Procesamiento de CSS
- **Autoprefixer**: Prefijos CSS automáticos

## 🏗️ Patrones de Diseño Implementados

### 1. Single Page Application (SPA)
- Router personalizado sin dependencias externas
- Navegación sin recarga de página
- Gestión de historial del navegador

### 2. State Management Pattern
- Estado global centralizado (`state.js`)
- Sistema de eventos para comunicación entre componentes
- Persistencia en localStorage para datos de usuario

### 3. Component-Based Architecture
- Componentes funcionales reutilizables
- Separación clara de responsabilidades
- Renderizado condicional basado en estado

### 4. MVC-like Pattern
- **Model**: `state.js` - Gestión de datos
- **View**: Archivos en `pages/` - Presentación
- **Controller**: `router.js` + handlers - Lógica de navegación

## 📊 Flujo de Datos

```
[User Interaction] → [Event Handler] → [State Update] → [Re-render] → [DOM Update]
                                    ↓
                              [LocalStorage Sync]
```

## 🔧 Funciones Clave

### Router (`utils/router.js`)
```javascript
// Manejo de rutas dinámicas
router.addRoute('/pro/:id', (params) => {
    // params.id disponible aquí
});

// Navegación programática
router.navigate('/path');
```

### Estado Global (`services/state.js`)
```javascript
// Suscripción a cambios
state.on('userChanged', (userData) => {
    // Actualizar UI cuando cambie el usuario
});

// Actualización de estado
state.setUser(userData);
```

### Sistema de Notificaciones
```javascript
// Mostrar notificación
showNotification('Mensaje', 'success|error|info');
```

## 🎨 Sistema de Diseño

### Colores Principales
- **Primary**: #8B5CF6 (Púrpura)
- **Secondary**: #F3E8FF (Púrpura claro)
- **Accent**: #EC4899 (Rosa)

### Tipografía
- **Font Family**: Inter (fallback: sans-serif)
- **Escalas**: text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl, text-4xl

### Espaciado
- **Padding**: Múltiplos de 4px (p-1, p-2, p-4, p-6, p-8...)
- **Margin**: Múltiplos de 4px (m-1, m-2, m-4, m-6, m-8...)
- **Gap**: Múltiplos de 4px para Grid y Flexbox

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Estrategia Mobile-First
```css
/* Mobile por defecto */
.class { /* estilos móvil */ }

/* Tablet y superior */
@media (min-width: 768px) {
    .md:class { /* estilos tablet+ */ }
}

/* Desktop */
@media (min-width: 1024px) {
    .lg:class { /* estilos desktop */ }
}
```

## 🔐 Seguridad Implementada

### Frontend Security
- Validación de inputs en cliente
- Sanitización de datos de usuario
- Escape de caracteres especiales en rendering

### Simulación de Autenticación
- Tokens simulados en localStorage
- Verificación de permisos por tipo de usuario
- Rutas protegidas según rol

## 📈 Performance

### Optimizaciones Implementadas
- **Lazy Navigation**: Carga de componentes bajo demanda
- **Event Delegation**: Manejo eficiente de eventos
- **Minimal DOM Manipulation**: Re-render selectivo
- **CSS Purging**: Solo CSS utilizado en producción

### Métricas Objetivo
- **First Paint**: < 1.5s
- **Interactive**: < 3s
- **Bundle Size**: < 100KB gzipped

## 🧪 Testing Strategy

### Tipos de Test Recomendados
1. **Unit Tests**: Funciones utilitarias y estado
2. **Integration Tests**: Flujos de usuario completos
3. **E2E Tests**: Scenarios de reserva y registro

### Herramientas Sugeridas
- **Vitest**: Testing framework
- **Testing Library**: Utilities para DOM testing
- **Playwright**: E2E testing

## 📦 Build y Deployment

### Scripts Disponibles
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build
```

### Configuración de Build
- **Output**: Carpeta `dist/`
- **Assets**: Optimización automática de imágenes
- **Minification**: JavaScript y CSS minificados
- **Tree Shaking**: Código no utilizado eliminado

## 🔄 Estado de Mock Data

### Datos de Profesionales
```javascript
const professionals = [
    {
        id: '1',
        name: 'Sofia Rodriguez',
        specialty: 'Peluquería',
        rating: 4.8,
        // ... más campos
    }
];
```

### Servicios Disponibles
- Peluquería: Corte, Coloración, Peinado
- Manicura: Manicura, Pedicura, Nail Art
- Estética: Limpieza facial, Tratamientos

## 🚀 Escalabilidad

### Para Backend Real
1. **API Integration**: Cambiar `state.js` por llamadas HTTP
2. **Authentication**: Implementar JWT tokens
3. **Real-time**: WebSockets para notificaciones
4. **Database**: PostgreSQL/MongoDB para persistencia

### Para Producción
1. **CDN**: Servir assets estáticos
2. **Monitoring**: Sentry para error tracking
3. **Analytics**: Google Analytics implementado
4. **SEO**: Meta tags dinámicos y SSR

## 🐛 Debugging

### Console Messages
- `🚀 Iniciando Kalos MVP...`
- `✅ Kalos MVP iniciado correctamente`
- `⚡ Tiempo de carga: Xms`

### Common Issues
1. **Import Errors**: Verificar rutas relativas
2. **State Not Updating**: Check event listeners
3. **Routing Issues**: Verify router configuration

## 📞 Soporte

Para preguntas técnicas o problemas con la implementación:
1. Revisar console del navegador
2. Verificar network tab para errores de carga
3. Comprobar estructura de archivos
4. Validar configuración de Vite

---

**Versión**: 1.0.0 MVP  
**Última actualización**: 30 de septiembre 2025  
**Maintainer**: Equipo Kalos