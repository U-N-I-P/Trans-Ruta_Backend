# 📖 Trans-Ruta: Documentación Oficial de la API (Para Frontend)

¡Bienvenidos al equipo de Frontend! Este documento es su guía definitiva para conectar las interfaces de usuario con el servidor backend. Aquí encontrarán todo lo necesario para interactuar con la API RESTful de Trans-Ruta.

---

## 📑 Tabla de Contenido
1. [Configuración Inicial](#-configuración-inicial)
2. [Autenticación](#-autenticación)
3. [Estructura de Respuestas](#-estructura-de-respuestas)
4. [Manejo de Errores](#-manejo-de-errores)
5. [Épica 1: Flota y Mantenimiento](#-épica-1-flota-y-mantenimiento-hu-01-hu-02)
6. [Épica 2: Planificación y Despacho](#-épica-2-planificación-y-despacho-hu-03-hu-05)
7. [Épica 3: Operación en Ruta](#-épica-3-operación-en-ruta-hu-06-hu-09)
8. [Épica 4: Gestión de Conductores y Viáticos](#-épica-4-gestión-de-conductores-y-viáticos-hu-10-hu-11-hu-17)
9. [Épica 5: Inventario y Aprobaciones](#-épica-5-inventario-y-aprobaciones-hu-12-hu-19)
10. [Documentos Vehiculares](#-documentos-vehiculares-hu-15)
11. [Consumo de Combustible](#-consumo-de-combustible-hu-16)
12. [Auditoría](#-auditoría-hu-18)
13. [Sugerencias de Asignación](#-sugerencias-de-asignación-hu-20)
14. [Evaluación de Conductores](#-evaluación-de-conductores-hu-21)
15. [Roles y Permisos](#-roles-y-permisos)
16. [Tips para el Frontend](#-tips-para-el-frontend)
17. [Stack Tecnológico Frontend](#-stack-tecnológico-frontend)

---

## 🚀 Configuración Inicial

- **URL Base de Desarrollo:** `http://localhost:3000/api/v1`
- **URL Base de Producción:** `https://api.trans-ruta.com/api/v1` *(Actualizar cuando esté disponible)*
- **Cabeceras Globales Recomendadas:**
  ```json
  {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
  ```

### 🔐 Autenticación (JWT)

Todas las rutas (excepto `/auth/login` y `/auth/register`) están protegidas. Deben enviar el token en la cabecera:

```http
Authorization: Bearer <TU_TOKEN_JWT_AQUI>
```

**Ejemplo con Axios:**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

## 🔑 Autenticación

### Login (`/auth/login`)
* **Iniciar Sesión:** `POST /auth/login`
  ```json
  {
    "correo": "admin@trans-ruta.com",
    "contrasena": "Admin1234!"
  }
  ```
  **Respuesta:**
  ```json
  {
    "success": true,
    "message": "Login exitoso",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "usuario": {
        "id": 1,
        "nombre": "Juan Pérez",
        "correo": "admin@trans-ruta.com",
        "rol": "ADMINISTRADOR"
      }
    }
  }
  ```

### Otros Endpoints de Autenticación

* **Cerrar Sesión:** `POST /auth/logout`
  *Cierra la sesión del usuario actual y registra el evento en auditoría.*

* **Obtener Usuario Autenticado:** `GET /auth/me`
  *Devuelve la información del usuario actualmente autenticado.*

* **Refrescar Token:** `POST /auth/refresh`
  *Genera un nuevo token JWT para el usuario autenticado.*

### Gestión de Usuarios (`/usuarios`)

**⚠️ Nota:** El sistema NO tiene registro público. Los usuarios son creados únicamente por el ADMINISTRADOR a través del módulo de gestión de usuarios.

* **Crear Usuario:** `POST /usuarios` (Solo ADMINISTRADOR)
  ```json
  {
    "nombre": "María García",
    "correo": "maria@trans-ruta.com",
    "contrasena": "Secure123!",
    "rol": "DESPACHADOR"
  }
  ```

* **Listar Usuarios:** `GET /usuarios` (Solo ADMINISTRADOR)
* **Actualizar Usuario:** `PUT /usuarios/:id` (Solo ADMINISTRADOR)
* **Eliminar Usuario:** `DELETE /usuarios/:id` (Solo ADMINISTRADOR)

**Roles Disponibles:**
- `ADMINISTRADOR`: Acceso total al sistema
- `DESPACHADOR`: Gestión de órdenes y asignaciones
- `CONDUCTOR`: Consulta de viajes y registro de gastos
- `JEFE_TALLER`: Gestión de mantenimiento y órdenes de trabajo
- `GESTOR_INVENTARIO`: Gestión de repuestos y solicitudes de compra
- `AUDITOR`: Consulta de auditoría (solo lectura)

---

## 📦 Estructura de Respuestas

Para hacerles la vida más fácil, **todas las respuestas del servidor** respetan un formato único. Así siempre saben qué buscar.

### ✅ Petición Exitosa (Status 200 o 201)
```json
{
  "success": true,
  "message": "Operación realizada con éxito",
  "data": { 
     "id": 1, 
     "atributo": "valor" 
  },
  "pagination": { // Opcional: Solo viene en los GET que devuelven listas
    "totalItems": 50,
    "totalPages": 5,
    "currentPage": 1
  }
}
```

---

## ❌ Manejo de Errores

Si algo falla, el servidor les responderá con un código HTTP `400`, `401`, `403` o `404` y este cuerpo estándar:

```json
{
  "success": false,
  "message": "El vehículo tiene documentos vencidos. No se puede asignar.",
  "errors": [] // Opcional: Lista de validaciones fallidas si el formulario envió datos erróneos
}
```
**Regla de Oro:** Siempre usen un bloque `try/catch` o un interceptor en Axios para atrapar `response.data.message` y mostrarlo en un Modal o un Toast (alerta) al usuario.

---

## 🚛 Épica 1: Flota y Mantenimiento (HU-01, HU-02)

### Vehículos (`/vehiculos`)
* **Listar todos:** `GET /vehiculos`
* **Crear Vehículo:** `POST /vehiculos`
  ```json
  {
    "placa": "TRK-900",
    "tipo": "CAMION_CARGA_PESADA", // Opciones: CAMION_CARGA_PESADA, TURBO, CAMIONETA
    "capacidadCarga": 15000,
    "estado": "DISPONIBLE"
  }
  ```
* **Actualizar:** `PUT /vehiculos/:id`
* **Eliminar:** `DELETE /vehiculos/:id`

### Mantenimiento (`/planes-mantenimiento`)
* **Registrar Plan:** `POST /planes-mantenimiento`
  ```json
  {
    "vehiculoId": 1,
    "tipoMantenimiento": "PREVENTIVO",
    "kilometrajeProgramado": 50000,
    "fechaProgramada": "2026-06-01"
  }
  ```

---

## 📋 Épica 2: Planificación y Despacho (HU-03 a HU-05)

### Órdenes de Despacho (`/ordenes-despacho`)
* **Crear Viaje:** `POST /ordenes-despacho`
  *⚠️ Importante: Si mandan un `vehiculoId` con documentos vencidos o la carga supera el límite, devolveremos Status `400`.*
  ```json
  {
    "origen": "Bogotá",
    "destino": "Medellín",
    "pesoCarga": 12000,
    "descripcionCarga": "Materiales frágiles",
    "vehiculoId": 2,
    "conductorId": 5,
    "clienteId": 8
  }
  ```
* **Cambiar Estado del Viaje:** `PATCH /ordenes-despacho/:id/estado`
  ```json
  {
    "estado": "EN_RUTA" // Opciones: DESPACHADO, EN_RUTA, CERCA_DEL_DESTINO, ENTREGADO, CANCELADO
  }
  ```

---

## 🛣️ Épica 3: Operación en Ruta (HU-06 a HU-09)

### Entregas (`/entregas`)
* **Finalizar Viaje con Firma:** `POST /entregas/:ordenId/registrar`
  *Solo CONDUCTOR. El `ordenId` va en la URL, no en el body.*
  ```json
  {
    "fechaEntrega": "2026-05-12",
    "firmaDigital": "data:image/png;base64,ivBORw0KGgoAAAANSU...",
    "observaciones": "Entrega sin novedad"
  }
  ```

### Incidentes (`/incidentes`)
* **Reportar Choque/Falla:** `POST /incidentes`
  ```json
  {
    "ordenDeDespachoId": 3,
    "tipo": "FALLA_MECANICA",
    "descripcion": "Se pinchó una llanta",
    "nivelGravedad": "ALTO"
  }
  ```

---

## 💳 Épica 4: Gestión de Conductores y Viáticos (HU-10, HU-11, HU-17)

### Asignación de Presupuesto Inicial (`/viaticos`)
* **Asignar viático a un viaje:** `POST /viaticos`
  ```json
  {
    "conductorId": 5,
    "ordenDeDespachoId": 3,
    "monto": 500000, // Este será automáticamente el "saldo" inicial
    "fecha": "2026-05-13",
    "estado": "APROBADO"
  }
  ```

### Gastos Individuales (`/gastos-viaticos`)
* **Conductor registra peaje/comida:** `POST /gastos-viaticos`
  ```json
  {
    "viaticoId": 1,
    "monto": 25000,
    "categoria": "PEAJES", // Opciones: COMBUSTIBLE, PEAJES, ALIMENTACION, HOSPEDAJE, OTROS
    "descripcion": "Peaje Bogotá",
    "evidenciaFotografica": "https://url-del-ticket.jpg"
  }
  ```
* **Admin Aprueba el Gasto:** `PATCH /gastos-viaticos/:id/aprobar`
  *Al hacer esto, el backend automáticamente restará el `monto` del `saldo` total.*
  ```json
  { "comentariosAdmin": "Todo en orden." }
  ```

---

## 🛠️ Épica 5: Inventario y Aprobaciones (HU-12, HU-19)

### Solicitudes de Compra (`/solicitudes-compra`)

#### Flujo de Aprobación Automática
El sistema aprueba automáticamente solicitudes con monto ≤ $500,000 COP. Las solicitudes con monto mayor requieren aprobación manual del ADMINISTRADOR.

* **Crear Solicitud de Repuestos:** `POST /solicitudes-compra/:repuestoId`
  ```json
  {
    "cantidad": 5,
    "costoEstimado": 450000,
    "descripcion": "Filtros de aceite para mantenimiento preventivo"
  }
  ```
  **Respuesta (Aprobación Automática):**
  ```json
  {
    "success": true,
    "message": "Solicitud de compra creada",
    "data": {
      "id": 15,
      "estado": "APROBADA", // ✅ Aprobada automáticamente
      "montoTotal": 2250000,
      "comentariosAprobacion": "Aprobación automática: el monto total no supera el umbral de aprobación administrativa."
    }
  }
  ```

* **Listar Solicitudes Pendientes:** `GET /solicitudes-compra/pendientes`
  *Solo para ADMINISTRADOR. Devuelve solicitudes que requieren aprobación manual.*

* **Aprobar Solicitud:** `PATCH /solicitudes-compra/:id/aprobar`
  ```json
  {
    "comentarios": "Aprobado por necesidad urgente"
  }
  ```

* **Rechazar Solicitud:** `PATCH /solicitudes-compra/:id/rechazar`
  ```json
  {
    "comentarios": "Presupuesto insuficiente este mes"
  }
  ```

* **Registrar Recepción de Repuestos:** `PATCH /solicitudes-compra/:id/recibir`
  *⚠️ Importante: Al registrar la recepción, el inventario se actualiza automáticamente.*
  ```json
  // Sin body, solo el endpoint
  ```
  **Respuesta:**
  ```json
  {
    "success": true,
    "message": "Recepción registrada, inventario actualizado",
    "data": {
      "id": 15,
      "estado": "RECIBIDA",
      "fechaRecepcion": "2026-05-13T10:30:00Z",
      "repuesto": {
        "id": 2,
        "nombre": "Filtro de aceite",
        "stockActual": 45 // ✅ Actualizado automáticamente
      }
    }
  }
  ```

### Estados de Solicitud
- `PENDIENTE`: Requiere aprobación manual
- `APROBADA`: Aprobada (automática o manualmente)
- `RECHAZADA`: Rechazada por el administrador
- `RECIBIDA`: Repuestos recibidos e inventario actualizado

---

## 🚨 Documentos Vehiculares (HU-15)

### Gestión de Documentos (`/documentos-vehiculares`)

* **Alertas para Dashboard:** `GET /documentos-vehiculares/alertas`
  *Devuelve un array ideal para mostrar tarjetas de color en el inicio del sistema:*
  ```json
  {
    "success": true,
    "message": "Alertas de vencimiento obtenidas",
    "data": [
      {
        "id": 5,
        "vehiculoId": 2,
        "placa": "TRK-900",
        "tipo": "SOAT",
        "fechaVencimiento": "2026-05-20",
        "diasFaltantes": 8,
        "nivelAlerta": "ALERTA" // INFO, ALERTA o CRITICO
      },
      {
        "id": 8,
        "vehiculoId": 3,
        "placa": "TRK-901",
        "tipo": "TECNOMECANICA",
        "fechaVencimiento": "2026-05-15",
        "diasFaltantes": 3,
        "nivelAlerta": "CRITICO"
      }
    ]
  }
  ```

  **Niveles de Alerta:**
  - `CRITICO`: ≤ 7 días (Mostrar en rojo)
  - `ALERTA`: ≤ 15 días (Mostrar en amarillo)
  - `INFO`: ≤ 30 días (Mostrar en azul)

* **Listar Documentos de un Vehículo:** `GET /documentos-vehiculares?vehiculoId=2`

* **Subir Nuevo Documento:** `POST /documentos-vehiculares`
  ```json
  {
    "tipo": "SOAT", // Opciones: SOAT, TECNOMECANICA, REVISION_GASES, POLIZA, TARJETA_OPERACION
    "numero": "888999",
    "fechaExpedicion": "2025-05-10",
    "fechaVencimiento": "2026-05-10",
    "vehiculoId": 2,
    "archivoAdjunto": "https://storage.trans-ruta.com/docs/soat-888999.pdf"
  }
  ```

* **Actualizar Documento:** `PUT /documentos-vehiculares/:id`
* **Eliminar Documento:** `DELETE /documentos-vehiculares/:id`

---

## ⛽ Consumo de Combustible (HU-16)

### Registro de Consumo (`/consumos-combustible`)

* **Registrar carga de gasolina:** `POST /consumos-combustible`
  *⚠️ No es necesario que calculen el rendimiento (Km/L) ni la distancia. El backend lo hace automáticamente.*
  ```json
  {
    "kilometrajeInicial": 120000,
    "kilometrajeFinal": 120500,
    "litrosCargados": 85.0,
    "costoTotal": 320000,
    "ordenDeDespachoId": 5,
    "evidenciaFotografica": "https://storage.trans-ruta.com/evidencias/ticket-123.jpg"
  }
  ```

  **Respuesta con Alerta:**
  ```json
  {
    "success": true,
    "message": "Registro de consumo creado (ALERTA: Rendimiento 20% por debajo del promedio)",
    "data": {
      "id": 42,
      "rendimiento": 5.88, // Km/L calculado automáticamente
      "distanciaRecorrida": 500, // Calculado automáticamente
      "vehiculoId": 2,
      "ordenDeDespachoId": 5
    }
  }
  ```

  **Sistema de Alertas:**
  - Si el rendimiento es 20% menor al promedio histórico del vehículo, el backend devuelve un mensaje de alerta.
  - Mostrar esta alerta al usuario para que revise el vehículo.

* **Consultar Historial por Vehículo:** `GET /consumos-combustible/vehiculo/:vehiculoId`
  *Útil para gráficas de rendimiento en el tiempo.*

* **Listar Todos los Consumos:** `GET /consumos-combustible?page=1&limit=20`

---

## 📊 Auditoría (HU-18)

### Consulta de Logs (`/auditoria`)

**⚠️ Solo accesible para roles: ADMINISTRADOR y AUDITOR**

* **Listar Logs de Auditoría:** `GET /auditoria?page=1&limit=20`
  
  **Filtros disponibles (query params):**
  - `usuarioId`: Filtrar por usuario específico
  - `accion`: Filtrar por tipo de acción (CREATE, UPDATE, DELETE, APPROVE, REJECT, ASSIGN, LOGIN, LOGOUT)
  - `entidad`: Filtrar por entidad (ej: "SolicitudDeCompra", "OrdenDeDespacho")
  - `fechaInicio`: Fecha inicio (formato: YYYY-MM-DD)
  - `fechaFin`: Fecha fin (formato: YYYY-MM-DD)

  **Ejemplo:**
  ```
  GET /auditoria?accion=APPROVE&entidad=SolicitudDeCompra&fechaInicio=2026-05-01&fechaFin=2026-05-31
  ```

  **Respuesta:**
  ```json
  {
    "success": true,
    "message": "Registros de auditoría obtenidos",
    "data": [
      {
        "id": 150,
        "usuario": {
          "id": 1,
          "nombre": "Juan Pérez",
          "correo": "admin@trans-ruta.com",
          "rol": "ADMINISTRADOR"
        },
        "accion": "APPROVE",
        "entidad": "SolicitudDeCompra",
        "entidadId": 15,
        "ipAddress": "192.168.1.100",
        "datosAnteriores": null,
        "datosNuevos": {
          "estado": "APROBADA",
          "estadoAnterior": "PENDIENTE"
        },
        "createdAt": "2026-05-13T10:30:00Z"
      }
    ],
    "pagination": {
      "totalItems": 1250,
      "totalPages": 63,
      "currentPage": 1
    }
  }
  ```

* **Ver Detalle de un Log:** `GET /auditoria/:id`

* **Exportar Auditoría:** `GET /auditoria/exportar?formato=csv&fechaInicio=2026-05-01&fechaFin=2026-05-31`
  
  **Formatos disponibles:**
  - `csv`: Exporta hasta 2000 registros
  - `pdf`: Exporta hasta 400 registros
  
  **Respuesta:** Archivo descargable (Content-Type: text/csv o application/pdf)

### Acciones Auditadas Automáticamente
El sistema registra automáticamente:
- ✅ Creación, actualización y eliminación de solicitudes de compra
- ✅ Aprobación y rechazo de solicitudes
- ✅ Creación y cambios de estado de órdenes de despacho
- ✅ Creación, actualización y eliminación de usuarios
- ✅ Login y logout de usuarios

---

## 🎯 Sugerencias de Asignación (HU-20)

### Sistema Inteligente de Asignación (`/sugerencias`)

**⚠️ Solo accesible para roles: ADMINISTRADOR y DESPACHADOR**

* **Obtener Sugerencias:** `GET /sugerencias?pesoCarga=12000&origen=Bogotá&destino=Medellín&limite=5`

  **Parámetros requeridos:**
  - `pesoCarga`: Peso de la carga en kg (número positivo)
  - `origen`: Ciudad de origen (3-200 caracteres)
  - `destino`: Ciudad de destino (3-200 caracteres)
  - `limite`: Número de sugerencias (opcional, 1-20, default: 5)

  **Respuesta:**
  ```json
  {
    "success": true,
    "message": "Sugerencias obtenidas exitosamente",
    "data": [
      {
        "vehiculo": {
          "id": 2,
          "placa": "TRK-900",
          "tipo": "CAMION_CARGA_PESADA",
          "capacidadCarga": 15000
        },
        "conductor": {
          "id": 5,
          "nombre": "Carlos Rodríguez",
          "numeroLicencia": "12345678",
          "categoriaLicencia": "C2"
        },
        "scoreVehiculo": 95,
        "scoreConductor": 88,
        "scoreCombinado": 92,
        "detallesVehiculo": [
          "Capacidad óptima (80-100% utilizada)",
          "Estado: DISPONIBLE",
          "Bajo uso (35 viajes)",
          "Documentación al día"
        ],
        "detallesConductor": [
          "Licencia C2 vigente",
          "Descansado (15h desde último viaje)",
          "Experto en ruta (12 viajes)",
          "Sin incidentes registrados"
        ],
        "justificacion": "Score combinado: 92/100 (Vehículo: 95, Conductor: 88)"
      }
    ]
  }
  ```

### Criterios de Scoring

**Vehículo (100 puntos):**
- Capacidad de carga (30%): Prioriza uso óptimo (80-100% de capacidad)
- Estado DISPONIBLE (20%): Descarta vehículos en mantenimiento o en ruta
- Kilometraje/Desgaste (25%): Distribuye equitativamente el uso
- Documentos vigentes (25%): Descarta vehículos con documentos vencidos

**Conductor (100 puntos):**
- Licencia vigente y categoría adecuada (30%): Valida categoría según tipo de vehículo
- Descanso (30%): Requiere mínimo 8 horas desde último viaje
- Experiencia en ruta (25%): Prioriza conductores que conocen la ruta
- Historial de incidentes (15%): Penaliza conductores con muchos incidentes

**Score Combinado:** 60% vehículo + 40% conductor

---

## 🏆 Evaluación de Conductores (HU-21)

### Sistema de Evaluación de Desempeño (`/evaluaciones`)

**⚠️ Acceso según rol:**
- ADMINISTRADOR: Acceso total
- CONDUCTOR: Solo puede ver sus propias evaluaciones

* **Generar Evaluaciones Mensuales:** `POST /evaluaciones/generar`
  *Solo ADMINISTRADOR. Genera evaluaciones para todos los conductores de un periodo.*
  ```json
  {
    "periodo": "2026-05" // Formato: YYYY-MM
  }
  ```

  **Respuesta:**
  ```json
  {
    "success": true,
    "message": "Evaluaciones generadas exitosamente",
    "data": {
      "evaluaciones": [
        {
          "id": 25,
          "conductorId": 5,
          "periodo": "2026-05",
          "scoreTotal": 87.50,
          "scorePuntualidad": 28.00,
          "scoreIncidentes": 25.00,
          "scoreCombustible": 18.00,
          "scoreCalificacionClientes": 15.00,
          "scoreCumplimientoProtocolos": 9.50
        }
      ],
      "errores": [],
      "resumen": {
        "total": 15,
        "exitosas": 15,
        "fallidas": 0
      }
    }
  }
  ```

* **Obtener Ranking del Mes:** `GET /evaluaciones/ranking?periodo=2026-05`
  *Solo ADMINISTRADOR. Útil para mostrar tabla de posiciones.*
  ```json
  {
    "success": true,
    "message": "Ranking obtenido exitosamente",
    "data": [
      {
        "posicion": 1,
        "conductor": {
          "id": 5,
          "nombre": "Carlos Rodríguez",
          "cedula": "1234567890",
          "numeroLicencia": "12345678"
        },
        "scoreTotal": 92.50,
        "entregasTotales": 25,
        "entregasATiempo": 24,
        "incidentesTotales": 0,
        "rendimientoPromedio": 7.85,
        "porcentajePuntualidad": 96
      }
    ]
  }
  ```

* **Ver Evaluación de un Conductor:** `GET /evaluaciones/conductor/:conductorId/:periodo`
  *ADMINISTRADOR puede ver cualquiera. CONDUCTOR solo la suya.*
  ```json
  {
    "success": true,
    "message": "Evaluación obtenida exitosamente",
    "data": {
      "id": 25,
      "periodo": "2026-05",
      "conductor": {
        "id": 5,
        "nombre": "Carlos Rodríguez",
        "cedula": "1234567890",
        "numeroLicencia": "12345678",
        "categoriaLicencia": "C2"
      },
      "scores": {
        "total": 87.50,
        "puntualidad": 28.00,
        "incidentes": 25.00,
        "combustible": 18.00,
        "calificacionClientes": 15.00,
        "cumplimientoProtocolos": 9.50
      },
      "metricas": {
        "entregasTotales": 25,
        "entregasATiempo": 23,
        "incidentesTotales": 1,
        "rendimientoPromedio": 7.45,
        "porcentajePuntualidad": 92
      },
      "comentariosAdmin": "Buen desempeño general. Mejorar puntualidad.",
      "createdAt": "2026-06-01T08:00:00Z",
      "updatedAt": "2026-06-01T08:00:00Z"
    }
  }
  ```

* **Ver Historial de un Conductor:** `GET /evaluaciones/conductor/:conductorId/historial?limite=12`
  *Útil para gráficas de evolución en el tiempo.*
  ```json
  {
    "success": true,
    "message": "Historial obtenido exitosamente",
    "data": [
      {
        "periodo": "2026-05",
        "scoreTotal": 87.50,
        "entregasTotales": 25,
        "entregasATiempo": 23,
        "incidentesTotales": 1
      },
      {
        "periodo": "2026-04",
        "scoreTotal": 90.00,
        "entregasTotales": 28,
        "entregasATiempo": 27,
        "incidentesTotales": 0
      }
    ]
  }
  ```

* **Agregar Comentarios del Administrador:** `PATCH /evaluaciones/:id/comentarios`
  *Solo ADMINISTRADOR.*
  ```json
  {
    "comentarios": "Excelente desempeño este mes. Mantener el nivel."
  }
  ```

### Sistema de Scoring (100 puntos)

- **Puntualidad (30%)**: Entregas a tiempo vs total de entregas
- **Incidentes (25%)**: 0 incidentes = 25 pts, escala descendente
- **Combustible (20%)**: Comparado con promedio del tipo de vehículo
- **Calificación clientes (15%)**: Reservado para implementación futura (asigna máximo por defecto)
- **Cumplimiento protocolos (10%)**: Entregas con firma digital completa

### Sistema de Alertas
- Si un conductor tiene score < 60 por 2 meses consecutivos, el sistema genera una alerta automática para el administrador.

---

## 🔐 Roles y Permisos

| Rol | Permisos |
|-----|----------|
| **ADMINISTRADOR** | Acceso total a todos los módulos |
| **DESPACHADOR** | Crear/editar órdenes de despacho, ver sugerencias de asignación |
| **CONDUCTOR** | Ver sus viajes, registrar gastos, ver sus evaluaciones |
| **CLIENTE** | Consultar estado de sus envíos y entregas |
| **JEFE_TALLER** | Gestión de mantenimiento, órdenes de trabajo, solicitudes de compra |
| **GESTOR_INVENTARIO** | Gestión de repuestos, solicitudes de compra, recepción de inventario |
| **AUDITOR** | Solo lectura de logs de auditoría |

---

## 💡 Tips para el Frontend

### 1. Manejo de Tokens
```javascript
// Guardar token después del login
localStorage.setItem('token', response.data.data.token);
localStorage.setItem('user', JSON.stringify(response.data.data.usuario));

// Limpiar al logout
localStorage.removeItem('token');
localStorage.removeItem('user');
```

### 2. Interceptor de Errores
```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Mostrar mensaje de error al usuario
    const message = error.response?.data?.message || 'Error en la petición';
    toast.error(message); // Usar tu librería de notificaciones
    
    return Promise.reject(error);
  }
);
```

### 3. Paginación
```javascript
// Todas las listas soportan paginación
const fetchData = async (page = 1, limit = 20) => {
  const response = await api.get(`/vehiculos?page=${page}&limit=${limit}`);
  return response.data;
};
```

### 4. Validación de Formularios
El backend devuelve errores de validación en el campo `errors`:
```javascript
try {
  await api.post('/vehiculos', formData);
} catch (error) {
  if (error.response?.data?.errors) {
    // Mostrar errores de validación campo por campo
    error.response.data.errors.forEach((err) => {
      console.log(`${err.param}: ${err.msg}`);
    });
  }
}
```

### 5. Alertas y Notificaciones
Implementar un sistema de notificaciones para:
- ✅ Documentos por vencer (usar `/documentos-vehiculares/alertas`)
- ✅ Bajo rendimiento de combustible (mensaje en respuesta de POST)
- ✅ Saldo bajo de viáticos (mensaje en respuesta de aprobar gasto)
- ✅ Conductores con bajo desempeño (consultar evaluaciones)

---

## 🛠️ Stack Tecnológico Frontend

El frontend de Trans-Ruta está construido con las siguientes tecnologías:

### A. Estructura y Construcción
- **Vite**: Build tool moderno y rápido para inicializar el proyecto
- **Vite PWA Plugin**: Convierte la app en PWA para sincronización offline (crítico para conductores sin señal)

### B. Framework, Enrutamiento y Estado
- **React**: Framework principal
- **React Router v7**: Manejo de rutas y navegación entre vistas (Login, Dashboard, Rutas activas, etc.)
- **Zustand**: Gestión de estado global del cliente (sesión de usuario, preferencias de UI)
- **Axios**: Cliente HTTP para comunicación con el backend
- **React Query (TanStack Query)**: Gestión de estado del servidor — cache, sincronización y actualizaciones optimistas

### C. Diseño e Interfaces (UI)
Opciones recomendadas (elegir una):
- **Material-UI (MUI)** o **Ant Design**: Componentes avanzados (tablas, modales, alertas) listos para usar — ideal para paneles administrativos
- **Tailwind CSS**: Control total del diseño con clases utilitarias — opción más popular y flexible

### D. Formularios y Validaciones
- **React Hook Form**: Gestión eficiente de formularios pesados (crear vehículo, crear orden, reportar incidente) sin degradar el rendimiento
- **Yup** o **Zod**: Validación en el frontend que hace match con las reglas de express-validator del backend

### E. Librerías Específicas
- **react-leaflet**: Mapas con OpenStreetMap para geolocalización (RNF3)
- **react-signature-canvas**: Captura de firmas digitales con el dedo en entregas — guarda como base64 (RF8)

### Consideraciones Importantes

#### PWA y Sincronización Offline
Los conductores frecuentemente pierden señal en ruta. La PWA permite:
- Instalar la app en el teléfono
- Guardar datos en caché cuando no hay internet
- Sincronizar automáticamente cuando recuperan la conexión

#### Separación de responsabilidades: Zustand vs React Query
- **Zustand**: estado del *cliente* (quién está logueado, tema de la app, UI local)
- **React Query**: estado del *servidor* (datos que vienen de la API — vehículos, órdenes, etc.)
- No mezclarlos: no guardes datos de la API en Zustand.

#### Validación Frontend-Backend
Usar **Yup/Zod** en el frontend con las mismas reglas que **express-validator** en el backend para:
- Validar antes de enviar (mejor UX)
- Reducir peticiones inválidas al servidor
- Mensajes de error consistentes

#### Ejemplo de Integración con React Query
```javascript
import { useQuery, useMutation } from '@tanstack/react-query';
import api from './api'; // Axios instance con interceptores

// Listar vehículos con cache automático
const useVehiculos = () => {
  return useQuery({
    queryKey: ['vehiculos'],
    queryFn: () => api.get('/vehiculos').then(res => res.data),
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
  });
};

// Crear orden de despacho con invalidación de cache
const useCrearOrden = () => {
  return useMutation({
    mutationFn: (data) => api.post('/ordenes-despacho', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['ordenes-despacho']);
    },
  });
};
```

---

## 📞 Soporte

¿Dudas o problemas con la API? Contacta al equipo de backend:
- **Email:** backend@trans-ruta.com
- **Slack:** #backend-support

---

**Última actualización:** Mayo 13, 2026  
**Versión de la API:** v1.0.0
