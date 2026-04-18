/**
 * @module models/Notificacion
 * @description Modelo de Notificación del sistema Trans-Ruta
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notificacion = sequelize.define('Notificacion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM('ESTADO_ENVIO', 'INCIDENTE', 'STOCK_BAJO', 'MANTENIMIENTO', 'SISTEMA'),
    allowNull: false,
  },
  leida: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  destinatario: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  clienteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'clientes', key: 'id' },
  },
}, {
  tableName: 'notificaciones',
  timestamps: true,
  underscored: true,
});

module.exports = Notificacion;
