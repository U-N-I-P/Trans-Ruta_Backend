# 📚 Documentación Swagger - Trans-Ruta API

## 🚀 Acceso Rápido

### ✨ Interfaz Interactiva (Recomendado)

**URL**: `http://localhost:3000/api-docs`

Esta interfaz incluye:
- ✅ **Autorización automática**: El token se guarda y aplica automáticamente después del login
- ✅ **Sin copiar/pegar**: No necesitas copiar el token manualmente
- ✅ **Persistencia**: El token se mantiene incluso si recargas la página
- ✅ **Logout integrado**: El token se elimina automáticamente al cerrar sesión

### 📖 Cómo Usar

1. **Inicia el servidor**:
   ```bash
   pnpm run dev
   # o
   npm run dev
   ```

2. **Abre la documentación**:
   - Navega a: `http://localhost:3000/api-docs`

3. **Prueba el login**:
   - Busca el endpoint `POST /auth/login`
   - Haz clic en "Try it out"
   - Usa las credenciales de ejemplo:
     ```json
     {
       "correo": "admin@trans-ruta.com",
       "contrasena": "Admin123!"
     }
     ```
   - Haz clic en "Execute"
   - **¡El token se aplicará automáticamente!** 🎉

4. **Prueba otros endpoints**:
   - Ahora puedes probar cualquier endpoint protegido
   - El token se envía automáticamente en cada petición
   - No necesitas hacer nada más

5. **Cierra sesión**:
   - Usa el endpoint `POST /auth/logout`
   - El token se eliminará automáticamente

### 🔐 Cómo Funciona la Autorización Automática

El sistema intercepta las respuestas del servidor:

1. **Después del login**:
   - Extrae el token de la respuesta
   - Lo guarda en `localStorage`
   - Lo aplica automáticamente a Swagger UI
   - Muestra una notificación de éxito

2. **En cada petición**:
   - Lee el token de `localStorage`
   - Lo agrega automáticamente al header `Authorization`
   - Excepto para `/auth/login` (no necesita token)

3. **Después del logout**:
   - Elimina el token de `localStorage`
   - Muestra una notificación de cierre de sesión

4. **Al recargar la página**:
   - Recupera el token de `localStorage`
   - Lo aplica automáticamente si existe

### 🛠️ Opciones Alternativas

### 🛠️ Opciones Alternativas

#### Opción 1: Swagger Editor Online
1. Visita [Swagger Editor](https://editor.swagger.io/)
2. Copia el contenido del archivo `swagger.yaml`
3. Pégalo en el editor
4. La documentación se renderizará automáticamente
5. **Nota**: No tendrás autorización automática en esta opción

#### Opción 2: VS Code Extension
1. Visita [Swagger Editor](https://editor.swagger.io/)
2. Copia el contenido del archivo `swagger.yaml`
3. Pégalo en el editor
4. La documentación se renderizará automáticamente

#### Opción 2: VS Code Extension
1. Instala la extensión "Swagger Viewer" en VS Code
2. Abre el archivo `swagger.yaml`
3. Presiona `Shift + Alt + P` (Windows/Linux) o `Shift + Option + P` (Mac)
4. Selecciona "Preview Swagger"
5. **Nota**: No tendrás autorización automática en esta opción

---

## 📖 Contenido de la Documentación

La documentación incluye:

### ✅ HU-15: Documentos Vehiculares
- `GET /documentos-vehiculares/alertas` - Alertas de documentos por vencer
- `GET /documentos-vehiculares` - Listar documentos
- `POST /documentos-vehiculares` - Crear documento
- `PUT /documentos-vehiculares/:id` - Actualizar documento
- `DELETE /documentos-vehiculares/:id` - Eliminar documento

### ✅ HU-16: Consumo de Combustible
- `GET /consumos-combustible` - Listar consumos
- `POST /consumos-combustible` - Registrar consumo (calcula rendimiento automáticamente)
- `GET /consumos-combustible/vehiculo/:vehiculoId` - Historial por vehículo

### ✅ HU-17: Viáticos y Gastos
- `POST /gastos-viaticos` - Registrar gasto
- `GET /gastos-viaticos/viatico/:viaticoId` - Gastos de un viático
- `PATCH /gastos-viaticos/:id/aprobar` - Aprobar gasto (actualiza saldo automáticamente)
- `PATCH /gastos-viaticos/:id/rechazar` - Rechazar gasto

### ✅ HU-18: Auditoría
- `GET /auditoria` - Listar logs (con filtros avanzados)
- `GET /auditoria/:id` - Detalle de un log
- `GET /auditoria/exportar` - Exportar a CSV o PDF

### ✅ HU-19: Solicitudes de Compra con Aprobación
- `GET /solicitudes-compra/pendientes` - Solicitudes pendientes
- `POST /solicitudes-compra/:repuestoId` - Crear solicitud (aprobación automática si monto ≤ $500,000)
- `PATCH /solicitudes-compra/:id/aprobar` - Aprobar solicitud
- `PATCH /solicitudes-compra/:id/rechazar` - Rechazar solicitud
- `PATCH /solicitudes-compra/:id/recibir` - Registrar recepción (actualiza inventario)

### ✅ HU-20: Sugerencias de Asignación
- `GET /sugerencias` - Obtener sugerencias inteligentes de vehículo-conductor

### ✅ HU-21: Evaluación de Conductores
- `POST /evaluaciones/generar` - Generar evaluaciones mensuales
- `GET /evaluaciones/ranking` - Ranking de conductores
- `GET /evaluaciones/conductor/:conductorId/:periodo` - Evaluación individual
- `GET /evaluaciones/conductor/:conductorId/historial` - Historial de evaluaciones
- `PATCH /evaluaciones/:id/comentarios` - Agregar comentarios del admin

## 🔐 Autenticación

Todos los endpoints (excepto `/auth/login`) requieren autenticación JWT.

**Cómo probar en Swagger UI:**
1. Haz login en `/auth/login`
2. Copia el token de la respuesta
3. Haz clic en el botón "Authorize" (🔒) en la parte superior
4. Ingresa: `Bearer <tu-token-aqui>`
5. Haz clic en "Authorize"

## 📝 Notas Importantes

### Cálculos Automáticos
El backend calcula automáticamente:
- **Consumo de Combustible**: Distancia recorrida y rendimiento (Km/L)
- **Solicitudes de Compra**: Monto total (cantidad × costoEstimado)
- **Gastos de Viáticos**: Actualización del saldo al aprobar
- **Evaluaciones**: Scores ponderados basados en métricas objetivas

### Alertas Automáticas
El sistema genera alertas cuando:
- Documentos vencen en ≤30 días (niveles: CRITICO, ALERTA, INFO)
- Rendimiento de combustible es 20% menor al promedio
- Saldo de viático es <10% del monto o negativo
- Conductor tiene score <60 por 2 meses consecutivos

### Roles y Permisos
- **ADMINISTRADOR**: Acceso total
- **DESPACHADOR**: Órdenes de despacho, sugerencias
- **CONDUCTOR**: Sus viajes, gastos y evaluaciones
- **JEFE_TALLER**: Mantenimiento, solicitudes de compra
- **GESTOR_INVENTARIO**: Repuestos, recepción de inventario
- **AUDITOR**: Solo lectura de auditoría

## 🛠️ Actualizar la Documentación

Si agregas nuevos endpoints:
1. Edita `swagger.yaml`
2. Sigue la estructura existente
3. Incluye ejemplos de request/response
4. Documenta parámetros requeridos y opcionales
5. Especifica códigos de respuesta HTTP

## 📞 Soporte

¿Dudas sobre la documentación?
- **Email**: backend@trans-ruta.com
- **Slack**: #backend-support

---

**Última actualización**: Mayo 13, 2026  
**Versión de la API**: v1.0.0
