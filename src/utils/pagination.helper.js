/**
 * @module utils/pagination.helper
 * @description Lógica de paginación reutilizable para Sequelize
 */

/**
 * Extrae parámetros de paginación de la query string
 * @param {object} query - req.query
 * @returns {{ page: number, limit: number, offset: number }}
 */
function getPagination(query) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

/**
 * Formatea el resultado paginado
 * @param {{ count: number, rows: Array }} data - Resultado de findAndCountAll
 * @param {number} page
 * @param {number} limit
 * @returns {{ items: Array, pagination: object }}
 */
function paginate(data, page, limit) {
  const { count: total, rows: items } = data;
  const totalPages = Math.ceil(total / limit);
  return {
    items,
    pagination: { page, limit, total, totalPages },
  };
}

module.exports = { getPagination, paginate };
