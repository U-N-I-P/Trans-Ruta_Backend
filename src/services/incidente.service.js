/**
 * @module services/incidente.service
 * @description Lógica de negocio para Incidentes
 */
const { Incidente, OrdenDeDespacho, Notificacion, Cliente } = require('../models');
const { getPagination, paginate } = require('../utils/pagination.helper');
const { registrarAuditoria } = require('./auditoria.service');

const ESTADOS_INCIDENTE = ['ABIERTO', 'EN_PROCESO', 'RESUELTO', 'CERRADO'];

const TRANSICIONES_PERMITIDAS = {
  ABIERTO: ['EN_PROCESO', 'RESUELTO', 'CERRADO'],
  EN_PROCESO: ['RESUELTO', 'CERRADO'],
  RESUELTO: ['CERRADO'],
  CERRADO: [],
};

async function findAll(query) {
  const { page, limit, offset } = getPagination(query);
  const data = await Incidente.findAndCountAll({
    include: [{ model: OrdenDeDespacho, as: 'ordenDeDespacho', attributes: ['id', 'codigo'] }],
    limit,
    offset,
    order: [['id', 'DESC']],
  });
  return paginate(data, page, limit);
}

async function findById(id) {
  const incidente = await Incidente.findByPk(id, {
    include: [{ model: OrdenDeDespacho, as: 'ordenDeDespacho' }],
  });
  if (!incidente) {
    const err = new Error('Incidente no encontrado');
    err.statusCode = 404;
    throw err;
  }
  return incidente;
}

/**
 * Reportar un incidente vinculado a una orden.
 * Si protocoloActivado=true, crea notificación automática.
 * @param {number} ordenId
 * @param {object} data
 * @returns {Promise<object>}
 */
async function reportar(ordenId, data) {
  const orden = await OrdenDeDespacho.findByPk(ordenId, {
    include: [{ model: Cliente, as: 'cliente' }],
  });
  if (!orden) {
    const err = new Error('Orden de despacho no encontrada');
    err.statusCode = 404;
    throw err;
  }

  data.ordenDeDespachoId = ordenId;
  const incidente = await Incidente.create(data);

  // Si se activó protocolo, crear notificación automática
  if (data.protocoloActivado && orden.cliente) {
    await Notificacion.create({
      mensaje: `Incidente reportado en la orden ${orden.codigo}: ${data.tipo} - ${data.descripcion}`,
      fecha: new Date().toISOString().split('T')[0],
      tipo: 'INCIDENTE',
      destinatario: 'ADMINISTRADOR,DESPACHADOR',
      clienteId: orden.clienteId,
    });
  }

  return incidente;
}

const CAMPOS_EDITABLES = ['tipo', 'descripcion', 'fecha', 'latitud', 'longitud', 'protocoloActivado'];

function pickCamposEditables(data) {
  return CAMPOS_EDITABLES.reduce((acc, key) => {
    if (data[key] !== undefined) acc[key] = data[key];
    return acc;
  }, {});
}

async function update(id, data, auditCtx) {
  const incidente = await findById(id);
  if (incidente.estado === 'CERRADO') {
    const err = new Error('No se puede editar un incidente cerrado');
    err.statusCode = 400;
    throw err;
  }
  const cambios = pickCamposEditables(data);
  if (Object.keys(cambios).length === 0) {
    const err = new Error('No se enviaron campos para actualizar');
    err.statusCode = 400;
    throw err;
  }
  const antes = incidente.get({ plain: true });
  await incidente.update(cambios);
  await incidente.reload();

  if (auditCtx) {
    await registrarAuditoria({
      usuarioId: auditCtx.usuarioId,
      ipAddress: auditCtx.ipAddress,
      accion: 'UPDATE',
      entidad: 'Incidente',
      entidadId: incidente.id,
      datosAnteriores: antes,
      datosNuevos: incidente.get({ plain: true }),
    });
  }

  return incidente;
}

async function cambiarEstado(id, nuevoEstado, auditCtx) {
  const incidente = await findById(id);

  if (incidente.estado === 'CERRADO') {
    const err = new Error('No se puede modificar un incidente cerrado');
    err.statusCode = 400;
    throw err;
  }
  if (incidente.estado === nuevoEstado) {
    const err = new Error('El incidente ya está en ese estado');
    err.statusCode = 400;
    throw err;
  }
  if (!TRANSICIONES_PERMITIDAS[incidente.estado].includes(nuevoEstado)) {
    const err = new Error(`Transición no permitida: ${incidente.estado} → ${nuevoEstado}`);
    err.statusCode = 400;
    throw err;
  }

  const antes = { estado: incidente.estado };
  await incidente.update({ estado: nuevoEstado });
  await incidente.reload();

  if (auditCtx) {
    await registrarAuditoria({
      usuarioId: auditCtx.usuarioId,
      ipAddress: auditCtx.ipAddress,
      accion: 'UPDATE',
      entidad: 'Incidente',
      entidadId: incidente.id,
      datosAnteriores: antes,
      datosNuevos: { estado: incidente.estado },
    });
  }

  return incidente;
}

async function finalizar(id, auditCtx) {
  return cambiarEstado(id, 'CERRADO', auditCtx);
}

async function remove(id) {
  const incidente = await findById(id);
  await incidente.destroy();
}

module.exports = {
  findAll,
  findById,
  reportar,
  update,
  cambiarEstado,
  finalizar,
  remove,
  ESTADOS_INCIDENTE,
};
