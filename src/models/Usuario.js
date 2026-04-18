/**
 * @module models/Usuario
 * @description Modelo de Usuario del sistema Trans-Ruta
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
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
  contrasena: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rol: {
    type: DataTypes.ENUM(
      'ADMINISTRADOR',
      'DESPACHADOR',
      'CONDUCTOR',
      'CLIENTE',
      'JEFE_TALLER',
      'GESTOR_INVENTARIO',
      'AUDITOR'
    ),
    allowNull: false,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'usuarios',
  timestamps: true,
  underscored: true,
});

module.exports = Usuario;
