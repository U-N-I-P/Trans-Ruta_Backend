/**
 * @module services/conductor.service
 * @description Lógica de negocio para Conductores
 */
const { Op } = require('sequelize');
const { Conductor, Usuario } = require('../models');
const { getPagination, paginate } = require('../utils/pagination.helper');

async function findAll(query) {
  const { page, limit, offset } = getPagination(query);
  const data = await Conductor.findAndCountAll({
    include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'correo'] }],
    limit,
    offset,
    order: [['id', 'ASC']],
  });
  // Añadir campos calculados
  const items = data.rows.map((c) => {
    const json = c.toJSON();
    const hoy = new Date();
    const vencimiento = new Date(json.fechaVencimientoLicencia);
    const diffMs = vencimiento - hoy;
    json.diasParaVencimiento = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    json.licenciaVencida = json.diasParaVencimiento <= 0;
    return json;
  });
  return {
    items,
    pagination: paginate(data, page, limit).pagination,
  };
}

async function findById(id) {
  const conductor = await Conductor.findByPk(id, {
    include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'correo'] }],
  });
  if (!conductor) {
    const err = new Error('Conductor no encontrado');
    err.statusCode = 404;
    throw err;
  }
  const json = conductor.toJSON();
  const hoy = new Date();
  const vencimiento = new Date(json.fechaVencimientoLicencia);
  json.diasParaVencimiento = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));
  json.licenciaVencida = json.diasParaVencimiento <= 0;
  return json;
}

async function create(data) {
  return await Conductor.create(data);
}

async function update(id, data) {
  const conductor = await Conductor.findByPk(id);
  if (!conductor) {
    const err = new Error('Conductor no encontrado');
    err.statusCode = 404;
    throw err;
  }
  await conductor.update(data);
  return conductor;
}

async function remove(id) {
  const conductor = await Conductor.findByPk(id);
  if (!conductor) {
    const err = new Error('Conductor no encontrado');
    err.statusCode = 404;
    throw err;
  }
  await conductor.destroy();
}

/**
 * Licencias que vencen en los próximos 30 días
 * @returns {Promise<Array>}
 */
async function licenciasPorVencer() {
  const hoy = new Date();
  const en30 = new Date();
  en30.setDate(en30.getDate() + 30);
  const conductores = await Conductor.findAll({
    where: {
      fechaVencimientoLicencia: { [Op.between]: [hoy.toISOString().split('T')[0], en30.toISOString().split('T')[0]] },
    },
    order: [['fechaVencimientoLicencia', 'ASC']],
  });
  return conductores.map((c) => {
    const json = c.toJSON();
    json.diasParaVencimiento = Math.ceil((new Date(json.fechaVencimientoLicencia) - hoy) / (1000 * 60 * 60 * 24));
    return json;
  });
}

module.exports = { findAll, findById, create, update, remove, licenciasPorVencer };
