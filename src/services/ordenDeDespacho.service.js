/**
 * @module services/ordenDeDespacho.service
 * @description Lógica de negocio para Órdenes de Despacho
 */
const { OrdenDeDespacho, Conductor, Vehiculo, Cliente, Entrega, DocumentoVehicular } = require('../models');
const { getPagination, paginate } = require('../utils/pagination.helper');
const { registrarAuditoria } = require('./auditoria.service');

/**
 * Genera código automático OD-YYYYMMDD-XXXX
 * @returns {Promise<string>}
 */
async function generarCodigo() {
  const hoy = new Date();
  const fecha = hoy.toISOString().split('T')[0].replace(/-/g, '');
  const count = await OrdenDeDespacho.count({
    where: { fechaCreacion: hoy.toISOString().split('T')[0] },
  });
  const secuencial = String(count + 1).padStart(4, '0');
  return `OD-${fecha}-${secuencial}`;
}

async function findAll(query) {
  const { page, limit, offset } = getPagination(query);
  const data = await OrdenDeDespacho.findAndCountAll({
    include: [
      { model: Conductor, as: 'conductor', attributes: ['id', 'nombre', 'apellido'] },
      { model: Vehiculo, as: 'vehiculo', attributes: ['id', 'placa', 'tipo'] },
      { model: Cliente, as: 'cliente', attributes: ['id', 'nombre'] },
    ],
    limit,
    offset,
    order: [['id', 'DESC']],
  });
  return paginate(data, page, limit);
}

async function findById(id) {
  const orden = await OrdenDeDespacho.findByPk(id, {
    include: [
      { model: Conductor, as: 'conductor' },
      { model: Vehiculo, as: 'vehiculo' },
      { model: Cliente, as: 'cliente' },
      { model: Entrega, as: 'entrega' },
    ],
  });
  if (!orden) {
    const err = new Error('Orden de despacho no encontrada');
    err.statusCode = 404;
    throw err;
  }
  return orden;
}

async function findByConductor(conductorId) {
  return await OrdenDeDespacho.findAll({
    where: { conductorId },
    include: [
      { model: Vehiculo, as: 'vehiculo', attributes: ['id', 'placa', 'tipo'] },
      { model: Cliente, as: 'cliente', attributes: ['id', 'nombre'] },
    ],
    order: [['id', 'DESC']],
  });
}

async function create(data, auditCtx) {
  // Verificar que el vehículo esté disponible
  const vehiculo = await Vehiculo.findByPk(data.vehiculoId);
  if (!vehiculo) {
    const err = new Error('Vehículo no encontrado');
    err.statusCode = 404;
    throw err;
  }
  if (vehiculo.estado !== 'DISPONIBLE') {
    const err = new Error('El vehículo no está disponible');
    err.statusCode = 400;
    throw err;
  }

  // Verificar que el vehículo no tenga documentos vencidos (HU-15)
  const documentos = await DocumentoVehicular.findAll({ where: { vehiculoId: data.vehiculoId } });
  const hoyStr = new Date().toISOString().split('T')[0];
  const docsVencidos = documentos.filter(doc => doc.fechaVencimiento < hoyStr);
  
  if (docsVencidos.length > 0) {
    const tiposVencidos = docsVencidos.map(d => d.tipo).join(', ');
    const err = new Error(`El vehículo tiene documentos vencidos: ${tiposVencidos}. No se puede asignar a una orden.`);
    err.statusCode = 400;
    throw err;
  }

  // Verificar peso vs capacidad del vehículo
  if (data.pesoCarga > vehiculo.capacidadCarga) {
    const err = new Error(`El peso de carga (${data.pesoCarga} kg) excede la capacidad del vehículo (${vehiculo.capacidadCarga} kg)`);
    err.statusCode = 400;
    throw err;
  }

  // Verificar que la licencia del conductor no esté vencida
  const conductor = await Conductor.findByPk(data.conductorId);
  if (!conductor) {
    const err = new Error('Conductor no encontrado');
    err.statusCode = 404;
    throw err;
  }
  if (new Date(conductor.fechaVencimientoLicencia) <= new Date()) {
    const err = new Error('La licencia del conductor está vencida');
    err.statusCode = 400;
    throw err;
  }

  // Validar fechas
  if (data.fechaSalida && data.fechaEntregaEstimada) {
    if (new Date(data.fechaEntregaEstimada) <= new Date(data.fechaSalida)) {
      const err = new Error('La fecha de entrega estimada debe ser posterior a la fecha de salida');
      err.statusCode = 400;
      throw err;
    }
  }

  // Generar código y fecha de creación
  data.codigo = await generarCodigo();
  data.fechaCreacion = new Date().toISOString().split('T')[0];

  const orden = await OrdenDeDespacho.create(data);
  if (auditCtx) {
    await registrarAuditoria({
      usuarioId: auditCtx.usuarioId,
      ipAddress: auditCtx.ipAddress,
      accion: 'CREATE',
      entidad: 'OrdenDeDespacho',
      entidadId: orden.id,
      datosAnteriores: null,
      datosNuevos: orden.get({ plain: true }),
    });
  }
  return orden;
}

async function update(id, data, auditCtx) {
  const orden = await findById(id);
  const antes = orden.get({ plain: true });
  const assignmentChanged =
    (data.conductorId != null && Number(data.conductorId) !== Number(antes.conductorId)) ||
    (data.vehiculoId != null && Number(data.vehiculoId) !== Number(antes.vehiculoId));

  await orden.update(data);
  await orden.reload();

  if (auditCtx) {
    const despues = orden.get({ plain: true });
    const accion = assignmentChanged ? 'ASSIGN' : 'UPDATE';
    await registrarAuditoria({
      usuarioId: auditCtx.usuarioId,
      ipAddress: auditCtx.ipAddress,
      accion,
      entidad: 'OrdenDeDespacho',
      entidadId: orden.id,
      datosAnteriores: accion === 'UPDATE' ? antes : null,
      datosNuevos:
        accion === 'ASSIGN'
          ? {
              conductorIdAnterior: antes.conductorId,
              vehiculoIdAnterior: antes.vehiculoId,
              conductorIdNuevo: despues.conductorId,
              vehiculoIdNuevo: despues.vehiculoId,
            }
          : despues,
    });
  }

  return orden;
}

/**
 * Cambiar estado de la orden con validaciones de negocio
 * @param {number} id
 * @param {string} nuevoEstado
 * @returns {Promise<object>}
 */
async function cambiarEstado(id, nuevoEstado, auditCtx) {
  const orden = await findById(id);
  const estadoAnterior = orden.estado;

  // Si se marca como ENTREGADO, verificar que exista una Entrega
  if (nuevoEstado === 'ENTREGADO') {
    const entrega = await Entrega.findOne({ where: { ordenDeDespachoId: id } });
    if (!entrega) {
      const err = new Error('No se puede marcar como ENTREGADO sin una entrega registrada');
      err.statusCode = 400;
      throw err;
    }
  }

  await orden.update({ estado: nuevoEstado });
  await orden.reload();

  if (auditCtx) {
    await registrarAuditoria({
      usuarioId: auditCtx.usuarioId,
      ipAddress: auditCtx.ipAddress,
      accion: 'UPDATE',
      entidad: 'OrdenDeDespacho',
      entidadId: orden.id,
      datosAnteriores: { estado: estadoAnterior },
      datosNuevos: { estado: orden.estado },
    });
  }

  return orden;
}

async function remove(id, auditCtx) {
  const orden = await findById(id);
  const snapshot = orden.get({ plain: true });
  if (auditCtx) {
    await registrarAuditoria({
      usuarioId: auditCtx.usuarioId,
      ipAddress: auditCtx.ipAddress,
      accion: 'DELETE',
      entidad: 'OrdenDeDespacho',
      entidadId: orden.id,
      datosAnteriores: null,
      datosNuevos: snapshot,
    });
  }
  await orden.destroy();
}

module.exports = { findAll, findById, findByConductor, create, update, cambiarEstado, remove };
