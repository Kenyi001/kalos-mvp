# 🌱 Cómo Ejecutar el Seeder de Profesionales

## 📍 Seeder de Profesionales de Santa Cruz

Este script crea 3 profesionales de prueba con perfiles completos, servicios y ubicaciones en Santa Cruz.

### 🚀 Ejecutar el Seeder

**Desde la raíz del proyecto:**
```bash
node backend/scripts/seed-santa-cruz-professionals.js
```

**O desde la carpeta backend:**
```bash
cd backend
node scripts/seed-santa-cruz-professionals.js
cd ..
```

### ✅ Resultado Esperado

Deberías ver algo como:
```
🌱 Iniciando seed de profesionales de Santa Cruz...

✅ Usuario creado: Carlos Mendoza (carlos.mendoza@kalos.com)
✅ Perfil profesional creado: Barbería El Maestro
✅ 5 servicios creados para Carlos Mendoza

✅ Usuario creado: Ana Pérez (ana.perez@kalos.com)
✅ Perfil profesional creado: Estilismo Ana Pérez
✅ 6 servicios creados para Ana Pérez

✅ Usuario creado: Laura Gutiérrez (laura.gutierrez@kalos.com)
✅ Perfil profesional creado: Nails by Laura
✅ 4 servicios creados para Laura Gutiérrez

🎉 Seed completado exitosamente!
📊 Total: 3 profesionales, 15 servicios

📋 Credenciales de acceso:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email: carlos.mendoza@kalos.com
Password: 123456
Rol: Profesional
Especialidad: Barbería
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email: ana.perez@kalos.com
Password: 123456
Rol: Profesional
Especialidad: Estilismo
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email: laura.gutierrez@kalos.com
Password: 123456
Rol: Profesional
Especialidad: Manicura
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 📦 Lo que crea el Seeder:

#### 👨‍🦱 Carlos Mendoza - Barbería El Maestro
- **Email:** carlos.mendoza@kalos.com
- **Password:** 123456
- **Especialidades:** Barbería, Corte de cabello, Afeitado
- **Experiencia:** 8 años
- **Ubicación:** Av. San Martin #456, Santa Cruz
- **Servicios:** 5 (Corte clásico, Corte moderno, Afeitado tradicional, etc.)

#### 💇‍♀️ Ana Pérez - Estilismo Ana Pérez
- **Email:** ana.perez@kalos.com
- **Password:** 123456
- **Especialidades:** Estilismo, Coloración, Tratamientos capilares
- **Experiencia:** 12 años
- **Ubicación:** Calle Junín #789, Santa Cruz
- **Servicios:** 6 (Corte y peinado, Coloración completa, Balayage, etc.)

#### 💅 Laura Gutiérrez - Nails by Laura
- **Email:** laura.gutierrez@kalos.com
- **Password:** 123456
- **Especialidades:** Manicura, Pedicura, Uñas de gel
- **Experiencia:** 5 años
- **Ubicación:** Calle Warnes #321, Santa Cruz
- **Servicios:** 4 (Manicura clásica, Uñas de gel, Pedicura spa, etc.)

### 🔄 Volver a Ejecutar

Si necesitas volver a crear los datos:

1. **El script verifica si ya existen:** Si detecta que los usuarios ya existen, no los duplicará.

2. **Para limpiar y volver a crear:**
   ```bash
   # Eliminar profesionales existentes (opcional)
   cd backend
   node scripts/clean-database.js  # Si tienes este script
   
   # O eliminar manualmente desde MongoDB
   mongosh
   use kalos-dev
   db.users.deleteMany({ email: { $in: ["carlos.mendoza@kalos.com", "ana.perez@kalos.com", "laura.gutierrez@kalos.com"] }})
   db.professionals.deleteMany({})
   db.services.deleteMany({})
   exit
   
   # Luego ejecutar el seeder nuevamente
   node scripts/seed-santa-cruz-professionals.js
   ```

### 🔍 Verificar que se crearon los datos

**Ver en la aplicación:**
1. Abre http://localhost:5173
2. Ve a "Profesionales"
3. Deberías ver los 3 profesionales
4. Haz clic en sus perfiles para ver los servicios

**Ver en MongoDB:**
```bash
mongosh
use kalos-dev
db.users.find({ role: "professional" }).pretty()
db.professionals.find().pretty()
db.services.find().pretty()
exit
```

### ⚠️ Requisitos

Antes de ejecutar el seeder:

- ✅ MongoDB debe estar corriendo
- ✅ Las dependencias deben estar instaladas (`npm install`)
- ✅ El archivo `backend/.env` debe existir con la configuración correcta

### 🆘 Errores Comunes

**Error: Cannot find module**
```bash
# Solución: Instalar dependencias
cd backend
npm install
cd ..
```

**Error: ECONNREFUSED (MongoDB no conecta)**
```bash
# Solución: Iniciar MongoDB
# Windows:
net start MongoDB

# Linux:
sudo systemctl start mongod

# Mac:
brew services start mongodb-community
```

**Error: User already exists**
- Los usuarios ya fueron creados previamente
- Puedes iniciar sesión con las credenciales proporcionadas
- O eliminarlos de la BD para volver a crearlos

### 📚 Otros Scripts Disponibles

- `create-test-users.js` - Crea usuarios de prueba básicos
- `seed-santa-cruz-professionals.js` - Crea profesionales completos (este)
- `list-users.js` - Lista todos los usuarios
- `list-services.js` - Lista todos los servicios
- `check-user.js` - Verifica un usuario específico

Ver todos los scripts en: `backend/scripts/README.md`

---

**Archivo:** `backend/scripts/seed-santa-cruz-professionals.js`
**Ubicación en GitHub:** https://github.com/Kenyi001/kalos-mvp/tree/main/backend/scripts
