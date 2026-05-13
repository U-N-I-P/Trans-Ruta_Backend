/**
 * @module models/EvaluacionConductor
 * @description Modelo para evaluaciones de desempeño de conductores
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EvaluacionConductor = sequelize.define(
  'EvaluacionConductor',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    conductorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'conductor_id',
      references: { model: 'conductores', key: 'id' },
    },
    periodo: {
      type: DataTypes.STRING(7),
      allowNull: false,
      validate: {
        is: /^\d{4}-\d{2}$/,
      },
      comment: 'Periodo de evaluación en formato YYYY-MM',
    },
    scoreTotal: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      field: 'score_total',
      validate: {
        min: 0,
        max: 100,
      },
    },
    scorePuntualidad: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      field: 'score_puntualidad',
      validate: {
        min: 0,
        max: 30,
      },
    },
    scoreIncidentes: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      field: 'score_incidentes',
      validate: {
        min: 0,
        max: 25,
      },
    },
    scoreCombustible: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      field: 'score_combustible',
      validate: {
        min: 0,
        max: 20,
      },
    },
    scoreCalificacionClientes: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: 'score_calificacion_clientes',
      validate: {
        min: 0,
        max: 15,
      },
    },
    scoreCumplimientoProtocolos: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      field: 'score_cumplimiento_protocolos',
      validate: {
        min: 0,
        max: 10,
      },
    },
    entregasTotales: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'entregas_totales',
      validate: {
        min: 0,
      },
    },
    entregasATiempo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'entregas_a_tiempo',
      validate: {
        min: 0,
      },
    },
    incidentesTotales: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'incidentes_totales',
      validate: {
        min: 0,
      },
    },
    rendimientoPromedio: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
      field: 'rendimiento_promedio',
      validate: {
        min: 0,
      },
    },
    comentariosAdmin: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'comentarios_admin',
    },
  },
  {
    tableName: 'evaluaciones_conductores',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['conductor_id'] },
      { fields: ['periodo'] },
      { fields: ['score_total'] },
      { fields: ['conductor_id', 'periodo'], unique: true },
    ],
  }
);

module.exports = EvaluacionConductor;
