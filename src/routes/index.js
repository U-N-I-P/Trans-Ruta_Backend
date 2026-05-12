/**
 * @module routes/index
 * @description Agrupador de todas las rutas de la API
 */
const { Router } = require('express');

const router = Router();

router.use('/auth', require('./auth.routes'));
router.use('/usuarios', require('./usuario.routes'));
router.use('/vehiculos', require('./vehiculo.routes'));
router.use('/conductores', require('./conductor.routes'));
router.use('/clientes', require('./cliente.routes'));
router.use('/viaticos', require('./viatico.routes'));
router.use('/ordenes-despacho', require('./ordenDeDespacho.routes'));
router.use('/entregas', require('./entrega.routes'));
router.use('/incidentes', require('./incidente.routes'));
router.use('/planes-mantenimiento', require('./planDeMantenimiento.routes'));
router.use('/ordenes-trabajo', require('./ordenDeTrabajo.routes'));
router.use('/repuestos', require('./repuesto.routes'));
router.use('/solicitudes-compra', require('./solicitudDeCompra.routes'));
router.use('/notificaciones', require('./notificacion.routes'));
router.use('/reportes', require('./reporte.routes'));
router.use('/manifiestos', require('./manifiesto.routes'));
router.use('/documentos-vehiculares', require('./documentoVehicular.routes'));
router.use('/consumos-combustible', require('./consumoCombustible.routes'));

module.exports = router;
