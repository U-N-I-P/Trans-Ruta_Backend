/**
 * @module models/DocumentoVehicular
 * @description Modelo de Documento Vehicular del sistema Trans-Ruta
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DocumentoVehicular = sequelize.define('DocumentoVehicular', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tipo: {
    type: DataTypes.ENUM('SOAT', 'TECNOMECANICA', 'REVISION_GASES', 'POLIZA', 'TARJETA_OPERACION'),
    allowNull: false,
  },
  numero: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fechaExpedicion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  fechaVencimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  archivoAdjunto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  vehiculoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'vehiculos', key: 'id' },
  },
}, {
  tableName: 'documentos_vehiculares',
  timestamps: true,
  underscored: true,
});

module.exports = DocumentoVehicular;


