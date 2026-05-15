/**
 * @module models/Incidente
 * @description Modelo de Incidente del sistema Trans-Ruta
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Incidente = sequelize.define('Incidente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  latitud: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  longitud: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  protocoloActivado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  estado: {
    type: DataTypes.ENUM('ABIERTO', 'EN_PROCESO', 'RESUELTO', 'CERRADO'),
    allowNull: false,
    defaultValue: 'ABIERTO',
  },
  ordenDeDespachoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'ordenes_de_despacho', key: 'id' },
  },
}, {
  tableName: 'incidentes',
  timestamps: true,
  underscored: true,
});

module.exports = Incidente;
