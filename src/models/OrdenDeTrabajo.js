/**
 * @module models/OrdenDeTrabajo
 * @description Modelo de Orden de Trabajo del sistema Trans-Ruta
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrdenDeTrabajo = sequelize.define('OrdenDeTrabajo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  fechaApertura: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  fechaCierre: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('ABIERTA', 'EN_PROCESO', 'CERRADA', 'CANCELADA'),
    allowNull: false,
    defaultValue: 'ABIERTA',
  },
  costo: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  repuestoId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'repuestos', key: 'id' },
  },
}, {
  tableName: 'ordenes_de_trabajo',
  timestamps: true,
  underscored: true,
});

module.exports = OrdenDeTrabajo;
