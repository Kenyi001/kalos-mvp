# 🏠 Guía Completa: Personalizar el Header de Kalos

## 📍 Ubicación del Código

**Archivo CSS:** `src/styles/main.css` (línea ~125)  
**Archivo JavaScript:** `src/components/layout/Header.js`

---

## 🎨 Cambiar Colores del Header (Forma Fácil)

### Paso 1: Abre el archivo CSS
```
src/styles/main.css
```

### Paso 2: Busca `.header-main`
Presiona `Ctrl + F` y busca: `header-main`

### Paso 3: Cambia las variables

```css
.header-main {
    /* 👇 CAMBIAR AQUÍ */
    --header-bg: #000000;              /* Fondo */
    --header-border: #e6c875;          /* Borde */
    --header-text: #1B4B7A;            /* Texto */
    --header-text-hover: #B8860B;      /* Hover */
}
```

---

## 🎨 Combinaciones Pre-diseñadas

### 1️⃣ Elegancia Nocturna (Actual) 🌑
```css
--header-bg: #000000;              /* Negro profundo */
--header-border: #e6c875;          /* Dorado elegante */
--header-text: #1B4B7A;            /* Azul egeo */
--header-text-hover: #B8860B;      /* Dorado intenso */
```
**Cuándo usar:** Para un look sofisticado y premium

---

### 2️⃣ Limpieza Profesional ⚪
```css
--header-bg: #ffffff;              /* Blanco puro */
--header-border: #1B4B7A;          /* Azul egeo */
--header-text: #1B4B7A;            /* Azul egeo */
--header-text-hover: #B8860B;      /* Dorado */
```
**Cuándo usar:** Para un diseño limpio y minimalista

---

### 3️⃣ Mar Mediterráneo 🔵
```css
--header-bg: #1B4B7A;              /* Azul egeo */
--header-border: #B8860B;          /* Dorado */
--header-text: #ffffff;            /* Blanco */
--header-text-hover: #e6c875;      /* Dorado claro */
```
**Cuándo usar:** Para reforzar la identidad mediterránea

---

### 4️⃣ Lujo Dorado 🟡
```css
--header-bg: #B8860B;              /* Dorado intenso */
--header-border: #1B4B7A;          /* Azul egeo */
--header-text: #ffffff;            /* Blanco */
--header-text-hover: #1B4B7A;      /* Azul egeo */
```
**Cuándo usar:** Para destacar lujo y exclusividad

---

### 5️⃣ Modernismo Urbano ⚫
```css
--header-bg: #1f2937;              /* Gris oscuro */
--header-border: #B8860B;          /* Dorado */
--header-text: #ffffff;            /* Blanco */
--header-text-hover: #e6c875;      /* Dorado claro */
```
**Cuándo usar:** Para un look moderno y tech

---

### 6️⃣ Terracota Cálido 🟠
```css
--header-bg: #d97f70;              /* Terracota */
--header-border: #1B4B7A;          /* Azul egeo */
--header-text: #ffffff;            /* Blanco */
--header-text-hover: #1B4B7A;      /* Azul egeo */
```
**Cuándo usar:** Para un ambiente cálido y acogedor

---

### 7️⃣ Mármol Suave 🤍
```css
--header-bg: #fafbfc;              /* Mármol claro */
--header-border: #B8860B;          /* Dorado */
--header-text: #1B4B7A;            /* Azul egeo */
--header-text-hover: #B8860B;      /* Dorado */
```
**Cuándo usar:** Para elegancia sutil

---

## 🔧 Personalización Avanzada

### Variables Disponibles

```css
.header-main {
    /* Colores principales */
    --header-bg: #000000;              /* Fondo del header */
    --header-border: #e6c875;          /* Color del borde inferior */
    --header-text: #1B4B7A;            /* Color del texto */
    --header-text-hover: #B8860B;      /* Color texto al hover */
    --header-logo-bg: linear-gradient(...); /* Gradiente del logo */
}
```

### ¿Qué afecta cada variable?

| Variable | Afecta a |
|----------|----------|
| `--header-bg` | Fondo completo del header |
| `--header-border` | Línea inferior del header |
| `--header-text` | Texto de "Kalos", navegación, menú |
| `--header-text-hover` | Texto al pasar el mouse |
| `--header-logo-bg` | Fondo del círculo con "K" |

---

## 💡 Tips de Diseño

### ✅ Buenas Prácticas

1. **Contraste:** Si el fondo es oscuro, usa texto claro (y viceversa)
2. **Coherencia:** Usa colores de tu paleta mediterránea
3. **Legibilidad:** El texto debe ser fácil de leer
4. **Hover sutil:** El color hover debe ser ligeramente diferente

### ❌ Evitar

1. ❌ Texto amarillo sobre fondo blanco (poco contraste)
2. ❌ Muchos colores diferentes (máximo 3-4)
3. ❌ Colores que choquen (ej: rojo y naranja juntos)
4. ❌ Fondo y texto del mismo color

---

## 🧪 Probar Combinaciones

### Método 1: Cambiar en CSS
1. Abre `src/styles/main.css`
2. Cambia los valores
3. Guarda (`Ctrl + S`)
4. Recarga la página (`F5`)

### Método 2: Usar DevTools (Rápido)
1. Abre la página (`F12`)
2. Ve a "Elements" → Busca `<header class="header-main">`
3. En "Styles" edita las variables CSS
4. Cuando te guste, copia los valores a tu archivo CSS

---

## 🎨 Crear tu Propia Combinación

### Paso a Paso:

1. **Elige un color principal** (fondo del header)
   - Herramienta: https://coolors.co/
   
2. **Busca un color complementario** (para el borde)
   - Usa la rueda de colores
   
3. **Define el texto** (contraste con el fondo)
   - Fondo oscuro → Texto claro
   - Fondo claro → Texto oscuro
   
4. **Elige el color hover** (ligeramente diferente)
   - Más brillante o saturado que el texto normal

### Ejemplo práctico:

```css
/* Mi combinación personalizada */
--header-bg: #2c3e50;              /* Azul marino (fondo) */
--header-border: #e74c3c;          /* Rojo coral (borde) */
--header-text: #ecf0f1;            /* Blanco humo (texto) */
--header-text-hover: #e74c3c;      /* Rojo coral (hover) */
```

---

## 🔄 Volver al Original

Para restaurar los colores originales:

```css
.header-main {
    --header-bg: #000000;
    --header-border: #e6c875;
    --header-text: #1B4B7A;
    --header-text-hover: #B8860B;
}
```

---

## 📱 Consideraciones Móviles

El header es **responsive**, los colores se aplican automáticamente en móviles.

No necesitas cambiar nada adicional para tablets o celulares.

---

## 🆘 Solución de Problemas

### Problema: "Los colores no cambian"

**Solución:**
1. Verifica que guardaste el archivo (`Ctrl + S`)
2. Recarga sin caché (`Ctrl + Shift + R`)
3. Revisa que estás editando `src/styles/main.css` (no otro archivo)

### Problema: "El texto no se lee bien"

**Solución:**
- Aumenta el contraste entre `--header-bg` y `--header-text`
- Usa herramientas como: https://webaim.org/resources/contrastchecker/

### Problema: "Quiero más cambios"

**Solución:**
- Revisa `src/components/layout/Header.js` para cambios estructurales
- Consulta `DOCS.md` para más información

---

## 📚 Recursos Adicionales

- **Paleta de colores:** https://coolors.co/
- **Contraste de colores:** https://webaim.org/resources/contrastchecker/
- **Inspiración:** https://dribbble.com/search/header
- **Generador de gradientes:** https://cssgradient.io/

---

**¿Necesitas ayuda?** Revisa `README.md` o contacta al equipo de desarrollo 🚀
