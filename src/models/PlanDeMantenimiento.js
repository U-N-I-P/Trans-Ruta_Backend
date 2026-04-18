/**
 * @module models/PlanDeMantenimiento
 * @description Modelo de Plan de Mantenimiento del sistema Trans-Ruta
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PlanDeMantenimiento = sequelize.define('PlanDeMantenimiento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  frecuenciaKm: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  frecuenciaDias: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  tipoVehiculo: {
    type: DataTypes.ENUM('CAMION_CARGA_PESADA', 'TURBO', 'CAMIONETA'),
    allowNull: false,
  },
  vehiculoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'vehiculos', key: 'id' },
  },
}, {
  tableName: 'planes_de_mantenimiento',
  timestamps: true,
  underscored: true,
});

module.exports = PlanDeMantenimiento;
