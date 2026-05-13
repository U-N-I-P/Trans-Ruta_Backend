/**
 * @module models/AuditoriaLog
 * @description Registro inmutable de auditoría (HU-18)
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ACCIONES = [
  'CREATE',
  'UPDATE',
  'DELETE',
  'APPROVE',
  'REJECT',
  'ASSIGN',
  'LOGIN',
  'LOGOUT',
];

const AuditoriaLog = sequelize.define(
  'AuditoriaLog',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'usuario_id',
    },
    accion: {
      type: DataTypes.ENUM(...ACCIONES),
      allowNull: false,
    },
    entidad: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    entidadId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'entidad_id',
    },
    ipAddress: {
      type: DataTypes.STRING(64),
      allowNull: true,
      field: 'ip_address',
    },
    datosAnteriores: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'datos_anteriores',
    },
    datosNuevos: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'datos_nuevos',
    },
  },
  {
    tableName: 'auditoria_logs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true,
    hooks: {
      beforeUpdate() {
        throw new Error('Los registros de auditoría no pueden modificarse');
      },
      beforeDestroy() {
        throw new Error('Los registros de auditoría no pueden eliminarse');
      },
    },
  }
);

module.exports = AuditoriaLog;
