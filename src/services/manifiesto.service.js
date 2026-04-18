/**
 * @module services/manifiesto.service
 * @description Generación de manifiestos de carga (RF18 - Ministerio de Transporte)
 */
const { OrdenDeDespacho, Conductor, Vehiculo, Cliente } = require('../models');

/**
 * Genera el manifiesto de carga para una orden de despacho
 * @param {number} ordenId
 * @returns {Promise<object>}
 */
async function generarManifiesto(ordenId) {
  const orden = await OrdenDeDespacho.findByPk(ordenId, {
    include: [
      { model: Conductor, as: 'conductor' },
      { model: Vehiculo, as: 'vehiculo' },
      { model: Cliente, as: 'cliente' },
    ],
  });

  if (!orden) {
    const err = new Error('Orden de despacho no encontrada');
    err.statusCode = 404;
    throw err;
  }

  // Validar límites legales colombianos de peso por tipo de vehículo
  const limitesLegales = {
    CAMION_CARGA_PESADA: 35000,
    TURBO: 10000,
    CAMIONETA: 3500,
  };

  const limiteKg = limitesLegales[orden.vehiculo.tipo] || 35000;
  const excedePeso = orden.pesoCarga > limiteKg;

  return {
    manifiesto: {
      numeroOrden: orden.codigo,
      conductor: {
        nombre: `${orden.conductor.nombre} ${orden.conductor.apellido}`,
        licencia: orden.conductor.numeroLicencia,
        categoriaLicencia: orden.conductor.categoriaLicencia,
      },
      vehiculo: {
        placa: orden.vehiculo.placa,
        tipo: orden.vehiculo.tipo,
        capacidadCarga: orden.vehiculo.capacidadCarga,
      },
      cliente: {
        nombre: orden.cliente.nombre,
        documento: orden.cliente.numeroDocumento,
      },
      carga: {
        origen: orden.origen,
        destino: orden.destino,
        descripcion: orden.descripcionCarga,
        pesoKg: orden.pesoCarga,
        limiteLegalKg: limiteKg,
        excedePesoLegal: excedePeso,
      },
      fechaSalida: orden.fechaSalida,
      fechaEntregaEstimada: orden.fechaEntregaEstimada,
      estado: orden.estado,
      generadoEn: new Date().toISOString(),
    },
  };
}

module.exports = { generarManifiesto };
