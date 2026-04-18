/**
 * @module services/repuesto.service
 * @description Lógica de negocio para Repuestos — incluye verificación de stock bajo
 */
const { Op } = require('sequelize');
const { Repuesto, Notificacion, SolicitudDeCompra, Cliente } = require('../models');
const { getPagination, paginate } = require('../utils/pagination.helper');

async function findAll(query) {
  const { page, limit, offset } = getPagination(query);
  const data = await Repuesto.findAndCountAll({ limit, offset, order: [['id', 'ASC']] });
  return paginate(data, page, limit);
}

async function findById(id) {
  const repuesto = await Repuesto.findByPk(id);
  if (!repuesto) {
    const err = new Error('Repuesto no encontrado');
    err.statusCode = 404;
    throw err;
  }
  return repuesto;
}

/**
 * Listar repuestos cuyo stock actual <= stock mínimo
 * @returns {Promise<Array>}
 */
async function stockBajo() {
  return await Repuesto.findAll({
    where: {
      stockActual: { [Op.lte]: sequelize.col('stock_minimo') },
    },
    order: [['stockActual', 'ASC']],
  });
}

// Alternativa más simple para stockBajo sin referencia a col
async function stockBajoSimple() {
  const repuestos = await Repuesto.findAll();
  return repuestos.filter((r) => r.stockActual <= r.stockMinimo);
}

async function create(data) {
  const repuesto = await Repuesto.create(data);
  await verificarStockBajo(repuesto);
  return repuesto;
}

async function update(id, data) {
  const repuesto = await findById(id);
  await repuesto.update(data);
  await verificarStockBajo(repuesto);
  return repuesto;
}

async function remove(id) {
  const repuesto = await findById(id);
  await repuesto.destroy();
}

/**
 * Verifica si el stock está bajo y genera notificación + solicitud de compra
 * @param {object} repuesto
 */
async function verificarStockBajo(repuesto) {
  if (repuesto.stockActual <= repuesto.stockMinimo) {
    // Buscar el primer cliente para la notificación (sistema interno)
    const primerCliente = await Cliente.findOne();
    if (primerCliente) {
      await Notificacion.create({
        mensaje: `Stock bajo para repuesto "${repuesto.nombre}": ${repuesto.stockActual} unidades (mínimo: ${repuesto.stockMinimo})`,
        fecha: new Date().toISOString().split('T')[0],
        tipo: 'STOCK_BAJO',
        destinatario: 'GESTOR_INVENTARIO,JEFE_TALLER',
        clienteId: primerCliente.id,
      });
    }

    // Crear solicitud de compra automática
    const existente = await SolicitudDeCompra.findOne({
      where: { repuestoId: repuesto.id, estado: 'PENDIENTE' },
    });
    if (!existente) {
      await SolicitudDeCompra.create({
        fecha: new Date().toISOString().split('T')[0],
        estado: 'PENDIENTE',
        descripcion: `Solicitud automática por stock bajo de ${repuesto.nombre}`,
        cantidad: repuesto.stockMinimo - repuesto.stockActual + 10,
        costoEstimado: repuesto.precio * (repuesto.stockMinimo - repuesto.stockActual + 10),
        repuestoId: repuesto.id,
      });
    }
  }
}

module.exports = { findAll, findById, stockBajo: stockBajoSimple, create, update, remove };
