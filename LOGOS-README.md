# 🎨 Kit de Marca Kalos

Logo y recursos visuales de **Kalos - Belleza Mediterránea en Santa Cruz**

## 📦 Archivos Incluidos

### Logos SVG (Vector - Escalables sin pérdida de calidad)

1. **`logo-kalos.svg`**
   - Logo principal completo
   - Tamaño: 400x400px
   - Uso: Material principal, web, impresión

2. **`logo-kalos-horizontal.svg`**
   - Logo en formato horizontal
   - Tamaño: 600x200px
   - Uso: Headers, banners, firmas de email

3. **`logo-kalos-icon.svg`**
   - Icono simplificado (solo K)
   - Tamaño: 200x200px
   - Uso: Favicon, app icon, redes sociales

4. **`logo-kalos-white-bg.svg`**
   - Logo con fondo blanco
   - Tamaño: 400x400px
   - Uso: Fondos oscuros, sobre imágenes

5. **`logo-kalos-presentacion.svg`**
   - Logo grande con eslogan
   - Tamaño: 800x600px
   - Uso: Presentaciones, posters, promocional

### Visualización

6. **`logos-kalos-kit.html`**
   - Página HTML para ver todos los logos
   - Incluye paleta de colores
   - Guía de uso

## 🎨 Paleta de Colores

| Color | Hex | RGB | Uso |
|-------|-----|-----|-----|
| **Azul Egeo** | `#1B4B7A` | rgb(27, 75, 122) | Color principal |
| **Azul Profundo** | `#154066` | rgb(21, 64, 102) | Color secundario |
| **Dorado Oliva** | `#B8860B` | rgb(184, 134, 11) | Acentos dorados |
| **Terracota** | `#D97F70` | rgb(217, 127, 112) | Acentos cálidos |
| **Mármol** | `#F8F9FA` | rgb(248, 249, 250) | Fondos claros |

## 📏 Especificaciones Técnicas

### Degradado Mediterráneo
```css
background: linear-gradient(135deg, #1B4B7A 0%, #154066 50%, #B8860B 100%);
```

### Tipografías
- **Principal:** Crimson Text (serif) - Títulos y logo
- **Secundaria:** Inter (sans-serif) - Texto general

### Sombras
```css
box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
```

## 📖 Guía de Uso

### ✅ Hacer
- Mantener proporciones originales del logo
- Usar sobre fondos claros (versión principal) o oscuros (versión blanco)
- Respetar espacio mínimo alrededor (10% del tamaño del logo)
- Usar los colores oficiales de la paleta

### ❌ No Hacer
- No distorsionar o estirar el logo
- No cambiar los colores del degradado
- No usar tamaños menores a 24px de altura
- No agregar efectos adicionales (sombras extra, brillos, etc.)
- No rotar el logo

## 🖼️ Tamaños Recomendados

### Web
- **Favicon:** 32x32px (usar logo-kalos-icon.svg)
- **Logo Header:** 48px altura (usar logo-kalos-horizontal.svg)
- **Banner:** 600x200px (usar logo-kalos-horizontal.svg)

### Redes Sociales
- **Foto de Perfil:** 400x400px (usar logo-kalos.svg)
- **Cover/Banner:** 1200x400px (adaptar logo-kalos-horizontal.svg)

### Impresión
- **Tarjetas de Presentación:** Mínimo 300 DPI
- **Posters:** Usar archivos SVG (escalan infinitamente)
- **Roll-ups/Banners:** 150-300 DPI

## 🔄 Conversión a Otros Formatos

### Convertir SVG a PNG (Windows)
```powershell
# Usando navegador:
1. Abrir logo-kalos.svg en Chrome/Edge
2. Clic derecho → Guardar como → PNG
```

### Convertir SVG a PNG (Online)
- https://www.svgtopng.com/
- https://cloudconvert.com/svg-to-png

### Convertir a otros formatos
- **JPG:** Para emails y web (con fondo)
- **PNG:** Para transparencias
- **PDF:** Para impresión profesional
- **ICO:** Para favicon (usando herramientas online)

## 📱 Uso en Desarrollo

### HTML
```html
<img src="logo-kalos.svg" alt="Kalos" width="200">
```

### CSS (como fondo)
```css
.logo {
  background-image: url('logo-kalos.svg');
  background-size: contain;
  background-repeat: no-repeat;
}
```

### React/Vue
```jsx
import logo from './logo-kalos.svg';

<img src={logo} alt="Kalos" />
```

## 📞 Contacto

Para dudas sobre el uso del logo o solicitar formatos adicionales:
- Email: contacto@kalos.com
- Web: https://github.com/Kenyi001/kalos-mvp

---

**Kalos** - Belleza Mediterránea en Santa Cruz 🌴✨
