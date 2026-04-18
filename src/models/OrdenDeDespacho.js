/**
 * @module models/OrdenDeDespacho
 * @description Modelo de Orden de Despacho del sistema Trans-Ruta
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrdenDeDespacho = sequelize.define('OrdenDeDespacho', {
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
  fechaCreacion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  fechaSalida: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  fechaEntregaEstimada: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  estado: {
    type: DataTypes.ENUM('DESPACHADO', 'EN_RUTA', 'CERCA_DEL_DESTINO', 'ENTREGADO', 'CANCELADO'),
    allowNull: false,
    defaultValue: 'DESPACHADO',
  },
  origen: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  destino: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pesoCarga: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  descripcionCarga: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  conductorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'conductores', key: 'id' },
  },
  vehiculoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'vehiculos', key: 'id' },
  },
  clienteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'clientes', key: 'id' },
  },
}, {
  tableName: 'ordenes_de_despacho',
  timestamps: true,
  underscored: true,
});

module.exports = OrdenDeDespacho;
