/**
 * @module models/Reporte
 * @description Modelo de Reporte del sistema Trans-Ruta
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reporte = sequelize.define('Reporte', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tipo: {
    type: DataTypes.ENUM('COMBUSTIBLE', 'RUTAS_RENTABLES', 'CUMPLIMIENTO_ENTREGAS', 'MANTENIMIENTO', 'INVENTARIO'),
    allowNull: false,
  },
  fechaGeneracion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  parametros: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  formato: {
    type: DataTypes.ENUM('JSON', 'CSV', 'PDF'),
    allowNull: false,
    defaultValue: 'JSON',
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'usuarios', key: 'id' },
  },
}, {
  tableName: 'reportes',
  timestamps: true,
  underscored: true,
});

module.exports = Reporte;
