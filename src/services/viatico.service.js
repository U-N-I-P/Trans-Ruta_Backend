/**
 * @module services/viatico.service
 * @description Lógica de negocio para Viáticos
 */
const { Viatico, Conductor } = require('../models');
const { getPagination, paginate } = require('../utils/pagination.helper');

async function findAll(query) {
  const { page, limit, offset } = getPagination(query);
  const data = await Viatico.findAndCountAll({
    include: [{ model: Conductor, as: 'conductor', attributes: ['id', 'nombre', 'apellido'] }],
    limit,
    offset,
    order: [['id', 'ASC']],
  });
  return paginate(data, page, limit);
}

async function findById(id) {
  const viatico = await Viatico.findByPk(id, {
    include: [{ model: Conductor, as: 'conductor', attributes: ['id', 'nombre', 'apellido'] }],
  });
  if (!viatico) {
    const err = new Error('Viático no encontrado');
    err.statusCode = 404;
    throw err;
  }
  return viatico;
}

async function create(data) {
  return await Viatico.create(data);
}

async function update(id, data) {
  const viatico = await findById(id);
  await viatico.update(data);
  return viatico;
}

async function remove(id) {
  const viatico = await findById(id);
  await viatico.destroy();
}

module.exports = { findAll, findById, create, update, remove };
