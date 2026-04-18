/**
 * @module services/vehiculo.service
 * @description Lógica de negocio para Vehículos
 */
const { Vehiculo } = require('../models');
const { getPagination, paginate } = require('../utils/pagination.helper');

async function findAll(query) {
  const { page, limit, offset } = getPagination(query);
  const data = await Vehiculo.findAndCountAll({ limit, offset, order: [['id', 'ASC']] });
  return paginate(data, page, limit);
}

async function findById(id) {
  const vehiculo = await Vehiculo.findByPk(id);
  if (!vehiculo) {
    const err = new Error('Vehículo no encontrado');
    err.statusCode = 404;
    throw err;
  }
  return vehiculo;
}

async function create(data) {
  return await Vehiculo.create(data);
}

async function update(id, data) {
  const vehiculo = await findById(id);
  await vehiculo.update(data);
  return vehiculo;
}

async function remove(id) {
  const vehiculo = await findById(id);
  await vehiculo.destroy();
}

module.exports = { findAll, findById, create, update, remove };
