# 📖 Trans-Ruta: Documentación Oficial de la API (Para Frontend)

¡Bienvenidos al equipo de Frontend! Este documento es su guía definitiva para conectar las interfaces de usuario con el servidor backend. Aquí encontrarán todo lo necesario para interactuar con la API RESTful de Trans-Ruta.

---

## 📑 Tabla de Contenido
1. [Configuración Inicial](#-configuración-inicial)
2. [Estructura de Respuestas](#-estructura-de-respuestas)
3. [Manejo de Errores](#-manejo-de-errores)
4. [Épica 1: Flota y Mantenimiento](#-épica-1-flota-y-mantenimiento-hu-01-hu-02)
5. [Épica 2: Planificación y Despacho](#-épica-2-planificación-y-despacho-hu-03-hu-05)
6. [Épica 3: Operación en Ruta](#-épica-3-operación-en-ruta-hu-06-hu-09)
7. [Épica 4: Gestión de Conductores y Viáticos](#-épica-4-gestión-de-conductores-y-viáticos-hu-10-hu-11-hu-17)
8. [Épica 5: Inventario](#-épica-5-inventario-hu-12)
9. [Nuevos Módulos (Documentos y Combustible)](#-nuevos-módulos-hu-15-hu-16)

---

## 🚀 Configuración Inicial

- **URL Base de Desarrollo:** `http://localhost:3000/api/v1`
- **Cabeceras Globales Recomendadas:**
  ```json
  {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
  ```
- **Autenticación (JWT):** Todas las rutas (excepto login) están protegidas. Deben enviar el token en la cabecera:
  ```http
  Authorization: Bearer <TU_TOKEN_JWT_AQUI>
  ```

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
* **Finalizar Viaje con Firma:** `POST /entregas`
  ```json
  {
    "ordenDeDespachoId": 3,
    "fechaHoraEntrega": "2026-05-12T15:30:00Z",
    "firmaDigital": "data:image/png;base64,ivBORw0KGgoAAAANSU..."
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

## 🛠️ Épica 5: Inventario (HU-12)

### Solicitudes de Compra (`/solicitudes-compra`)
* **Crear Solicitud de Repuestos:** `POST /solicitudes-compra`
  ```json
  {
    "repuestoId": 2,
    "cantidad": 5,
    "costoEstimado": 450000,
    "fecha": "2026-05-12"
  }
  ```

---

## 🚨 Nuevos Módulos Especiales (HU-15 y HU-16)

### Documentos Vehiculares (`/documentos-vehiculares`)
* **Alertas para Dashboard:** `GET /documentos-vehiculares/alertas`
  *Devuelve un array ideal para mostrar tarjetas de color en el inicio del sistema:*
  ```json
  "data": [
    {
      "placa": "TRK-900",
      "tipo": "SOAT",
      "diasFaltantes": 8,
      "nivelAlerta": "ALERTA" // Retorna INFO, ALERTA o CRITICO
    }
  ]
  ```
* **Subir Nuevo Documento:** `POST /documentos-vehiculares`
  ```json
  {
    "tipo": "SOAT",
    "numero": "888999",
    "fechaExpedicion": "2025-05-10",
    "fechaVencimiento": "2026-05-10",
    "vehiculoId": 2,
    "archivoAdjunto": "url-pdf"
  }
  ```

### Consumo de Combustible (`/consumos-combustible`)
* **Registrar carga de gasolina:** `POST /consumos-combustible`
  *No es necesario que ustedes calculen el rendimiento (Km/L). Nosotros lo hacemos.*
  ```json
  {
    "kilometrajeInicial": 120000,
    "kilometrajeFinal": 120500,
    "litrosCargados": 85.0,
    "costoTotal": 320000,
    "ordenDeDespachoId": 5,
    "evidenciaFotografica": "url-foto"
  }
  ```
