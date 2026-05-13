/**
 * @module services/evaluacion.service
 * @description Servicio para calcular y gestionar evaluaciones de desempeño de conductores
 */
const {
  EvaluacionConductor,
  Conductor,
  OrdenDeDespacho,
  Entrega,
  Incidente,
  ConsumoCombustible,
  Vehiculo,
  Notificacion,
} = require('../models');
const { Op } = require('sequelize');

// Configuración de pesos para el scoring
const PESOS = {
  PUNTUALIDAD: 30,
  INCIDENTES: 25,
  COMBUSTIBLE: 20,
  CALIFICACION_CLIENTES: 15,
  CUMPLIMIENTO_PROTOCOLOS: 10,
};

// Umbral de bajo desempeño
const UMBRAL_BAJO_DESEMPENO = 60;

/**
 * Calcula las fechas de inicio y fin de un periodo
 * @param {String} periodo - Formato "YYYY-MM"
 * @returns {Object} { fechaInicio, fechaFin }
 */
function calcularRangoPeriodo(periodo) {
  const [year, month] = periodo.split('-').map(Number);
  const fechaInicio = new Date(year, month - 1, 1);
  const fechaFin = new Date(year, month, 0, 23, 59, 59, 999);
  return { fechaInicio, fechaFin };
}

/**
 * Calcula el score de puntualidad basado en entregas a tiempo
 * @param {Array} ordenes - Órdenes de despacho del periodo
 * @returns {Object} { score, entregasATiempo, entregasTotales }
 */
function calcularScorePuntualidad(ordenes) {
  let entregasATiempo = 0;
  const entregasTotales = ordenes.length;

  ordenes.forEach((orden) => {
    if (orden.entrega && orden.fechaEntregaEstimada) {
      const fechaEstimada = new Date(orden.fechaEntregaEstimada);
      const fechaReal = new Date(orden.entrega.fechaHoraEntrega);
      
      if (fechaReal <= fechaEstimada) {
        entregasATiempo++;
      }
    }
  });

  const porcentajePuntualidad = entregasTotales > 0 ? (entregasATiempo / entregasTotales) * 100 : 0;
  const score = Math.round((porcentajePuntualidad / 100) * PESOS.PUNTUALIDAD * 100) / 100;

  return { score, entregasATiempo, entregasTotales };
}

/**
 * Calcula el score de incidentes
 * @param {Number} incidentes - Número de incidentes
 * @returns {Number} Score de incidentes
 */
function calcularScoreIncidentes(incidentes) {
  if (incidentes === 0) return PESOS.INCIDENTES;
  if (incidentes === 1) return 20;
  if (incidentes === 2) return 15;
  if (incidentes === 3) return 10;
  if (incidentes === 4) return 5;
  return 0;
}

/**
 * Calcula el score de rendimiento de combustible
 * @param {Array} consumos - Consumos de combustible del periodo
 * @param {String} tipoVehiculo - Tipo de vehículo del conductor
 * @returns {Promise<Object>} { score, rendimientoPromedio }
 */
async function calcularScoreCombustible(consumos, tipoVehiculo) {
  let score = PESOS.COMBUSTIBLE;
  let rendimientoPromedio = null;

  if (consumos.length === 0) {
    return { score, rendimientoPromedio };
  }

  // Calcular rendimiento promedio del conductor
  const rendimientos = consumos.map((c) => parseFloat(c.rendimiento)).filter((r) => r > 0);
  
  if (rendimientos.length === 0) {
    return { score, rendimientoPromedio };
  }

  rendimientoPromedio = rendimientos.reduce((a, b) => a + b, 0) / rendimientos.length;

  // Obtener promedio general del tipo de vehículo
  const consumosGenerales = await ConsumoCombustible.findAll({
    include: [
      {
        model: OrdenDeDespacho,
        as: 'ordenDeDespacho',
        required: true,
        include: [
          {
            model: Vehiculo,
            as: 'vehiculo',
            where: { tipo: tipoVehiculo },
            required: true,
          },
        ],
      },
    ],
    where: {
      rendimiento: { [Op.gt]: 0 },
    },
  });

  if (consumosGenerales.length === 0) {
    return { score, rendimientoPromedio };
  }

  const promedioTipo =
    consumosGenerales.reduce((sum, c) => sum + parseFloat(c.rendimiento), 0) / consumosGenerales.length;

  // Calcular diferencia porcentual
  const diferencia = ((rendimientoPromedio - promedioTipo) / promedioTipo) * 100;

  if (diferencia >= 10) {
    score = PESOS.COMBUSTIBLE; // 10% mejor o más
  } else if (diferencia >= 5) {
    score = 18; // 5-10% mejor
  } else if (diferencia >= 0) {
    score = 16; // Igual o ligeramente mejor
  } else if (diferencia >= -5) {
    score = 14; // Hasta 5% peor
  } else if (diferencia >= -10) {
    score = 12; // 5-10% peor
  } else if (diferencia >= -15) {
    score = 10; // 10-15% peor
  } else if (diferencia >= -20) {
    score = 8; // 15-20% peor
  } else {
    score = 5; // Más de 20% peor
  }

  return { score, rendimientoPromedio };
}

/**
 * Calcula el score de cumplimiento de protocolos
 * @param {Array} ordenes - Órdenes de despacho del periodo
 * @returns {Number} Score de cumplimiento
 */
function calcularScoreCumplimientoProtocolos(ordenes) {
  let entregasCompletas = 0;

  ordenes.forEach((orden) => {
    if (orden.entrega && orden.entrega.firmaDigital) {
      entregasCompletas++;
    }
  });

  const porcentajeCumplimiento = ordenes.length > 0 ? (entregasCompletas / ordenes.length) * 100 : 0;
  return Math.round((porcentajeCumplimiento / 100) * PESOS.CUMPLIMIENTO_PROTOCOLOS * 100) / 100;
}

/**
 * Calcula la evaluación de un conductor para un periodo específico
 * @param {Number} conductorId - ID del conductor
 * @param {String} periodo - Formato "YYYY-MM"
 * @returns {Promise<Object>} Datos de la evaluación
 */
async function calcularEvaluacion(conductorId, periodo) {
  // Validar formato de periodo
  if (!/^\d{4}-\d{2}$/.test(periodo)) {
    const err = new Error('Formato de periodo inválido. Use YYYY-MM (ej: 2026-05)');
    err.statusCode = 400;
    throw err;
  }

  const { fechaInicio, fechaFin } = calcularRangoPeriodo(periodo);

  // Obtener órdenes del conductor en el periodo
  const ordenes = await OrdenDeDespacho.findAll({
    where: {
      conductorId,
      estado: 'ENTREGADO',
      createdAt: {
        [Op.between]: [fechaInicio, fechaFin],
      },
    },
    include: [
      { model: Entrega, as: 'entrega' },
      { model: Vehiculo, as: 'vehiculo' },
    ],
  });

  if (ordenes.length === 0) {
    const err = new Error('No hay datos suficientes para evaluar este periodo');
    err.statusCode = 400;
    throw err;
  }

  // 1. PUNTUALIDAD (30%)
  const { score: scorePuntualidad, entregasATiempo, entregasTotales } = calcularScorePuntualidad(ordenes);

  // 2. INCIDENTES (25%)
  const incidentesTotales = await Incidente.count({
    include: [
      {
        model: OrdenDeDespacho,
        as: 'ordenDeDespacho',
        where: {
          conductorId,
          createdAt: {
            [Op.between]: [fechaInicio, fechaFin],
          },
        },
        required: true,
      },
    ],
  });

  const scoreIncidentes = calcularScoreIncidentes(incidentesTotales);

  // 3. RENDIMIENTO DE COMBUSTIBLE (20%)
  const ordenesIds = ordenes.map((o) => o.id);
  const consumos = await ConsumoCombustible.findAll({
    where: {
      ordenDeDespachoId: { [Op.in]: ordenesIds },
    },
  });

  const tipoVehiculo = ordenes[0].vehiculo.tipo;
  const { score: scoreCombustible, rendimientoPromedio } = await calcularScoreCombustible(consumos, tipoVehiculo);

  // 4. CALIFICACIÓN DE CLIENTES (15%) - Por defecto máximo (no implementado aún)
  const scoreCalificacionClientes = PESOS.CALIFICACION_CLIENTES;

  // 5. CUMPLIMIENTO DE PROTOCOLOS (10%)
  const scoreCumplimientoProtocolos = calcularScoreCumplimientoProtocolos(ordenes);

  // SCORE TOTAL
  const scoreTotal =
    Math.round(
      (scorePuntualidad +
        scoreIncidentes +
        scoreCombustible +
        scoreCalificacionClientes +
        scoreCumplimientoProtocolos) *
        100
    ) / 100;

  return {
    conductorId,
    periodo,
    scoreTotal,
    scorePuntualidad,
    scoreIncidentes,
    scoreCombustible,
    scoreCalificacionClientes,
    scoreCumplimientoProtocolos,
    entregasTotales,
    entregasATiempo,
    incidentesTotales,
    rendimientoPromedio,
  };
}

/**
 * Genera evaluaciones para todos los conductores de un periodo
 * @param {String} periodo - Formato "YYYY-MM"
 * @returns {Promise<Array>} Evaluaciones generadas
 */
async function generarEvaluacionesMensuales(periodo) {
  // Validar formato de periodo
  if (!/^\d{4}-\d{2}$/.test(periodo)) {
    const err = new Error('Formato de periodo inválido. Use YYYY-MM (ej: 2026-05)');
    err.statusCode = 400;
    throw err;
  }

  const conductores = await Conductor.findAll();
  const evaluaciones = [];
  const errores = [];

  for (const conductor of conductores) {
    try {
      const datosEvaluacion = await calcularEvaluacion(conductor.id, periodo);

      // Crear o actualizar evaluación
      const [evaluacion] = await EvaluacionConductor.upsert(datosEvaluacion, {
        returning: true,
      });

      evaluaciones.push(evaluacion);

      // Verificar alertas (score < 60 por 2 meses consecutivos)
      if (evaluacion.scoreTotal < UMBRAL_BAJO_DESEMPENO) {
        await verificarAlertaBajoDesempeno(conductor.id, periodo);
      }
    } catch (err) {
      errores.push({
        conductorId: conductor.id,
        nombre: `${conductor.nombre} ${conductor.apellido}`,
        error: err.message,
      });
    }
  }

  return {
    evaluaciones,
    errores,
    resumen: {
      total: conductores.length,
      exitosas: evaluaciones.length,
      fallidas: errores.length,
    },
  };
}

/**
 * Verifica si un conductor tiene bajo desempeño por 2 meses consecutivos
 * @param {Number} conductorId - ID del conductor
 * @param {String} periodoActual - Periodo actual en formato YYYY-MM
 */
async function verificarAlertaBajoDesempeno(conductorId, periodoActual) {
  const [year, month] = periodoActual.split('-').map(Number);
  
  // Calcular periodo anterior
  let mesAnterior, yearAnterior;
  if (month === 1) {
    mesAnterior = 12;
    yearAnterior = year - 1;
  } else {
    mesAnterior = month - 1;
    yearAnterior = year;
  }
  
  const periodoAnterior = `${yearAnterior}-${String(mesAnterior).padStart(2, '0')}`;

  const evaluacionAnterior = await EvaluacionConductor.findOne({
    where: { conductorId, periodo: periodoAnterior },
  });

  if (evaluacionAnterior && evaluacionAnterior.scoreTotal < UMBRAL_BAJO_DESEMPENO) {
    // Crear notificación para el administrador
    const conductor = await Conductor.findByPk(conductorId);
    
    console.log(`⚠️ ALERTA: Conductor ${conductor.nombre} ${conductor.apellido} (ID: ${conductorId}) con bajo desempeño por 2 meses consecutivos`);
    
    // TODO: Integrar con sistema de notificaciones cuando esté disponible
    // await Notificacion.create({
    //   tipo: 'ALERTA_BAJO_DESEMPENO',
    //   mensaje: `Conductor ${conductor.nombre} ${conductor.apellido} tiene score menor a ${UMBRAL_BAJO_DESEMPENO} por 2 meses consecutivos`,
    //   destinatario: 'ADMINISTRADOR',
    // });
  }
}

/**
 * Obtiene el ranking de conductores de un periodo
 * @param {String} periodo - Formato "YYYY-MM"
 * @returns {Promise<Array>} Ranking de conductores
 */
async function obtenerRanking(periodo) {
  const evaluaciones = await EvaluacionConductor.findAll({
    where: { periodo },
    include: [
      {
        model: Conductor,
        as: 'conductor',
        attributes: ['id', 'nombre', 'apellido', 'cedula', 'numeroLicencia'],
      },
    ],
    order: [['scoreTotal', 'DESC']],
  });

  return evaluaciones.map((ev, index) => ({
    posicion: index + 1,
    conductor: {
      id: ev.conductor.id,
      nombre: `${ev.conductor.nombre} ${ev.conductor.apellido}`,
      cedula: ev.conductor.cedula,
      numeroLicencia: ev.conductor.numeroLicencia,
    },
    scoreTotal: parseFloat(ev.scoreTotal),
    entregasTotales: ev.entregasTotales,
    entregasATiempo: ev.entregasATiempo,
    incidentesTotales: ev.incidentesTotales,
    rendimientoPromedio: ev.rendimientoPromedio ? parseFloat(ev.rendimientoPromedio) : null,
    porcentajePuntualidad: ev.entregasTotales > 0 
      ? Math.round((ev.entregasATiempo / ev.entregasTotales) * 100) 
      : 0,
  }));
}

/**
 * Obtiene la evaluación de un conductor específico
 * @param {Number} conductorId - ID del conductor
 * @param {String} periodo - Formato "YYYY-MM"
 * @returns {Promise<Object>} Evaluación del conductor
 */
async function obtenerEvaluacionConductor(conductorId, periodo) {
  const evaluacion = await EvaluacionConductor.findOne({
    where: { conductorId, periodo },
    include: [
      {
        model: Conductor,
        as: 'conductor',
        attributes: ['id', 'nombre', 'apellido', 'cedula', 'numeroLicencia', 'categoriaLicencia'],
      },
    ],
  });

  if (!evaluacion) {
    const err = new Error('Evaluación no encontrada para este periodo');
    err.statusCode = 404;
    throw err;
  }

  return {
    id: evaluacion.id,
    periodo: evaluacion.periodo,
    conductor: {
      id: evaluacion.conductor.id,
      nombre: `${evaluacion.conductor.nombre} ${evaluacion.conductor.apellido}`,
      cedula: evaluacion.conductor.cedula,
      numeroLicencia: evaluacion.conductor.numeroLicencia,
      categoriaLicencia: evaluacion.conductor.categoriaLicencia,
    },
    scores: {
      total: parseFloat(evaluacion.scoreTotal),
      puntualidad: parseFloat(evaluacion.scorePuntualidad),
      incidentes: parseFloat(evaluacion.scoreIncidentes),
      combustible: parseFloat(evaluacion.scoreCombustible),
      calificacionClientes: evaluacion.scoreCalificacionClientes 
        ? parseFloat(evaluacion.scoreCalificacionClientes) 
        : null,
      cumplimientoProtocolos: parseFloat(evaluacion.scoreCumplimientoProtocolos),
    },
    metricas: {
      entregasTotales: evaluacion.entregasTotales,
      entregasATiempo: evaluacion.entregasATiempo,
      incidentesTotales: evaluacion.incidentesTotales,
      rendimientoPromedio: evaluacion.rendimientoPromedio 
        ? parseFloat(evaluacion.rendimientoPromedio) 
        : null,
      porcentajePuntualidad: evaluacion.entregasTotales > 0 
        ? Math.round((evaluacion.entregasATiempo / evaluacion.entregasTotales) * 100) 
        : 0,
    },
    comentariosAdmin: evaluacion.comentariosAdmin,
    createdAt: evaluacion.createdAt,
    updatedAt: evaluacion.updatedAt,
  };
}

/**
 * Agregar comentarios del administrador a una evaluación
 * @param {Number} id - ID de la evaluación
 * @param {String} comentarios - Comentarios del administrador
 * @returns {Promise<Object>} Evaluación actualizada
 */
async function agregarComentarios(id, comentarios) {
  const evaluacion = await EvaluacionConductor.findByPk(id);

  if (!evaluacion) {
    const err = new Error('Evaluación no encontrada');
    err.statusCode = 404;
    throw err;
  }

  await evaluacion.update({ comentariosAdmin: comentarios });

  return obtenerEvaluacionConductor(evaluacion.conductorId, evaluacion.periodo);
}

/**
 * Obtiene el historial de evaluaciones de un conductor
 * @param {Number} conductorId - ID del conductor
 * @param {Number} limite - Número máximo de evaluaciones a retornar
 * @returns {Promise<Array>} Historial de evaluaciones
 */
async function obtenerHistorialConductor(conductorId, limite = 12) {
  const evaluaciones = await EvaluacionConductor.findAll({
    where: { conductorId },
    order: [['periodo', 'DESC']],
    limit: limite,
  });

  return evaluaciones.map((ev) => ({
    periodo: ev.periodo,
    scoreTotal: parseFloat(ev.scoreTotal),
    entregasTotales: ev.entregasTotales,
    entregasATiempo: ev.entregasATiempo,
    incidentesTotales: ev.incidentesTotales,
  }));
}

module.exports = {
  calcularEvaluacion,
  generarEvaluacionesMensuales,
  obtenerRanking,
  obtenerEvaluacionConductor,
  agregarComentarios,
  obtenerHistorialConductor,
};
