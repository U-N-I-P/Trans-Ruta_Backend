/**
 * @module services/auditoria.service
 * @description Consulta y exportación de logs de auditoría (HU-18)
 */
const PDFDocument = require('pdfkit');
const { Op } = require('sequelize');
const { AuditoriaLog, Usuario } = require('../models');
const { getPagination, paginate } = require('../utils/pagination.helper');
const { sanitizeForAudit } = require('../utils/audit.util');

const MAX_EXPORT_ROWS_CSV = 2000;
const MAX_EXPORT_ROWS_PDF = 400;

/**
 * @param {object} payload
 * @param {number} payload.usuarioId
 * @param {string} payload.accion
 * @param {string} payload.entidad
 * @param {number|null} [payload.entidadId]
 * @param {string|null} [payload.ipAddress]
 * @param {object|null} [payload.datosAnteriores]
 * @param {object|null} [payload.datosNuevos]
 * @returns {Promise<void>}
 */
async function registrarAuditoria(payload) {
  try {
    const {
      usuarioId,
      accion,
      entidad,
      entidadId = null,
      ipAddress = null,
      datosAnteriores = null,
      datosNuevos = null,
    } = payload;

    if (!usuarioId || !accion || !entidad) return;

    const prev =
      accion === 'UPDATE' ? (datosAnteriores != null ? sanitizeForAudit(datosAnteriores) : null) : null;

    await AuditoriaLog.create({
      usuarioId,
      accion,
      entidad: String(entidad).slice(0, 120),
      entidadId: entidadId != null ? Number(entidadId) : null,
      ipAddress: ipAddress != null ? String(ipAddress).slice(0, 64) : null,
      datosAnteriores: prev,
      datosNuevos: datosNuevos != null ? sanitizeForAudit(datosNuevos) : null,
    });
  } catch (err) {
    console.error('Auditoría: no se pudo registrar el evento:', err.message);
  }
}

function buildWhere(query) {
  const where = {};

  if (query.usuarioId != null && query.usuarioId !== '') {
    const id = parseInt(query.usuarioId, 10);
    if (!Number.isNaN(id)) where.usuarioId = id;
  }

  if (query.accion) where.accion = query.accion;

  if (query.entidad && String(query.entidad).trim()) {
    where.entidad = { [Op.iLike]: `%${String(query.entidad).trim()}%` };
  }

  if (query.fechaInicio || query.fechaFin) {
    const cond = {};
    if (query.fechaInicio) {
      cond[Op.gte] = new Date(`${query.fechaInicio}T00:00:00.000Z`);
    }
    if (query.fechaFin) {
      const end = new Date(`${query.fechaFin}T23:59:59.999Z`);
      cond[Op.lte] = end;
    }
    where.createdAt = cond;
  }

  return where;
}

async function findAll(query) {
  const { page, limit, offset } = getPagination(query);
  const where = buildWhere(query);

  const data = await AuditoriaLog.findAndCountAll({
    where,
    include: [
      {
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'nombre', 'correo', 'rol'],
      },
    ],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });

  return paginate(data, page, limit);
}

async function findById(id) {
  const log = await AuditoriaLog.findByPk(id, {
    include: [{ model: Usuario, as: 'usuario', attributes: { exclude: ['contrasena'] } }],
  });
  if (!log) {
    const err = new Error('Registro de auditoría no encontrado');
    err.statusCode = 404;
    throw err;
  }
  return log;
}

async function findAllForExport(query, maxRows) {
  const where = buildWhere(query);
  return await AuditoriaLog.findAll({
    where,
    include: [
      {
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'nombre', 'correo', 'rol'],
      },
    ],
    order: [['createdAt', 'DESC']],
    limit: maxRows,
  });
}

function escapeCsvCell(value) {
  if (value == null) return '';
  const s = typeof value === 'object' ? JSON.stringify(value) : String(value);
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function buildCsv(rows) {
  const header = [
    'id',
    'usuario_id',
    'usuario_correo',
    'usuario_rol',
    'accion',
    'entidad',
    'entidad_id',
    'ip_address',
    'created_at',
    'datos_anteriores',
    'datos_nuevos',
  ];
  const lines = [header.map(escapeCsvCell).join(',')];
  for (const r of rows) {
    const u = r.usuario;
    const plain = r.get ? r.get({ plain: true }) : r;
    lines.push(
      [
        escapeCsvCell(plain.id),
        escapeCsvCell(plain.usuarioId),
        escapeCsvCell(u?.correo ?? ''),
        escapeCsvCell(u?.rol ?? ''),
        escapeCsvCell(plain.accion),
        escapeCsvCell(plain.entidad),
        escapeCsvCell(plain.entidadId ?? ''),
        escapeCsvCell(plain.ipAddress ?? ''),
        escapeCsvCell(plain.createdAt ? new Date(plain.createdAt).toISOString() : ''),
        escapeCsvCell(plain.datosAnteriores),
        escapeCsvCell(plain.datosNuevos),
      ].join(',')
    );
  }
  return `\uFEFF${lines.join('\r\n')}`;
}

function buildPdfBuffer(rows) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('error', reject);
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    doc.fontSize(14).text('Trans-Ruta — Registro de auditoría', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(9).fillColor('#444').text(`Generado: ${new Date().toISOString()} — máx. ${MAX_EXPORT_ROWS_PDF} filas`);
    doc.moveDown(1);
    doc.fillColor('#000');

    if (!rows.length) {
      doc.fontSize(11).text('Sin registros para los filtros indicados.');
      doc.end();
      return;
    }

    rows.forEach((r, i) => {
      const plain = r.get ? r.get({ plain: true }) : r;
      const u = r.usuario;
      doc.fontSize(10).text(`#${plain.id} — ${plain.accion} — ${plain.entidad} (${plain.entidadId ?? '—'})`, {
        continued: false,
      });
      doc.fontSize(8).fillColor('#333');
      doc.text(
        `Usuario: ${u?.correo ?? plain.usuarioId} | IP: ${plain.ipAddress ?? '—'} | ${plain.createdAt ? new Date(plain.createdAt).toISOString() : ''}`
      );
      const prev = plain.datosAnteriores ? JSON.stringify(plain.datosAnteriores).slice(0, 400) : '—';
      const neu = plain.datosNuevos ? JSON.stringify(plain.datosNuevos).slice(0, 400) : '—';
      doc.text(`Anterior: ${prev}`);
      doc.text(`Nuevo: ${neu}`);
      doc.fillColor('#000');
      if (i < rows.length - 1) doc.moveDown(0.6);
    });

    doc.end();
  });
}

/**
 * @param {object} query
 * @param {'csv'|'pdf'} formato
 * @returns {Promise<{ body: Buffer|string, contentType: string, filename: string }>}
 */
async function exportar(query, formato) {
  const fmt = formato === 'pdf' ? 'pdf' : 'csv';
  if (fmt === 'pdf') {
    const rows = await findAllForExport(query, MAX_EXPORT_ROWS_PDF);
    const buffer = await buildPdfBuffer(rows);
    return {
      body: buffer,
      contentType: 'application/pdf',
      filename: `auditoria-${new Date().toISOString().slice(0, 10)}.pdf`,
    };
  }

  const rows = await findAllForExport(query, MAX_EXPORT_ROWS_CSV);
  return {
    body: buildCsv(rows),
    contentType: 'text/csv; charset=utf-8',
    filename: `auditoria-${new Date().toISOString().slice(0, 10)}.csv`,
  };
}

module.exports = {
  registrarAuditoria,
  findAll,
  findById,
  exportar,
};
