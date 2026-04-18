# Trans-Ruta Backend

Sistema de gestión logística y transporte de carga — Backend API REST.

## Stack Tecnológico

- **Runtime:** Node.js
- **Framework:** Express.js
- **Base de datos:** PostgreSQL
- **ORM:** Sequelize
- **Autenticación:** JWT
- **Validaciones:** express-validator

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales reales de PostgreSQL

# 3. Crear la base de datos en PostgreSQL
# CREATE DATABASE trans_ruta_db;

# 4. Ejecutar migraciones
npm run db:migrate

# 5. Ejecutar seeders (crea admin + datos de ejemplo)
npm run db:seed

# 6. Iniciar servidor en desarrollo
npm run dev
```

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm start` | Iniciar en producción |
| `npm run dev` | Iniciar con nodemon (desarrollo) |
| `npm run db:migrate` | Ejecutar migraciones |
| `npm run db:migrate:undo` | Revertir migraciones |
| `npm run db:seed` | Ejecutar seeders |
| `npm run db:reset` | Reset completo (undo + migrate + seed) |

## Credenciales por Defecto

- **Correo:** admin@transruta.com
- **Contraseña:** Admin1234!
- **Rol:** ADMINISTRADOR

## Autenticación

```bash
# Login
POST http://localhost:3000/api/v1/auth/login
Body: { "correo": "admin@transruta.com", "contrasena": "Admin1234!" }

# Usar el token JWT en los demás endpoints:
Authorization: Bearer <token>
```

## Endpoints Principales

| Recurso | Ruta Base |
|---------|-----------|
| Auth | `/api/v1/auth` |
| Usuarios | `/api/v1/usuarios` |
| Vehículos | `/api/v1/vehiculos` |
| Conductores | `/api/v1/conductores` |
| Clientes | `/api/v1/clientes` |
| Viáticos | `/api/v1/viaticos` |
| Órdenes de Despacho | `/api/v1/ordenes-despacho` |
| Entregas | `/api/v1/entregas` |
| Incidentes | `/api/v1/incidentes` |
| Planes Mantenimiento | `/api/v1/planes-mantenimiento` |
| Órdenes de Trabajo | `/api/v1/ordenes-trabajo` |
| Repuestos | `/api/v1/repuestos` |
| Solicitudes Compra | `/api/v1/solicitudes-compra` |
| Notificaciones | `/api/v1/notificaciones` |
| Reportes | `/api/v1/reportes` |
| Manifiestos | `/api/v1/manifiestos` |

## Roles del Sistema

- `ADMINISTRADOR` — Acceso total
- `DESPACHADOR` — Órdenes de despacho, flota, notificaciones
- `CONDUCTOR` — Órdenes asignadas, entregas, incidentes
- `CLIENTE` — Estado de envíos y notificaciones propias
- `JEFE_TALLER` — Mantenimiento, órdenes de trabajo
- `GESTOR_INVENTARIO` — Repuestos y solicitudes de compra
- `AUDITOR` — Solo lectura
