/**
 * @module services/reporte.service
 * @description Lógica de negocio para Reportes
 */
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const PDFDocument = require('pdfkit');
const { Reporte, OrdenDeDespacho, Entrega, Vehiculo } = require('../models');
const { getPagination, paginate } = require('../utils/pagination.helper');

const REPORTE_TITULOS = {
  COMBUSTIBLE: 'Reporte de Consumo de Combustible',
  RUTAS_RENTABLES: 'Reporte de Rutas Más Rentables',
  CUMPLIMIENTO_ENTREGAS: 'Reporte de Cumplimiento de Entregas',
  MANTENIMIENTO: 'Reporte de Mantenimiento',
  INVENTARIO: 'Reporte de Inventario',
};

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

/**
 * Da formato legible a un valor individual para mostrarlo en PDF/CSV.
 * @param {*} value
 * @returns {string}
 */
function formatValorReporte(value) {
  if (value === null || value === undefined) return '—';
  const str = typeof value === 'object' ? JSON.stringify(value) : String(value);
  // La fuente estándar de PDFKit (WinAnsi) no soporta ciertos símbolos Unicode
  return str.replace(/→/g, '->');
}

/**
 * Genera un PDF legible a partir del contenido (JSON) de un reporte.
 * @param {object} reporte - instancia o JSON del Reporte
 * @returns {Promise<Buffer>}
 */
function buildReportePdfBuffer(reporte) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('error', reject);
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    const titulo = REPORTE_TITULOS[reporte.tipo] || `Reporte: ${reporte.tipo}`;
    doc.fontSize(16).fillColor('#000').text('Trans-Ruta', { continued: false });
    doc.fontSize(13).text(titulo, { underline: true });
    doc.moveDown(0.3);

    doc.fontSize(9).fillColor('#444');
    doc.text(`Generado: ${new Date(reporte.fechaGeneracion).toLocaleDateString('es-CO')}`);
    if (reporte.parametros) {
      try {
        const params = JSON.parse(reporte.parametros);
        const paramsTexto = Object.entries(params).map(([k, v]) => `${k}: ${formatValorReporte(v)}`).join(', ');
        if (paramsTexto) doc.text(`Parámetros: ${paramsTexto}`);
      } catch {
        // parámetros no son JSON válido, se ignoran en el PDF
      }
    }
    doc.moveDown(1);
    doc.fillColor('#000');

    let contenido;
    try {
      contenido = reporte.contenido ? JSON.parse(reporte.contenido) : null;
    } catch {
      contenido = null;
    }

    const vacio = !contenido || (Array.isArray(contenido) && contenido.length === 0) || (typeof contenido === 'object' && Object.keys(contenido).length === 0);

    if (vacio) {
      doc.fontSize(11).text('No hay datos disponibles para los criterios seleccionados.');
      doc.end();
      return;
    }

    if (Array.isArray(contenido)) {
      contenido.forEach((item, i) => {
        doc.fontSize(10).fillColor('#000').text(`${i + 1}.`);
        doc.fontSize(9).fillColor('#333');
        Object.entries(item || {}).forEach(([campo, valor]) => {
          doc.text(`   ${campo}: ${formatValorReporte(valor)}`);
        });
        doc.fillColor('#000');
        if (i < contenido.length - 1) doc.moveDown(0.4);
      });
    } else {
      Object.entries(contenido).forEach(([campo, valor]) => {
        doc.fontSize(10).fillColor('#333').text(`${campo}: ${formatValorReporte(valor)}`);
      });
    }

    doc.end();
  });
}

/**
 * Genera un CSV a partir del contenido (JSON) de un reporte.
 * @param {object} reporte
 * @returns {string}
 */
function buildReporteCsv(reporte) {
  let contenido;
  try {
    contenido = reporte.contenido ? JSON.parse(reporte.contenido) : null;
  } catch {
    contenido = null;
  }

  if (!contenido) return '\uFEFFsin datos\r\n';

  const filas = Array.isArray(contenido) ? contenido : [contenido];
  if (filas.length === 0) return '\uFEFFsin datos\r\n';

  const columnas = Array.from(
    filas.reduce((acc, fila) => {
      Object.keys(fila || {}).forEach((k) => acc.add(k));
      return acc;
    }, new Set())
  );

  const escapeCsvCell = (value) => {
    if (value === null || value === undefined) return '';
    const str = typeof value === 'object' ? JSON.stringify(value) : String(value);
    if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
  };

  const lineas = [columnas.join(',')];
  filas.forEach((fila) => {
    lineas.push(columnas.map((c) => escapeCsvCell(fila?.[c])).join(','));
  });

  return `\uFEFF${lineas.join('\r\n')}`;
}

/**
 * Exporta un reporte existente como archivo descargable.
 * @param {number|string} id
 * @param {'pdf'|'csv'} formato
 * @returns {Promise<{ body: Buffer|string, contentType: string, filename: string }>}
 */
async function exportar(id, formato) {
  const reporte = await findById(id);
  const fmt = formato === 'csv' ? 'csv' : 'pdf';
  const base = `reporte-${reporte.tipo.toLowerCase().replace(/_/g, '-')}-${reporte.id}`;

  if (fmt === 'csv') {
    return {
      body: buildReporteCsv(reporte),
      contentType: 'text/csv; charset=utf-8',
      filename: `${base}.csv`,
    };
  }

  const buffer = await buildReportePdfBuffer(reporte);
  return {
    body: buffer,
    contentType: 'application/pdf',
    filename: `${base}.pdf`,
  };
}

module.exports = { findAll, findById, generar, reporteCombustible, reporteRutasRentables, reporteCumplimiento, remove, exportar };
