/**
 * @module middlewares/conductorOwnership.middleware
 * @description Middleware para validar que un conductor solo acceda a sus propios datos
 */

/**
 * Valida que el usuario autenticado sea el conductor dueño del recurso o un administrador
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function validateConductorOwnership(req, res, next) {
  try {
    const { conductorId } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
      });
    }

    // Si es ADMINISTRADOR, puede ver cualquier evaluación
    if (user.rol === 'ADMINISTRADOR') {
      return next();
    }

    // Si es CONDUCTOR, verificar que sea el dueño
    if (user.rol === 'CONDUCTOR') {
      // El conductorId del request debe coincidir con el conductorId del usuario
      // Nota: Asumimos que el usuario tiene un campo conductorId cuando es conductor
      if (user.conductorId && user.conductorId === parseInt(conductorId, 10)) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para acceder a las evaluaciones de otro conductor',
      });
    }

    // Cualquier otro rol no tiene acceso
    return res.status(403).json({
      success: false,
      message: 'No tienes permiso para acceder a este recurso',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Error al validar permisos',
      error: err.message,
    });
  }
}

module.exports = { validateConductorOwnership };
