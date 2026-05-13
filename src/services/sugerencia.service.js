/**
 * @module services/sugerencia.service
 * @description Servicio para calcular sugerencias de asignación de vehículos y conductores
 */
const { Vehiculo, Conductor, OrdenDeDespacho, DocumentoVehicular, Incidente } = require('../models');
const { Op } = require('sequelize');

// Configuración de pesos para el scoring
const PESOS_VEHICULO = {
  CAPACIDAD: 30,
  ESTADO: 20,
  KILOMETRAJE: 25,
  DOCUMENTOS: 25,
};

const PESOS_CONDUCTOR = {
  LICENCIA: 30,
  DESCANSO: 30,
  EXPERIENCIA: 25,
  INCIDENTES: 15,
};

const PESOS_COMBINADO = {
  VEHICULO: 0.6,
  CONDUCTOR: 0.4,
};

// Categorías de licencia requeridas por tipo de vehículo
const CATEGORIAS_LICENCIA = {
  CAMION_CARGA_PESADA: ['C2', 'C3'],
  TURBO: ['C1', 'C2', 'C3'],
  CAMIONETA: ['B1', 'B2', 'C1', 'C2', 'C3'],
};

// Horas mínimas de descanso requeridas
const HORAS_DESCANSO_MINIMAS = 8;

/**
 * Calcula el score de idoneidad de un vehículo para una orden
 * @param {Object} vehiculo - Instancia del vehículo
 * @param {Number} pesoCarga - Peso de la carga en kg
 * @returns {Promise<Object>} { score, detalles, apto }
 */
async function calcularScoreVehiculo(vehiculo, pesoCarga) {
  let score = 0;
  const detalles = [];

  // 1. Capacidad de carga compatible (30 puntos)
  if (vehiculo.capacidadCarga < pesoCarga) {
    detalles.push('❌ Capacidad insuficiente');
    return { score: 0, detalles, apto: false };
  }

  const margen = ((vehiculo.capacidadCarga - pesoCarga) / vehiculo.capacidadCarga) * 100;
  
  if (margen <= 20) {
    // Óptimo: usa entre 80-100% de capacidad
    score += PESOS_VEHICULO.CAPACIDAD;
    detalles.push('Capacidad óptima (80-100% utilizada)');
  } else if (margen <= 50) {
    // Bueno: usa entre 50-80% de capacidad
    score += Math.round(PESOS_VEHICULO.CAPACIDAD * 0.67);
    detalles.push('Capacidad buena (50-80% utilizada)');
  } else {
    // Aceptable: usa menos del 50%
    score += Math.round(PESOS_VEHICULO.CAPACIDAD * 0.33);
    detalles.push('Capacidad aceptable (<50% utilizada)');
  }

  // 2. Estado DISPONIBLE (20 puntos)
  if (vehiculo.estado !== 'DISPONIBLE') {
    detalles.push(`❌ Estado: ${vehiculo.estado}`);
    return { score: 0, detalles, apto: false };
  }
  
  score += PESOS_VEHICULO.ESTADO;
  detalles.push('Estado: DISPONIBLE');

  // 3. Kilometraje acumulado (25 puntos) - distribuir desgaste equitativamente
  const ordenesCompletadas = await OrdenDeDespacho.count({
    where: {
      vehiculoId: vehiculo.id,
      estado: 'ENTREGADO',
    },
  });

  if (ordenesCompletadas === 0) {
    score += PESOS_VEHICULO.KILOMETRAJE;
    detalles.push('Vehículo nuevo (sin viajes previos)');
  } else if (ordenesCompletadas < 50) {
    score += Math.round(PESOS_VEHICULO.KILOMETRAJE * 0.8);
    detalles.push(`Bajo uso (${ordenesCompletadas} viajes)`);
  } else if (ordenesCompletadas < 100) {
    score += Math.round(PESOS_VEHICULO.KILOMETRAJE * 0.6);
    detalles.push(`Uso moderado (${ordenesCompletadas} viajes)`);
  } else {
    score += Math.round(PESOS_VEHICULO.KILOMETRAJE * 0.4);
    detalles.push(`Alto uso (${ordenesCompletadas} viajes)`);
  }

  // 4. Documentos vigentes (25 puntos)
  const hoy = new Date();
  const documentosVencidos = await DocumentoVehicular.count({
    where: {
      vehiculoId: vehiculo.id,
      fechaVencimiento: { [Op.lt]: hoy },
    },
  });

  if (documentosVencidos > 0) {
    detalles.push(`❌ Tiene ${documentosVencidos} documento(s) vencido(s)`);
    return { score: 0, detalles, apto: false };
  }
  
  score += PESOS_VEHICULO.DOCUMENTOS;
  detalles.push('Documentación al día');

  return { score, detalles, apto: true };
}

/**
 * Calcula el score de idoneidad de un conductor para una orden
 * @param {Object} conductor - Instancia del conductor
 * @param {String} tipoVehiculo - Tipo de vehículo asignado
 * @param {String} origen - Origen de la ruta
 * @param {String} destino - Destino de la ruta
 * @returns {Promise<Object>} { score, detalles, apto }
 */
async function calcularScoreConductor(conductor, tipoVehiculo, origen, destino) {
  let score = 0;
  const detalles = [];

  // 1. Licencia vigente y categoría adecuada (30 puntos)
  const hoy = new Date();
  const licenciaVigente = new Date(conductor.fechaVencimientoLicencia) > hoy;

  if (!licenciaVigente) {
    detalles.push('❌ Licencia vencida');
    return { score: 0, detalles, apto: false };
  }

  // Validar categoría según tipo de vehículo
  const categoriasValidas = CATEGORIAS_LICENCIA[tipoVehiculo] || [];
  
  if (!categoriasValidas.includes(conductor.categoriaLicencia)) {
    detalles.push(`❌ Categoría ${conductor.categoriaLicencia} no apta para ${tipoVehiculo}`);
    return { score: 0, detalles, apto: false };
  }
  
  score += PESOS_CONDUCTOR.LICENCIA;
  detalles.push(`Licencia ${conductor.categoriaLicencia} vigente`);

  // 2. Horas de descanso (30 puntos)
  const ultimaOrden = await OrdenDeDespacho.findOne({
    where: {
      conductorId: conductor.id,
      estado: 'ENTREGADO',
    },
    order: [['updated_at', 'DESC']],
  });

  if (!ultimaOrden) {
    score += PESOS_CONDUCTOR.DESCANSO;
    detalles.push('Conductor descansado (sin viajes recientes)');
  } else {
    const horasDesdeUltimoViaje = (Date.now() - new Date(ultimaOrden.updatedAt)) / (1000 * 60 * 60);
    
    if (horasDesdeUltimoViaje < HORAS_DESCANSO_MINIMAS) {
      detalles.push(`❌ Descanso insuficiente (${Math.floor(horasDesdeUltimoViaje)}h < ${HORAS_DESCANSO_MINIMAS}h requeridas)`);
      return { score: 0, detalles, apto: false };
    }
    
    score += PESOS_CONDUCTOR.DESCANSO;
    detalles.push(`Descansado (${Math.floor(horasDesdeUltimoViaje)}h desde último viaje)`);
  }

  // 3. Experiencia en la ruta (25 puntos)
  const viajesEnRuta = await OrdenDeDespacho.count({
    where: {
      conductorId: conductor.id,
      origen,
      destino,
      estado: 'ENTREGADO',
    },
  });

  if (viajesEnRuta >= 10) {
    score += PESOS_CONDUCTOR.EXPERIENCIA;
    detalles.push(`Experto en ruta (${viajesEnRuta} viajes)`);
  } else if (viajesEnRuta >= 5) {
    score += Math.round(PESOS_CONDUCTOR.EXPERIENCIA * 0.8);
    detalles.push(`Experiencia en ruta (${viajesEnRuta} viajes)`);
  } else if (viajesEnRuta >= 1) {
    score += Math.round(PESOS_CONDUCTOR.EXPERIENCIA * 0.6);
    detalles.push(`Conoce la ruta (${viajesEnRuta} viajes)`);
  } else {
    score += Math.round(PESOS_CONDUCTOR.EXPERIENCIA * 0.4);
    detalles.push('Sin experiencia en esta ruta');
  }

  // 4. Historial de incidentes (15 puntos)
  const incidentes = await Incidente.count({
    include: [
      {
        model: OrdenDeDespacho,
        as: 'ordenDeDespacho',
        where: { conductorId: conductor.id },
        required: true,
      },
    ],
  });

  if (incidentes === 0) {
    score += PESOS_CONDUCTOR.INCIDENTES;
    detalles.push('Sin incidentes registrados');
  } else if (incidentes <= 2) {
    score += Math.round(PESOS_CONDUCTOR.INCIDENTES * 0.67);
    detalles.push(`Pocos incidentes (${incidentes})`);
  } else if (incidentes <= 5) {
    score += Math.round(PESOS_CONDUCTOR.INCIDENTES * 0.33);
    detalles.push(`Varios incidentes (${incidentes})`);
  } else {
    detalles.push(`⚠️ Muchos incidentes (${incidentes})`);
  }

  return { score, detalles, apto: true };
}

/**
 * Obtiene sugerencias de vehículos y conductores para una orden
 * @param {Number} pesoCarga - Peso de la carga en kg
 * @param {String} origen - Origen de la ruta
 * @param {String} destino - Destino de la ruta
 * @param {Number} limite - Número máximo de sugerencias a retornar
 * @returns {Promise<Array>} Lista de sugerencias ordenadas por score
 */
async function obtenerSugerencias(pesoCarga, origen, destino, limite = 5) {
  // 1. Obtener todos los vehículos disponibles
  const vehiculos = await Vehiculo.findAll({
    where: { estado: 'DISPONIBLE' },
  });

  if (vehiculos.length === 0) {
    return [];
  }

  // 2. Calcular score para cada vehículo
  const vehiculosConScore = [];
  
  for (const vehiculo of vehiculos) {
    const resultado = await calcularScoreVehiculo(vehiculo, pesoCarga);
    
    if (resultado.apto) {
      vehiculosConScore.push({
        vehiculo: {
          id: vehiculo.id,
          placa: vehiculo.placa,
          tipo: vehiculo.tipo,
          capacidadCarga: vehiculo.capacidadCarga,
        },
        score: resultado.score,
        detalles: resultado.detalles,
      });
    }
  }

  // Ordenar por score descendente
  vehiculosConScore.sort((a, b) => b.score - a.score);

  // 3. Para cada vehículo sugerido, obtener conductores compatibles
  const sugerencias = [];
  const topVehiculos = vehiculosConScore.slice(0, limite);

  for (const vehiculoData of topVehiculos) {
    const conductores = await Conductor.findAll();
    const conductoresConScore = [];

    for (const conductor of conductores) {
      const resultado = await calcularScoreConductor(
        conductor,
        vehiculoData.vehiculo.tipo,
        origen,
        destino
      );

      if (resultado.apto) {
        conductoresConScore.push({
          conductor: {
            id: conductor.id,
            nombre: `${conductor.nombre} ${conductor.apellido}`,
            numeroLicencia: conductor.numeroLicencia,
            categoriaLicencia: conductor.categoriaLicencia,
          },
          score: resultado.score,
          detalles: resultado.detalles,
        });
      }
    }

    // Ordenar conductores por score
    conductoresConScore.sort((a, b) => b.score - a.score);

    if (conductoresConScore.length > 0) {
      // Score combinado: promedio ponderado (60% vehículo, 40% conductor)
      const mejorConductor = conductoresConScore[0];
      const scoreCombinado = Math.round(
        vehiculoData.score * PESOS_COMBINADO.VEHICULO +
        mejorConductor.score * PESOS_COMBINADO.CONDUCTOR
      );

      sugerencias.push({
        vehiculo: vehiculoData.vehiculo,
        conductor: mejorConductor.conductor,
        scoreVehiculo: vehiculoData.score,
        scoreConductor: mejorConductor.score,
        scoreCombinado,
        detallesVehiculo: vehiculoData.detalles,
        detallesConductor: mejorConductor.detalles,
        justificacion: `Score combinado: ${scoreCombinado}/100 (Vehículo: ${vehiculoData.score}, Conductor: ${mejorConductor.score})`,
      });
    }
  }

  // Ordenar por score combinado
  sugerencias.sort((a, b) => b.scoreCombinado - a.scoreCombinado);

  return sugerencias;
}

module.exports = {
  obtenerSugerencias,
  calcularScoreVehiculo,
  calcularScoreConductor,
};
