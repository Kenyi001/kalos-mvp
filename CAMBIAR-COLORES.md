# 🎨 Guía Rápida: Cambiar Colores y Estilos

## 📋 Índice
1. [Cambiar colores del Header](#header)
2. [Cambiar colores del botón Registrarse](#boton-registrarse)

---

# 🏠 HEADER

## 📍 Dónde cambiar los colores del Header

**Archivo:** `src/styles/main.css`  
**Líneas:** 125-138 (aproximadamente)

Busca esta sección en el archivo:

```css
.header-main {
    /* 👇 CAMBIAR ESTOS COLORES PARA MODIFICAR EL HEADER */
    --header-bg: #000000;              /* Fondo del header */
    --header-border: #e6c875;          /* Borde inferior */
    --header-text: #1B4B7A;            /* Texto principal */
    --header-text-hover: #B8860B;      /* Texto al hover */
}
```

## 🎨 Combinaciones de Colores para el Header

### 🌑 Negro con Dorado (Actual - Elegante)
```css
--header-bg: #000000;              /* Negro */
--header-border: #e6c875;          /* Dorado claro */
--header-text: #1B4B7A;            /* Azul */
--header-text-hover: #B8860B;      /* Dorado */
```

### ⚪ Blanco con Azul (Limpio y Profesional)
```css
--header-bg: #ffffff;              /* Blanco */
--header-border: #1B4B7A;          /* Azul */
--header-text: #1B4B7A;            /* Azul */
--header-text-hover: #B8860B;      /* Dorado */
```

### 🔵 Azul Egeo (Mediterráneo)
```css
--header-bg: #1B4B7A;              /* Azul egeo */
--header-border: #B8860B;          /* Dorado */
--header-text: #ffffff;            /* Blanco */
--header-text-hover: #e6c875;      /* Dorado claro */
```

### 🟡 Dorado (Lujoso)
```css
--header-bg: #B8860B;              /* Dorado */
--header-border: #1B4B7A;          /* Azul */
--header-text: #ffffff;            /* Blanco */
--header-text-hover: #1B4B7A;      /* Azul */
```

### ⚫ Gris Oscuro (Moderno)
```css
--header-bg: #1f2937;              /* Gris oscuro */
--header-border: #B8860B;          /* Dorado */
--header-text: #ffffff;            /* Blanco */
--header-text-hover: #e6c875;      /* Dorado claro */
```

---

# 🔘 BOTÓN REGISTRARSE

## 📍 Dónde cambiar los colores

**Archivo:** `src/styles/main.css`  
**Líneas:** 171-173 (aproximadamente)

Busca esta sección en el archivo:

```css
/* 🎨 BOTÓN REGISTRARSE - CAMBIAR COLORES AQUÍ */
.btn-register {
    /* 👇 CAMBIAR ESTOS DOS COLORES PARA MODIFICAR EL BOTÓN */
    --btn-color: #dc2626;         /* Color normal (rojo) */
    --btn-color-hover: #b91c1c;   /* Color al pasar el mouse (rojo oscuro) */
```

## ✏️ Cómo cambiar los colores

### Paso 1: Abre el archivo CSS
```
src/styles/main.css
```

### Paso 2: Busca `.btn-register`
Usa `Ctrl + F` y busca: `btn-register`

### Paso 3: Copia y pega el color que quieras

## 🎨 Colores Listos para Usar

### 🔴 Rojo (Actual)
```css
--btn-color: #dc2626;
--btn-color-hover: #b91c1c;
```

### 🔵 Azul Mediterráneo (Original de Kalos)
```css
--btn-color: #1B4B7A;
--btn-color-hover: #154066;
```

### 🟢 Verde Esmeralda
```css
--btn-color: #16a34a;
--btn-color-hover: #15803d;
```

### 🟣 Morado
```css
--btn-color: #9333ea;
--btn-color-hover: #7c3aed;
```

### 🟠 Naranja
```css
--btn-color: #ea580c;
--btn-color-hover: #c2410c;
```

### 🟡 Dorado (Olive Gold de Kalos)
```css
--btn-color: #B8860B;
--btn-color-hover: #A0750A;
```

### ⚫ Negro/Gris Oscuro
```css
--btn-color: #1f2937;
--btn-color-hover: #111827;
```

### 🌊 Cian/Turquesa
```css
--btn-color: #0891b2;
--btn-color-hover: #0e7490;
```

### 🌸 Rosa
```css
--btn-color: #db2777;
--btn-color-hover: #be185d;
```

### 🟤 Terracota (Color de Kalos)
```css
--btn-color: #d97f70;
--btn-color-hover: #c65a47;
```

## 📖 Ejemplo Completo

**Para cambiar a color verde:**

1. Abre `src/styles/main.css`
2. Busca `.btn-register`
3. Cambia las líneas:

```css
/* ANTES (rojo): */
--btn-color: #dc2626;
--btn-color-hover: #b91c1c;

/* DESPUÉS (verde): */
--btn-color: #16a34a;
--btn-color-hover: #15803d;
```

4. Guarda el archivo (`Ctrl + S`)
5. Recarga la página (`F5`)
6. ¡Listo! El botón ahora es verde 🟢

## 🎨 Crear tu Propio Color

Si quieres usar un color personalizado:

1. Busca el código hexadecimal del color (ejemplo: en Google "color picker")
2. Copia el código (ejemplo: `#ff6b9d`)
3. Pégalo en `--btn-color`
4. Para el hover, usa una versión más oscura (baja el brillo en el color picker)

**Ejemplo:**
```css
--btn-color: #ff6b9d;         /* Rosa personalizado */
--btn-color-hover: #e11d48;   /* Rosa más oscuro */
```

## 🔄 Volver al Color Original

**Para volver al degradado azul→dorado original:**

Ve a `src/components/layout/Header.js` línea 108 y cambia:

```javascript
/* ACTUAL: */
class="btn-register group relative text-white..."

/* CAMBIAR A: */
class="group relative bg-gradient-mediterranean text-white..."
```

O simplemente usa los colores azules en el CSS:

```css
--btn-color: #1B4B7A;
--btn-color-hover: #154066;
```

## 💡 Consejos

- **Colores oscuros → texto blanco** (class="text-white")
- **Colores claros → texto oscuro** (class="text-gray-900")
- El color hover debe ser **ligeramente más oscuro** que el normal
- Guarda y recarga la página para ver los cambios

---

**¿Dudas?** Los colores están en `src/styles/main.css` línea ~125 📝
