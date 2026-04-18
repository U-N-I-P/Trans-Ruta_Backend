/**
 * @module models/Entrega
 * @description Modelo de Entrega del sistema Trans-Ruta
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Entrega = sequelize.define('Entrega', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fechaEntrega: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  firmaDigital: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fotografia: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  latitud: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  longitud: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  ordenDeDespachoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'ordenes_de_despacho', key: 'id' },
  },
}, {
  tableName: 'entregas',
  timestamps: true,
  underscored: true,
});

module.exports = Entrega;
