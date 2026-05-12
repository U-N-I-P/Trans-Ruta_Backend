/**
 * @module services/consumoCombustible.service
 * @description Lógica de negocio para Consumo de Combustible
 */
const { ConsumoCombustible, Vehiculo, OrdenDeDespacho } = require('../models');
const { getPagination, paginate } = require('../utils/pagination.helper');

async function findAll(query) {
  const { page, limit, offset } = getPagination(query);
  const data = await ConsumoCombustible.findAndCountAll({
    include: [
      { model: Vehiculo, as: 'vehiculo', attributes: ['id', 'placa'] },
      { model: OrdenDeDespacho, as: 'ordenDeDespacho', attributes: ['id', 'codigo'] }
    ],
    limit,
    offset,
    order: [['id', 'DESC']],
  });
  return paginate(data, page, limit);
}

async function findById(id) {
  const consumo = await ConsumoCombustible.findByPk(id, {
    include: [
      { model: Vehiculo, as: 'vehiculo' },
      { model: OrdenDeDespacho, as: 'ordenDeDespacho' }
    ],
  });
  if (!consumo) {
    const err = new Error('Registro de consumo no encontrado');
    err.statusCode = 404;
    throw err;
  }
  return consumo;
}

async function findByVehiculo(vehiculoId) {
  return await ConsumoCombustible.findAll({
    where: { vehiculoId },
    include: [{ model: OrdenDeDespacho, as: 'ordenDeDespacho', attributes: ['codigo'] }],
    order: [['id', 'DESC']]
  });
}

async function create(data) {
  // Validaciones
  if (data.kilometrajeFinal <= data.kilometrajeInicial) {
    const err = new Error('El kilometraje final debe ser mayor al inicial');
    err.statusCode = 400;
    throw err;
  }
  if (data.litrosCargados <= 0) {
    const err = new Error('Los litros cargados deben ser mayores a cero');
    err.statusCode = 400;
    throw err;
  }

  // Verificar la orden y el vehiculo
  const orden = await OrdenDeDespacho.findByPk(data.ordenDeDespachoId);
  if (!orden) {
    const err = new Error('Orden de despacho no encontrada');
    err.statusCode = 404;
    throw err;
  }
  
  // Calcular distancia y rendimiento (Km/L)
  const distancia = data.kilometrajeFinal - data.kilometrajeInicial;
  const rendimiento = distancia / data.litrosCargados;

  data.distanciaRecorrida = distancia;
  data.rendimiento = rendimiento;
  data.vehiculoId = orden.vehiculoId; // Asociarlo automáticamente al vehículo del viaje

  // Lógica de Alertas (Promedio histórico)
  const consumosHistoricos = await ConsumoCombustible.findAll({
    where: { vehiculoId: data.vehiculoId }
  });

  let generarAlerta = false;
  if (consumosHistoricos.length > 0) {
    const sumaRendimientos = consumosHistoricos.reduce((sum, item) => sum + item.rendimiento, 0);
    const promedioRendimiento = sumaRendimientos / consumosHistoricos.length;
    
    // Si el rendimiento actual es 20% más bajo que el promedio, alertar
    const umbral = promedioRendimiento * 0.8; 
    if (rendimiento < umbral) {
      generarAlerta = true;
      // Aquí se podría integrar con el módulo de Notificaciones para alertar al Jefe de Taller
      console.warn(`ALERTA: El vehículo de orden ${orden.codigo} tuvo un rendimiento de ${rendimiento.toFixed(2)} Km/L (Promedio histórico: ${promedioRendimiento.toFixed(2)} Km/L)`);
    }
  }

  const consumo = await ConsumoCombustible.create(data);
  return { consumo, generarAlerta };
}

module.exports = { findAll, findById, findByVehiculo, create };
