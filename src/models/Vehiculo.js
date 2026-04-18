/**
 * @module models/Vehiculo
 * @description Modelo de Vehículo del sistema Trans-Ruta
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vehiculo = sequelize.define('Vehiculo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  placa: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  tipo: {
    type: DataTypes.ENUM('CAMION_CARGA_PESADA', 'TURBO', 'CAMIONETA'),
    allowNull: false,
  },
  capacidadCarga: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  restricciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  estado: {
    type: DataTypes.ENUM('DISPONIBLE', 'EN_RUTA', 'EN_MANTENIMIENTO', 'FUERA_DE_SERVICIO'),
    allowNull: false,
  },
}, {
  tableName: 'vehiculos',
  timestamps: true,
  underscored: true,
});

module.exports = Vehiculo;
