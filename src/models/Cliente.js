/**
 * @module models/Cliente
 * @description Modelo de Cliente del sistema Trans-Ruta
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  direccion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tipoDocumento: {
    type: DataTypes.ENUM('CC', 'NIT', 'CE', 'PASAPORTE'),
    allowNull: false,
  },
  numeroDocumento: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'usuarios', key: 'id' },
  },
}, {
  tableName: 'clientes',
  timestamps: true,
  underscored: true,
});

module.exports = Cliente;
