/**
 * @module controllers/auth.controller
 * @description Controlador de autenticación
 */
const authService = require('../services/auth.service');
const { success } = require('../utils/response.helper');
const { getClientIp } = require('../utils/audit.util');
const { registrarAuditoria } = require('../services/auditoria.service');

async function login(req, res, next) {
  try {
    const data = await authService.login(req.body.correo, req.body.contrasena);
    await registrarAuditoria({
      usuarioId: data.usuario.id,
      ipAddress: getClientIp(req),
      accion: 'LOGIN',
      entidad: 'Sesion',
      entidadId: data.usuario.id,
      datosAnteriores: null,
      datosNuevos: { correo: data.usuario.correo, rol: data.usuario.rol },
    });
    return success(res, 'Inicio de sesión exitoso', data);
  } catch (err) { next(err); }
}

async function refresh(req, res, next) {
  try {
    const data = authService.refresh(req.user);
    return success(res, 'Token refrescado', data);
  } catch (err) { next(err); }
}

async function me(req, res, next) {
  try {
    const data = await authService.me(req.user.id);
    return success(res, 'Usuario autenticado', data);
  } catch (err) { next(err); }
}

module.exports = { login, refresh, me };
