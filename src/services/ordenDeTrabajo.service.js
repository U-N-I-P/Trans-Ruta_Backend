/**
 * @module services/ordenDeTrabajo.service
 * @description Lógica de negocio para Órdenes de Trabajo
 */
const { OrdenDeTrabajo, Repuesto, PlanDeMantenimiento } = require('../models');
const { getPagination, paginate } = require('../utils/pagination.helper');

/**
 * Genera código OT-YYYYMMDD-XXXX
 * @returns {Promise<string>}
 */
async function generarCodigo() {
  const hoy = new Date();
  const fecha = hoy.toISOString().split('T')[0].replace(/-/g, '');
  const count = await OrdenDeTrabajo.count({
    where: { fechaApertura: hoy.toISOString().split('T')[0] },
  });
  const secuencial = String(count + 1).padStart(4, '0');
  return `OT-${fecha}-${secuencial}`;
}

async function findAll(query) {
  const { page, limit, offset } = getPagination(query);
  const data = await OrdenDeTrabajo.findAndCountAll({
    include: [
      { model: Repuesto, as: 'repuesto', attributes: ['id', 'nombre'] },
      { model: PlanDeMantenimiento, as: 'planesDeMantenimiento', attributes: ['id', 'nombre'], through: { attributes: [] } },
    ],
    limit,
    offset,
    order: [['id', 'DESC']],
  });
  return paginate(data, page, limit);
}

async function findById(id) {
  const ot = await OrdenDeTrabajo.findByPk(id, {
    include: [
      { model: Repuesto, as: 'repuesto' },
      { model: PlanDeMantenimiento, as: 'planesDeMantenimiento', through: { attributes: [] } },
    ],
  });
  if (!ot) {
    const err = new Error('Orden de trabajo no encontrada');
    err.statusCode = 404;
    throw err;
  }
  return ot;
}

async function create(data) {
  data.codigo = await generarCodigo();
  if (!data.fechaApertura) data.fechaApertura = new Date().toISOString().split('T')[0];
  return await OrdenDeTrabajo.create(data);
}

async function update(id, data) {
  const ot = await findById(id);
  await ot.update(data);
  return ot;
}

async function remove(id) {
  const ot = await findById(id);
  await ot.destroy();
}

module.exports = { findAll, findById, create, update, remove };
