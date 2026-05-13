/**
 * @module services/solicitudDeCompra.service
 * @description Lógica de negocio para Solicitudes de Compra (HU-19)
 */
const { SolicitudDeCompra, Repuesto, Usuario } = require('../models');
const { getPagination, paginate } = require('../utils/pagination.helper');
const { registrarAuditoria } = require('./auditoria.service');
const sequelize = require('../config/database');

const MONTO_LIMITE_APROBACION = 500000; // $500,000 COP

async function findAll(query) {
  const { page, limit, offset } = getPagination(query);
  const data = await SolicitudDeCompra.findAndCountAll({
    include: [
      { model: Repuesto, as: 'repuesto', attributes: ['id', 'nombre', 'referencia'] },
      { model: Usuario, as: 'aprobador', attributes: ['id', 'nombre', 'correo'] },
    ],
    limit,
    offset,
    order: [['id', 'DESC']],
  });
  return paginate(data, page, limit);
}

async function findById(id) {
  const sol = await SolicitudDeCompra.findByPk(id, {
    include: [
      { model: Repuesto, as: 'repuesto' },
      { model: Usuario, as: 'aprobador', attributes: ['id', 'nombre', 'correo'] },
    ],
  });
  if (!sol) {
    const err = new Error('Solicitud de compra no encontrada');
    err.statusCode = 404;
    throw err;
  }
  return sol;
}

/**
 * Crear solicitud de compra vinculada a un repuesto
 * @param {number} repuestoId
 * @param {object} data
 * @returns {Promise<object>}
 */
async function crearPorRepuesto(repuestoId, data, auditCtx) {
  const repuesto = await Repuesto.findByPk(repuestoId);
  if (!repuesto) {
    const err = new Error('Repuesto no encontrado');
    err.statusCode = 404;
    throw err;
  }

  // Calcular monto total
  const montoTotal = data.cantidad * (data.costoEstimado || repuesto.precio || 0);

  // Determinar si requiere aprobación
  const requiereAprobacion = montoTotal > MONTO_LIMITE_APROBACION;
  const estado = requiereAprobacion ? 'PENDIENTE' : 'APROBADA';

  data.repuestoId = repuestoId;
  data.fecha = data.fecha || new Date().toISOString().split('T')[0];
  data.montoTotal = montoTotal;
  data.estado = estado;
  
  // Si se aprueba automáticamente, registrar fecha y comentario
  if (!requiereAprobacion) {
    data.fechaAprobacion = new Date();
    data.comentariosAprobacion = 'Aprobación automática: el monto total no supera el umbral de aprobación administrativa.';
  }

  const sol = await SolicitudDeCompra.create(data);
  
  if (auditCtx) {
    await registrarAuditoria({
      usuarioId: auditCtx.usuarioId,
      ipAddress: auditCtx.ipAddress,
      accion: 'CREATE',
      entidad: 'SolicitudDeCompra',
      entidadId: sol.id,
      datosAnteriores: null,
      datosNuevos: sol.get({ plain: true }),
    });
  }

  return sol;
}

async function update(id, data, auditCtx) {
  const sol = await findById(id);
  const antes = sol.get({ plain: true });
  await sol.update(data);
  await sol.reload();
  const despues = sol.get({ plain: true });

  if (auditCtx) {
    let accion = 'UPDATE';
    if (despues.estado === 'APROBADA' && antes.estado !== 'APROBADA') accion = 'APPROVE';
    else if (despues.estado === 'RECHAZADA' && antes.estado !== 'RECHAZADA') accion = 'REJECT';

    await registrarAuditoria({
      usuarioId: auditCtx.usuarioId,
      ipAddress: auditCtx.ipAddress,
      accion,
      entidad: 'SolicitudDeCompra',
      entidadId: sol.id,
      datosAnteriores: accion === 'UPDATE' ? antes : null,
      datosNuevos: { ...despues, estadoAnterior: antes.estado },
    });
  }

  return sol;
}

async function remove(id, auditCtx) {
  const sol = await findById(id);
  const snapshot = sol.get({ plain: true });
  if (auditCtx) {
    await registrarAuditoria({
      usuarioId: auditCtx.usuarioId,
      ipAddress: auditCtx.ipAddress,
      accion: 'DELETE',
      entidad: 'SolicitudDeCompra',
      entidadId: sol.id,
      datosAnteriores: null,
      datosNuevos: snapshot,
    });
  }
  await sol.destroy();
}

/**
 * Aprobar solicitud de compra
 */
async function aprobar(id, aprobadorId, comentarios, auditCtx) {
  const solicitud = await findById(id);
  
  if (solicitud.estado !== 'PENDIENTE') {
    const err = new Error('Solo se pueden aprobar solicitudes en estado PENDIENTE');
    err.statusCode = 400;
    throw err;
  }

  const antes = solicitud.get({ plain: true });
  await solicitud.update({
    estado: 'APROBADA',
    aprobadorId,
    fechaAprobacion: new Date(),
    comentariosAprobacion: comentarios || 'Aprobado',
  });
  
  await solicitud.reload({
    include: [
      { model: Repuesto, as: 'repuesto' },
      { model: Usuario, as: 'aprobador', attributes: ['id', 'nombre', 'correo'] },
    ],
  });

  if (auditCtx) {
    await registrarAuditoria({
      usuarioId: auditCtx.usuarioId,
      ipAddress: auditCtx.ipAddress,
      accion: 'APPROVE',
      entidad: 'SolicitudDeCompra',
      entidadId: solicitud.id,
      datosAnteriores: null,
      datosNuevos: { ...solicitud.get({ plain: true }), estadoAnterior: antes.estado },
    });
  }

  return solicitud;
}

/**
 * Rechazar solicitud de compra
 */
async function rechazar(id, aprobadorId, comentarios, auditCtx) {
  const solicitud = await findById(id);
  
  if (solicitud.estado !== 'PENDIENTE') {
    const err = new Error('Solo se pueden rechazar solicitudes en estado PENDIENTE');
    err.statusCode = 400;
    throw err;
  }

  if (!comentarios) {
    const err = new Error('Los comentarios son obligatorios al rechazar');
    err.statusCode = 400;
    throw err;
  }

  const antes = solicitud.get({ plain: true });
  await solicitud.update({
    estado: 'RECHAZADA',
    aprobadorId,
    fechaAprobacion: new Date(),
    comentariosAprobacion: comentarios,
  });
  
  await solicitud.reload({
    include: [
      { model: Repuesto, as: 'repuesto' },
      { model: Usuario, as: 'aprobador', attributes: ['id', 'nombre', 'correo'] },
    ],
  });

  if (auditCtx) {
    await registrarAuditoria({
      usuarioId: auditCtx.usuarioId,
      ipAddress: auditCtx.ipAddress,
      accion: 'REJECT',
      entidad: 'SolicitudDeCompra',
      entidadId: solicitud.id,
      datosAnteriores: null,
      datosNuevos: { ...solicitud.get({ plain: true }), estadoAnterior: antes.estado },
    });
  }

  return solicitud;
}

/**
 * Registrar recepción de repuestos y actualizar inventario
 */
async function registrarRecepcion(id, auditCtx) {
  const solicitud = await findById(id);
  
  if (solicitud.estado !== 'APROBADA') {
    const err = new Error('Solo se pueden recibir solicitudes en estado APROBADA');
    err.statusCode = 400;
    throw err;
  }

  const transaction = await sequelize.transaction();
  
  try {
    const repuesto = await Repuesto.findByPk(solicitud.repuestoId, { transaction });
    const antesSol = solicitud.get({ plain: true });
    const antesRep = repuesto.get({ plain: true });

    // Actualizar inventario
    await repuesto.update(
      { stockActual: repuesto.stockActual + solicitud.cantidad },
      { transaction }
    );

    // Marcar como recibida
    await solicitud.update(
      {
        estado: 'RECIBIDA',
        fechaRecepcion: new Date(),
      },
      { transaction }
    );

    await transaction.commit();
    
    await solicitud.reload({
      include: [
        { model: Repuesto, as: 'repuesto' },
        { model: Usuario, as: 'aprobador', attributes: ['id', 'nombre', 'correo'] },
      ],
    });

    if (auditCtx) {
      await registrarAuditoria({
        usuarioId: auditCtx.usuarioId,
        ipAddress: auditCtx.ipAddress,
        accion: 'UPDATE',
        entidad: 'SolicitudDeCompra',
        entidadId: solicitud.id,
        datosAnteriores: antesSol,
        datosNuevos: {
          ...solicitud.get({ plain: true }),
          inventarioAnterior: antesRep.stockActual,
        },
      });
    }

    return solicitud;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

/**
 * Obtener solicitudes pendientes de aprobación
 */
async function findPendientes() {
  return await SolicitudDeCompra.findAll({
    where: { estado: 'PENDIENTE' },
    include: [
      { model: Repuesto, as: 'repuesto' },
      { model: Usuario, as: 'aprobador', attributes: ['id', 'nombre', 'correo'] },
    ],
    order: [['fecha', 'DESC']],
  });
}

module.exports = { 
  findAll, 
  findById, 
  crearPorRepuesto, 
  update, 
  remove,
  aprobar,
  rechazar,
  registrarRecepcion,
  findPendientes,
};
