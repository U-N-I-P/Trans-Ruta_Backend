/**
 * @module services/gastoViatico.service
 * @description Lógica de negocio para Gastos de Viáticos
 */
const { GastoViatico, Viatico } = require('../models');

async function registrarGasto(data) {
  if (data.monto <= 0) {
    const err = new Error('El monto del gasto debe ser mayor a cero');
    err.statusCode = 400;
    throw err;
  }
  const viatico = await Viatico.findByPk(data.viaticoId);
  if (!viatico) {
    const err = new Error('Viático no encontrado');
    err.statusCode = 404;
    throw err;
  }
  data.estado = 'PENDIENTE';
  return await GastoViatico.create(data);
}

async function aprobarGasto(id, comentariosAdmin) {
  const gasto = await GastoViatico.findByPk(id);
  if (!gasto) {
    const err = new Error('Gasto no encontrado');
    err.statusCode = 404;
    throw err;
  }
  if (gasto.estado === 'APROBADO') {
    const err = new Error('Este gasto ya fue aprobado');
    err.statusCode = 400;
    throw err;
  }

  const viatico = await Viatico.findByPk(gasto.viaticoId);
  if (!viatico) {
    const err = new Error('Viático asociado no encontrado');
    err.statusCode = 404;
    throw err;
  }

  const nuevoSaldo = viatico.saldo - gasto.monto;
  let generarAlerta = false;

  if (nuevoSaldo < 0) {
     console.warn('ALERTA: El saldo del viático es negativo (sobregiro)');
     generarAlerta = true;
  }

  const porcentajeConsumido = ((viatico.monto - nuevoSaldo) / viatico.monto) * 100;
  if (porcentajeConsumido >= 90 && viatico.monto > 0) {
     console.warn('ALERTA: El viático ha excedido el 90% de consumo');
     generarAlerta = true;
  }

  await viatico.update({ saldo: nuevoSaldo });
  await gasto.update({ estado: 'APROBADO', comentariosAdmin });

  return { gasto, viatico, generarAlerta };
}

async function rechazarGasto(id, comentariosAdmin) {
  const gasto = await GastoViatico.findByPk(id);
  if (!gasto) {
    const err = new Error('Gasto no encontrado');
    err.statusCode = 404;
    throw err;
  }
  if (gasto.estado === 'APROBADO') {
    const viatico = await Viatico.findByPk(gasto.viaticoId);
    await viatico.update({ saldo: viatico.saldo + gasto.monto });
  }
  await gasto.update({ estado: 'RECHAZADO', comentariosAdmin });
  return gasto;
}

async function findByViatico(viaticoId) {
  return await GastoViatico.findAll({
    where: { viaticoId },
    order: [['fechaHora', 'DESC']]
  });
}

module.exports = { registrarGasto, aprobarGasto, rechazarGasto, findByViatico };
