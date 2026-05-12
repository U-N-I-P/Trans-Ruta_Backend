/**
 * @module models/index
 * @description Asociaciones entre todos los modelos del sistema Trans-Ruta
 */
const sequelize = require('../config/database');

const Usuario = require('./Usuario');
const Vehiculo = require('./Vehiculo');
const Conductor = require('./Conductor');
const Cliente = require('./Cliente');
const Viatico = require('./Viatico');
const OrdenDeDespacho = require('./OrdenDeDespacho');
const Entrega = require('./Entrega');
const Incidente = require('./Incidente');
const PlanDeMantenimiento = require('./PlanDeMantenimiento');
const OrdenDeTrabajo = require('./OrdenDeTrabajo');
const Repuesto = require('./Repuesto');
const SolicitudDeCompra = require('./SolicitudDeCompra');
const Notificacion = require('./Notificacion');
const Reporte = require('./Reporte');
const DocumentoVehicular = require('./DocumentoVehicular');
const ConsumoCombustible = require('./ConsumoCombustible');
const GastoViatico = require('./GastoViatico');

// ===== Usuario =====
Usuario.hasMany(Conductor, { foreignKey: 'usuarioId', as: 'conductores' });
Usuario.hasMany(Cliente, { foreignKey: 'usuarioId', as: 'clientes' });
Usuario.hasMany(Reporte, { foreignKey: 'usuarioId', as: 'reportes' });

// ===== Conductor =====
Conductor.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
Conductor.hasMany(Viatico, { foreignKey: 'conductorId', as: 'viaticos' });
Conductor.hasMany(OrdenDeDespacho, { foreignKey: 'conductorId', as: 'ordenesDeDespacho' });

// ===== Cliente =====
Cliente.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
Cliente.hasMany(OrdenDeDespacho, { foreignKey: 'clienteId', as: 'ordenesDeDespacho' });
Cliente.hasMany(Notificacion, { foreignKey: 'clienteId', as: 'notificaciones' });

// ===== Viatico =====
Viatico.belongsTo(Conductor, { foreignKey: 'conductorId', as: 'conductor' });
Viatico.belongsTo(OrdenDeDespacho, { foreignKey: 'ordenDeDespachoId', as: 'ordenDeDespacho' });
Viatico.hasMany(GastoViatico, { foreignKey: 'viaticoId', as: 'gastos' });

// ===== GastoViatico =====
GastoViatico.belongsTo(Viatico, { foreignKey: 'viaticoId', as: 'viatico' });

// ===== Vehiculo =====
Vehiculo.hasMany(OrdenDeDespacho, { foreignKey: 'vehiculoId', as: 'ordenesDeDespacho' });
Vehiculo.hasMany(PlanDeMantenimiento, { foreignKey: 'vehiculoId', as: 'planesDeMantenimiento' });
Vehiculo.hasMany(DocumentoVehicular, { foreignKey: 'vehiculoId', as: 'documentos' });
Vehiculo.hasMany(ConsumoCombustible, { foreignKey: 'vehiculoId', as: 'consumosCombustible' });

// ===== OrdenDeDespacho =====
OrdenDeDespacho.belongsTo(Conductor, { foreignKey: 'conductorId', as: 'conductor' });
OrdenDeDespacho.belongsTo(Vehiculo, { foreignKey: 'vehiculoId', as: 'vehiculo' });
OrdenDeDespacho.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });
OrdenDeDespacho.hasOne(Entrega, { foreignKey: 'ordenDeDespachoId', as: 'entrega' });
OrdenDeDespacho.hasMany(Incidente, { foreignKey: 'ordenDeDespachoId', as: 'incidentes' });
OrdenDeDespacho.hasOne(ConsumoCombustible, { foreignKey: 'ordenDeDespachoId', as: 'consumoCombustible' });
OrdenDeDespacho.hasMany(Viatico, { foreignKey: 'ordenDeDespachoId', as: 'viaticos' });

// ===== Entrega =====
Entrega.belongsTo(OrdenDeDespacho, { foreignKey: 'ordenDeDespachoId', as: 'ordenDeDespacho' });

// ===== Incidente =====
Incidente.belongsTo(OrdenDeDespacho, { foreignKey: 'ordenDeDespachoId', as: 'ordenDeDespacho' });

// ===== PlanDeMantenimiento =====
PlanDeMantenimiento.belongsTo(Vehiculo, { foreignKey: 'vehiculoId', as: 'vehiculo' });

// ===== Repuesto =====
Repuesto.hasMany(OrdenDeTrabajo, { foreignKey: 'repuestoId', as: 'ordenesDeTrabajo' });
Repuesto.hasMany(SolicitudDeCompra, { foreignKey: 'repuestoId', as: 'solicitudesDeCompra' });

// ===== OrdenDeTrabajo =====
OrdenDeTrabajo.belongsTo(Repuesto, { foreignKey: 'repuestoId', as: 'repuesto' });

// ===== SolicitudDeCompra =====
SolicitudDeCompra.belongsTo(Repuesto, { foreignKey: 'repuestoId', as: 'repuesto' });

// ===== Notificacion =====
Notificacion.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });

// ===== Reporte =====
Reporte.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

// ===== DocumentoVehicular =====
DocumentoVehicular.belongsTo(Vehiculo, { foreignKey: 'vehiculoId', as: 'vehiculo' });

// ===== ConsumoCombustible =====
ConsumoCombustible.belongsTo(Vehiculo, { foreignKey: 'vehiculoId', as: 'vehiculo' });
ConsumoCombustible.belongsTo(OrdenDeDespacho, { foreignKey: 'ordenDeDespachoId', as: 'ordenDeDespacho' });

// ===== ManyToMany: OrdenDeTrabajo ↔ PlanDeMantenimiento =====
OrdenDeTrabajo.belongsToMany(PlanDeMantenimiento, {
  through: 'orden_trabajo_plan',
  foreignKey: 'orden_de_trabajo_id',
  otherKey: 'plan_de_mantenimiento_id',
  as: 'planesDeMantenimiento',
});
PlanDeMantenimiento.belongsToMany(OrdenDeTrabajo, {
  through: 'orden_trabajo_plan',
  foreignKey: 'plan_de_mantenimiento_id',
  otherKey: 'orden_de_trabajo_id',
  as: 'ordenesDeTrabajo',
});

module.exports = {
  sequelize,
  Usuario,
  Vehiculo,
  Conductor,
  Cliente,
  Viatico,
  OrdenDeDespacho,
  Entrega,
  Incidente,
  PlanDeMantenimiento,
  OrdenDeTrabajo,
  Repuesto,
  SolicitudDeCompra,
  Notificacion,
  Reporte,
  DocumentoVehicular,
  ConsumoCombustible,
  GastoViatico,
};
