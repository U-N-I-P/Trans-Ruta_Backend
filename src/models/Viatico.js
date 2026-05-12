/**
 * @module models/Viatico
 * @description Modelo de Viático del sistema Trans-Ruta
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Viatico = sequelize.define('Viatico', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  monto: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('PENDIENTE', 'APROBADO', 'RECHAZADO', 'PAGADO'),
    allowNull: false,
  },
  conductorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'conductores', key: 'id' },
  },
  ordenDeDespachoId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'ordenes_de_despacho', key: 'id' },
  },
  saldo: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'viaticos',
  timestamps: true,
  underscored: true,
});

module.exports = Viatico;
