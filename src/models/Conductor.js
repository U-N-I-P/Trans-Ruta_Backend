/**
 * @module models/Conductor
 * @description Modelo de Conductor del sistema Trans-Ruta
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Conductor = sequelize.define('Conductor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cedula: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  numeroLicencia: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  categoriaLicencia: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fechaVencimientoLicencia: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  horasConducidas: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'usuarios', key: 'id' },
  },
}, {
  tableName: 'conductores',
  timestamps: true,
  underscored: true,
});

module.exports = Conductor;
