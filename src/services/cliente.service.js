/**
 * @module services/cliente.service
 * @description Lógica de negocio para Clientes
 */
const { Cliente, Usuario } = require('../models');
const { getPagination, paginate } = require('../utils/pagination.helper');

async function findAll(query) {
  const { page, limit, offset } = getPagination(query);
  const data = await Cliente.findAndCountAll({
    include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'correo'] }],
    limit,
    offset,
    order: [['id', 'ASC']],
  });
  return paginate(data, page, limit);
}

async function findById(id) {
  const cliente = await Cliente.findByPk(id, {
    include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'correo'] }],
  });
  if (!cliente) {
    const err = new Error('Cliente no encontrado');
    err.statusCode = 404;
    throw err;
  }
  return cliente;
}

async function create(data) {
  return await Cliente.create(data);
}

async function update(id, data) {
  const cliente = await findById(id);
  await cliente.update(data);
  return cliente;
}

async function remove(id) {
  const cliente = await findById(id);
  await cliente.destroy();
}

module.exports = { findAll, findById, create, update, remove };
