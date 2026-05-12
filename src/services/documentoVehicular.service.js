/**
 * @module services/documentoVehicular.service
 * @description Lógica de negocio para Documentos Vehiculares
 */
const { DocumentoVehicular, Vehiculo } = require('../models');
const { getPagination, paginate } = require('../utils/pagination.helper');
const { Op } = require('sequelize');

async function findAll(query) {
  const { page, limit, offset } = getPagination(query);
  const data = await DocumentoVehicular.findAndCountAll({
    include: [{ model: Vehiculo, as: 'vehiculo', attributes: ['id', 'placa'] }],
    limit,
    offset,
    order: [['fechaVencimiento', 'ASC']],
  });
  return paginate(data, page, limit);
}

async function findById(id) {
  const documento = await DocumentoVehicular.findByPk(id, {
    include: [{ model: Vehiculo, as: 'vehiculo' }],
  });
  if (!documento) {
    const err = new Error('Documento no encontrado');
    err.statusCode = 404;
    throw err;
  }
  return documento;
}

async function create(data) {
  return await DocumentoVehicular.create(data);
}

async function update(id, data) {
  const documento = await findById(id);
  await documento.update(data);
  return documento;
}

async function remove(id) {
  const documento = await findById(id);
  await documento.destroy();
}

/**
 * Obtiene documentos que están por vencer (<= 30 días)
 */
async function obtenerAlertasVencimiento() {
  const hoy = new Date();
  const en30Dias = new Date();
  en30Dias.setDate(hoy.getDate() + 30);

  const documentos = await DocumentoVehicular.findAll({
    where: {
      fechaVencimiento: {
        [Op.lte]: en30Dias.toISOString().split('T')[0],
      }
    },
    include: [{ model: Vehiculo, as: 'vehiculo', attributes: ['id', 'placa'] }],
    order: [['fechaVencimiento', 'ASC']],
  });

  return documentos.map(doc => {
    const faltan = Math.ceil((new Date(doc.fechaVencimiento) - hoy) / (1000 * 60 * 60 * 24));
    let nivel = 'INFO';
    if (faltan <= 7) nivel = 'CRITICO';
    else if (faltan <= 15) nivel = 'ALERTA';

    return {
      id: doc.id,
      vehiculoId: doc.vehiculoId,
      placa: doc.vehiculo.placa,
      tipo: doc.tipo,
      fechaVencimiento: doc.fechaVencimiento,
      diasFaltantes: faltan,
      nivelAlerta: nivel
    };
  });
}

module.exports = { findAll, findById, create, update, remove, obtenerAlertasVencimiento };
