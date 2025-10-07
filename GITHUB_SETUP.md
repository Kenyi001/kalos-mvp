# 🔄 Instrucciones para Subir a GitHub

## 1. Crear Repositorio en GitHub

1. Ve a [GitHub.com](https://github.com) e inicia sesión
2. Haz clic en el botón **"New"** (verde) o **"+"** > **"New repository"**
3. Configura el repositorio:
   - **Repository name**: `kalos-mvp`
   - **Description**: `Plataforma moderna para conectar clientes con profesionales de belleza`
   - **Visibility**: Public (o Private si prefieres)
   - ✅ **Add a README file**: NO (ya tenemos uno)
   - ✅ **Add .gitignore**: NO (ya tenemos uno)
   - ✅ **Choose a license**: NO (ya tenemos MIT)
4. Haz clic en **"Create repository"**

## 2. Conectar Repositorio Local con GitHub

Una vez creado el repositorio, GitHub te dará comandos similares a estos. Ejecuta en tu terminal:

### Si tu repositorio se llama `kalos-mvp` y tu usuario es `tu-usuario`:

```bash
cd "d:\Projects\KalosMVP"

# Agregar el repositorio remoto
git remote add origin https://github.com/TU_USUARIO/kalos-mvp.git

# Cambiar a branch main (si prefieres)
git branch -M main

# Subir el código
git push -u origin main
```

### O con SSH (si tienes configurado):

```bash
cd "d:\Projects\KalosMVP"

# Agregar el repositorio remoto con SSH
git remote add origin git@github.com:TU_USUARIO/kalos-mvp.git

# Cambiar a branch main (si prefieres)
git branch -M main

# Subir el código
git push -u origin main
```

## 3. Actualizar URLs en el Código

Después de crear el repositorio, actualiza estos archivos con la URL real:

### En `package.json`:
```json
"repository": {
  "type": "git",
  "url": "git+https://github.com/TU_USUARIO/kalos-mvp.git"
},
"bugs": {
  "url": "https://github.com/TU_USUARIO/kalos-mvp/issues"
},
"homepage": "https://github.com/TU_USUARIO/kalos-mvp#readme"
```

### En `README.md`:
Busca y reemplaza todas las instancias de:
- `TU_USUARIO/kalos-mvp` por `tu-usuario-real/kalos-mvp`
- `tu-email@ejemplo.com` por tu email real

## 4. Configurar GitHub Pages (Opcional)

Si quieres una demo en vivo:

1. Ve a tu repositorio en GitHub
2. Haz clic en **Settings**
3. Scroll hasta **Pages** (en el menú lateral)
4. En **Source**, selecciona **Deploy from a branch**
5. Selecciona **main** branch y **/ (root)**
6. Haz clic en **Save**

Tu app estará disponible en: `https://TU_USUARIO.github.io/kalos-mvp`

## 5. Comandos Útiles Posteriores

```bash
# Ver repositorios remotos configurados
git remote -v

# Subir cambios futuros
git add .
git commit -m "Descripción del cambio"
git push

# Crear una nueva rama para features
git checkout -b feature/nueva-funcionalidad
git push -u origin feature/nueva-funcionalidad

# Hacer pull request desde GitHub web interface
```

## 6. Configurar Issues y Discussions

1. Ve a tu repositorio en GitHub
2. En **Settings** > **Features**:
   - ✅ Enable Issues
   - ✅ Enable Discussions (opcional)
   - ✅ Enable Projects (para gestión de tareas)

## 7. Agregar Topics al Repositorio

En la página principal de tu repositorio:
1. Haz clic en ⚙️ junto a "About"
2. Agrega estos topics:
   ```
   beauty-services, booking-platform, spa, salon, appointments, 
   javascript, nodejs, express, mongodb, vite, tailwind-css, 
   leaflet-maps, jwt-auth, mvp, web-application
   ```

## 🎉 ¡Listo!

Una vez completados estos pasos:

1. ✅ Tu código estará en GitHub
2. ✅ Otros pueden clonarlo fácilmente
3. ✅ Tendrás un URL para compartir
4. ✅ Podrás gestionar issues y colaboración

### Comando de clonación para otros:
```bash
git clone https://github.com/TU_USUARIO/kalos-mvp.git
cd kalos-mvp
./install.sh  # o install.bat en Windows
```

¡Tu proyecto ahora es completamente portable y fácil de usar! 🚀