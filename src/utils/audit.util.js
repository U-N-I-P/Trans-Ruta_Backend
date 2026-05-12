/**
 * @module utils/audit.util
 * @description Utilidades para contexto de auditoría (IP, snapshots seguros)
 */

/**
 * Obtiene la IP del cliente (respeta proxy cuando hay X-Forwarded-For)
 * @param {import('express').Request} req
 * @returns {string|null}
 */
function getClientIp(req) {
  if (!req) return null;
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length > 0) {
    return xff.split(',')[0].trim().slice(0, 64) || null;
  }
  const raw = req.socket?.remoteAddress || req.connection?.remoteAddress;
  return raw ? String(raw).slice(0, 64) : null;
}

/**
 * Convierte instancia Sequelize u objeto a plano
 * @param {*} row
 * @returns {object|null}
 */
function toPlain(row) {
  if (row == null) return null;
  if (typeof row.get === 'function') {
    return row.get({ plain: true });
  }
  if (typeof row.toJSON === 'function') {
    return row.toJSON();
  }
  return { ...row };
}

/**
 * Elimina datos sensibles antes de persistir en auditoría
 * @param {*} value
 * @returns {*}
 */
function sanitizeForAudit(value) {
  if (value == null) return null;
  const seen = new WeakSet();

  function walk(v) {
    if (v == null) return v;
    const t = typeof v;
    if (t === 'bigint') return v.toString();
    if (t !== 'object') return v;
    if (v instanceof Date) return v.toISOString();
    if (Array.isArray(v)) return v.map(walk);
    if (seen.has(v)) return '[Circular]';
    seen.add(v);

    const out = {};
    for (const [k, val] of Object.entries(v)) {
      if (/contrasena|password|token/i.test(k)) continue;
      out[k] = walk(val);
    }
    return out;
  }

  return walk(toPlain(value) ?? value);
}

/**
 * Contexto mínimo que los controladores pasan a servicios para registrar auditoría
 * @typedef {object} AuditContext
 * @property {number} usuarioId
 * @property {string|null} [ipAddress]
 */

/**
 * @param {import('express').Request} req
 * @returns {AuditContext|null}
 */
function buildAuditContext(req) {
  if (!req?.user?.id) return null;
  return { usuarioId: req.user.id, ipAddress: getClientIp(req) };
}

module.exports = { getClientIp, toPlain, sanitizeForAudit, buildAuditContext };
