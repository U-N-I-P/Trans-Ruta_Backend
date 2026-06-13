const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Estudiante = sequelize.define('Estudiante', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pin: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
  },
  equipoId: {
    type: DataTypes.INTEGER,
    field: 'equipo_id',
    allowNull: true,
  },
}, {
  tableName: 'estudiantes',
  timestamps: true,
  underscored: true,
});

module.exports = Estudiante;
