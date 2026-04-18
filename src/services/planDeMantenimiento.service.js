/**
 * @module services/planDeMantenimiento.service
 * @description Lógica de negocio para Planes de Mantenimiento
 */
const { PlanDeMantenimiento, Vehiculo } = require('../models');
const { getPagination, paginate } = require('../utils/pagination.helper');

async function findAll(query) {
  const { page, limit, offset } = getPagination(query);
  const data = await PlanDeMantenimiento.findAndCountAll({
    include: [{ model: Vehiculo, as: 'vehiculo', attributes: ['id', 'placa', 'tipo'] }],
    limit,
    offset,
    order: [['id', 'ASC']],
  });
  return paginate(data, page, limit);
}

async function findById(id) {
  const plan = await PlanDeMantenimiento.findByPk(id, {
    include: [{ model: Vehiculo, as: 'vehiculo' }],
  });
  if (!plan) {
    const err = new Error('Plan de mantenimiento no encontrado');
    err.statusCode = 404;
    throw err;
  }
  return plan;
}

async function create(data) {
  return await PlanDeMantenimiento.create(data);
}

async function update(id, data) {
  const plan = await findById(id);
  await plan.update(data);
  return plan;
}

async function remove(id) {
  const plan = await findById(id);
  await plan.destroy();
}

module.exports = { findAll, findById, create, update, remove };
