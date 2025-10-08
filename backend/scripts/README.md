# 📜 Scripts de Backend

Esta carpeta contiene scripts útiles para la gestión de datos y mantenimiento de la base de datos.

---

## 🌱 Seeders (Población de Datos)

### `seed-santa-cruz-professionals.js`

**Descripción:** Crea 3 profesionales de Santa Cruz con sus perfiles completos y servicios.

**Uso:**
```bash
cd backend
node scripts/seed-santa-cruz-professionals.js
```

**Datos creados:**

1. **María González - Estética María**
   - Email: maria.gonzalez@kalos.com
   - Password: kalos2024
   - Ubicación: Av. San Martín #234, Santa Cruz
   - Especialidades: Tratamientos Faciales, Depilación, Masajes
   - Servicios: 3 (Limpieza facial, Masaje corporal, Depilación)

2. **Carlos Pérez - Barbería Premium**
   - Email: carlos.perez@kalos.com
   - Password: kalos2024
   - Ubicación: Calle Libertad #567, Santa Cruz
   - Especialidades: Corte de Cabello, Afeitado, Arreglo de Barba
   - Servicios: 3 (Corte + Barba, Fade Cut, Afeitado clásico)

3. **Ana Rodríguez - Ana Nails & Beauty**
   - Email: ana.rodriguez@kalos.com
   - Password: kalos2024
   - Ubicación: Av. Cristo Redentor #890, Santa Cruz
   - Especialidades: Manicura, Pedicura, Uñas Esculpidas, Nail Art
   - Servicios: 4 (Manicura, Pedicura spa, Uñas gel, Nail art)

**Características:**
- ✅ Datos realistas de Santa Cruz de la Sierra
- ✅ Coordenadas GPS reales
- ✅ Horarios de atención configurados
- ✅ Precios en Bolivianos (Bs)
- ✅ Servicios con descripciones detalladas
- ✅ Imágenes de perfil
- ✅ Puede ejecutarse múltiples veces (actualiza en lugar de duplicar)

---

### `create-test-users.js`

**Descripción:** Crea usuarios básicos de prueba (sin perfiles profesionales completos).

**Uso:**
```bash
cd backend
node scripts/create-test-users.js
```

**Usuarios creados:**
- daxkenyi001@gmail.com (professional)
- daxkenyi003@gmail.com (professional)

**Nota:** Este script es más básico. Se recomienda usar `seed-santa-cruz-professionals.js` para datos de demostración completos.

---

## 🔍 Scripts de Consulta

### `list-users.js`

**Descripción:** Lista todos los usuarios en la base de datos.

**Uso:**
```bash
cd backend
node scripts/list-users.js
```

**Salida:**
- ID del usuario
- Nombre completo
- Email
- Rol (client/professional)
- Fecha de creación

---

### `list-services.js`

**Descripción:** Lista todos los servicios disponibles en la plataforma.

**Uso:**
```bash
cd backend
node scripts/list-services.js
```

**Salida:**
- Nombre del servicio
- Categoría
- Precio
- Duración
- Profesional asociado

---

### `check-user.js`

**Descripción:** Verifica si un usuario existe y muestra su información detallada.

**Uso:**
```bash
cd backend
node scripts/check-user.js [email]
```

**Ejemplo:**
```bash
node scripts/check-user.js maria.gonzalez@kalos.com
```

---

## 🔧 Scripts de Mantenimiento

### `fix-users.js`

**Descripción:** Corrige problemas comunes en usuarios existentes.

**Funciones:**
- Actualiza campos faltantes
- Normaliza datos
- Corrige inconsistencias

**Uso:**
```bash
cd backend
node scripts/fix-users.js
```

---

### `fix-professional-id.js`

**Descripción:** Corrige relaciones entre usuarios y perfiles profesionales.

**Uso:**
```bash
cd backend
node scripts/fix-professional-id.js
```

---

### `reset-passwords.js`

**Descripción:** Resetea contraseñas de usuarios específicos (útil para desarrollo).

**Uso:**
```bash
cd backend
node scripts/reset-passwords.js
```

⚠️ **Advertencia:** Solo usar en ambiente de desarrollo.

---

### `test-login.js`

**Descripción:** Prueba el proceso de login de un usuario.

**Uso:**
```bash
cd backend
node scripts/test-login.js [email] [password]
```

**Ejemplo:**
```bash
node scripts/test-login.js maria.gonzalez@kalos.com kalos2024
```

---

## 📋 Orden de Ejecución Recomendado

Para una instalación limpia desde cero:

```bash
# 1. Asegúrate de que MongoDB esté corriendo
mongosh

# 2. Ve a la carpeta backend
cd backend

# 3. Crea los profesionales con servicios
node scripts/seed-santa-cruz-professionals.js

# 4. (Opcional) Verifica que se crearon correctamente
node scripts/list-users.js
node scripts/list-services.js

# 5. Prueba el login
node scripts/test-login.js maria.gonzalez@kalos.com kalos2024
```

---

## 🔄 Actualización de Datos

Si necesitas actualizar los datos de los profesionales:

1. Edita el archivo `seed-santa-cruz-professionals.js`
2. Modifica los datos en el array `professionalsData`
3. Ejecuta el script nuevamente:
   ```bash
   node scripts/seed-santa-cruz-professionals.js
   ```

El script detectará los usuarios existentes y actualizará la información sin crear duplicados.

---

## 🗑️ Limpiar Base de Datos

Para eliminar todos los datos de prueba:

```bash
# Conectarse a MongoDB
mongosh

# Cambiar a la base de datos
use kalos-dev

# Eliminar colecciones
db.users.deleteMany({})
db.professionals.deleteMany({})
db.services.deleteMany({})
db.bookings.deleteMany({})

# Salir
exit
```

Luego vuelve a ejecutar el seeder para repoblar.

---

## 🆘 Problemas Comunes

### Error: "MongoServerError: E11000 duplicate key error"

**Causa:** Intentando crear un usuario con un email que ya existe.

**Solución:** 
- El seeder maneja esto automáticamente actualizando el usuario existente
- Si persiste, elimina los datos manualmente (ver sección anterior)

### Error: "Cannot find module"

**Causa:** Dependencias no instaladas.

**Solución:**
```bash
cd backend
npm install
```

### Error: "MongooseServerSelectionError"

**Causa:** MongoDB no está corriendo.

**Solución:**
```bash
# Windows
net start MongoDB

# Linux
sudo systemctl start mongod

# Mac
brew services start mongodb-community
```

---

## 📝 Crear un Script Nuevo

Para crear un nuevo script:

1. Crea un archivo en `backend/scripts/`
2. Importa los modelos necesarios:
   ```javascript
   import mongoose from 'mongoose';
   import User from '../models/User.js';
   import dotenv from 'dotenv';
   dotenv.config();
   ```

3. Conecta a la base de datos:
   ```javascript
   const connectDB = async () => {
       const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kalos-dev';
       await mongoose.connect(mongoUri);
   };
   ```

4. Implementa tu lógica

5. Cierra la conexión al final:
   ```javascript
   await mongoose.connection.close();
   process.exit(0);
   ```

---

¿Necesitas agregar más scripts? Abre un issue o crea un pull request en GitHub! 🚀
