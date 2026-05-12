/**
 * @module models/GastoViatico
 * @description Modelo de Gasto individual de un Viático
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GastoViatico = sequelize.define('GastoViatico', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  monto: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  categoria: {
    type: DataTypes.ENUM('COMBUSTIBLE', 'PEAJES', 'ALIMENTACION', 'HOSPEDAJE', 'OTROS'),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fechaHora: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  evidenciaFotografica: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  estado: {
    type: DataTypes.ENUM('PENDIENTE', 'APROBADO', 'RECHAZADO'),
    allowNull: false,
    defaultValue: 'PENDIENTE',
  },
  comentariosAdmin: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  viaticoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'viaticos', key: 'id' },
  },
}, {
  tableName: 'gastos_viaticos',
  timestamps: true,
  underscored: true,
});

module.exports = GastoViatico;
