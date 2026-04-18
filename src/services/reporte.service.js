/**
 * @module services/reporte.service
 * @description Lógica de negocio para Reportes
 */
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const { Reporte, OrdenDeDespacho, Entrega, Vehiculo } = require('../models');
const { getPagination, paginate } = require('../utils/pagination.helper');

async function findAll(query) {
  const { page, limit, offset } = getPagination(query);
  const data = await Reporte.findAndCountAll({ limit, offset, order: [['id', 'DESC']] });
  return paginate(data, page, limit);
}

async function findById(id) {
  const reporte = await Reporte.findByPk(id);
  if (!reporte) {
    const err = new Error('Reporte no encontrado');
    err.statusCode = 404;
    throw err;
  }
  return reporte;
}

/**
 * Generar reporte según tipo
 * @param {object} data - { tipo, formato, usuarioId, parametros }
 * @returns {Promise<object>}
 */
async function generar(data) {
  let contenido = {};

  switch (data.tipo) {
    case 'COMBUSTIBLE':
      contenido = await reporteCombustible(data.parametros ? JSON.parse(data.parametros) : {});
      break;
    case 'RUTAS_RENTABLES':
      contenido = await reporteRutasRentables();
      break;
    case 'CUMPLIMIENTO_ENTREGAS':
      contenido = await reporteCumplimiento();
      break;
    default:
      contenido = { mensaje: 'Tipo de reporte sin implementación detallada' };
  }

  const reporte = await Reporte.create({
    tipo: data.tipo,
    fechaGeneracion: new Date().toISOString().split('T')[0],
    parametros: data.parametros || null,
    contenido: JSON.stringify(contenido),
    formato: data.formato || 'JSON',
    usuarioId: data.usuarioId,
  });
  return reporte;
}

/**
 * Reporte de combustible — agrupa órdenes por vehículo
 */
async function reporteCombustible(params) {
  const where = {};
  if (params.vehiculoId) where.vehiculoId = params.vehiculoId;

  const ordenes = await OrdenDeDespacho.findAll({
    where,
    include: [{ model: Vehiculo, as: 'vehiculo', attributes: ['id', 'placa', 'tipo'] }],
    attributes: ['vehiculoId', 'pesoCarga', 'origen', 'destino'],
    order: [['vehiculoId', 'ASC']],
  });

  // Agrupar por vehículo
  const agrupado = {};
  ordenes.forEach((o) => {
    const key = o.vehiculoId;
    if (!agrupado[key]) {
      agrupado[key] = { vehiculo: o.vehiculo, totalOrdenes: 0, pesoTotal: 0 };
    }
    agrupado[key].totalOrdenes++;
    agrupado[key].pesoTotal += o.pesoCarga;
  });

  return Object.values(agrupado);
}

/**
 * Rutas más rentables — agrupa por origen→destino
 */
async function reporteRutasRentables() {
  const ordenes = await OrdenDeDespacho.findAll({
    attributes: ['origen', 'destino', 'pesoCarga'],
  });

  const rutas = {};
  ordenes.forEach((o) => {
    const key = `${o.origen} → ${o.destino}`;
    if (!rutas[key]) {
      rutas[key] = { ruta: key, totalOrdenes: 0, pesoTotal: 0 };
    }
    rutas[key].totalOrdenes++;
    rutas[key].pesoTotal += o.pesoCarga;
  });

  return Object.values(rutas).sort((a, b) => b.totalOrdenes - a.totalOrdenes);
}

/**
 * Cumplimiento de entregas — compara fechas estimadas vs reales
 */
async function reporteCumplimiento() {
  const ordenes = await OrdenDeDespacho.findAll({
    where: { estado: 'ENTREGADO', fechaEntregaEstimada: { [Op.ne]: null } },
    include: [{ model: Entrega, as: 'entrega' }],
  });

  let aTiempo = 0;
  let tarde = 0;
  ordenes.forEach((o) => {
    if (o.entrega && o.fechaEntregaEstimada) {
      const estimada = new Date(o.fechaEntregaEstimada);
      const real = new Date(o.entrega.fechaEntrega);
      if (real <= estimada) aTiempo++;
      else tarde++;
    }
  });

  const total = aTiempo + tarde;
  return {
    totalEntregas: total,
    aTiempo,
    tarde,
    porcentajeCumplimiento: total > 0 ? ((aTiempo / total) * 100).toFixed(2) + '%' : '0%',
  };
}

async function remove(id) {
  const reporte = await findById(id);
  await reporte.destroy();
}

module.exports = { findAll, findById, generar, reporteCombustible, reporteRutasRentables, reporteCumplimiento, remove };
