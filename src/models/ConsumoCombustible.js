/**
 * @module models/ConsumoCombustible
 * @description Modelo de Consumo de Combustible del sistema Trans-Ruta
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ConsumoCombustible = sequelize.define('ConsumoCombustible', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  kilometrajeInicial: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  kilometrajeFinal: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  litrosCargados: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  costoTotal: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  rendimiento: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  distanciaRecorrida: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  evidenciaFotografica: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ordenDeDespachoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'ordenes_de_despacho', key: 'id' },
  },
  vehiculoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'vehiculos', key: 'id' },
  },
}, {
  tableName: 'consumos_combustible',
  timestamps: true,
  underscored: true,
});

module.exports = ConsumoCombustible;
