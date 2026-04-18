/**
 * @module models/Repuesto
 * @description Modelo de Repuesto del sistema Trans-Ruta
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Repuesto = sequelize.define('Repuesto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  referencia: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  stockActual: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  stockMinimo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unidadMedida: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  precio: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
}, {
  tableName: 'repuestos',
  timestamps: true,
  underscored: true,
});

module.exports = Repuesto;
