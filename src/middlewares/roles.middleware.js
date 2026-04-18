/**
 * @module middlewares/roles
 * @description Verifica roles del usuario (RBAC)
 */
const { error } = require('../utils/response.helper');

/**
 * Retorna middleware que permite acceso solo a los roles indicados
 * @param  {...string} roles - Roles permitidos
 * @returns {import('express').RequestHandler}
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'No autenticado', 401);
    }
    if (!roles.includes(req.user.rol)) {
      return error(res, 'No tiene permisos para esta acción', 403);
    }
    next();
  };
}

module.exports = { authorize };
