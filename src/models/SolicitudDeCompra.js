/**
 * @module models/SolicitudDeCompra
 * @description Modelo de Solicitud de Compra del sistema Trans-Ruta
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SolicitudDeCompra = sequelize.define('SolicitudDeCompra', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('PENDIENTE', 'APROBADA', 'RECHAZADA', 'RECIBIDA'),
    allowNull: false,
    defaultValue: 'PENDIENTE',
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  costoEstimado: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  repuestoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'repuestos', key: 'id' },
  },
}, {
  tableName: 'solicitudes_de_compra',
  timestamps: true,
  underscored: true,
});

module.exports = SolicitudDeCompra;
