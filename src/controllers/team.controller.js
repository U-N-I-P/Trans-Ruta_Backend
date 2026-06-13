const { Team, Estudiante } = require('../models');

const createTeam = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'El nombre del equipo es obligatorio' });
    }
    const team = await Team.create({ name });
    return res.status(201).json(team);
  } catch (error) {
    return res.status(500).json({ error: 'Error al crear el equipo', details: error.message });
  }
};

const addStudentToTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { pin } = req.body;

    if (!pin) {
      return res.status(400).json({ error: 'El PIN es obligatorio' });
    }

    // Verificar si el equipo existe
    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }

    // Buscar estudiante por PIN
    const estudiante = await Estudiante.findOne({ where: { pin } });
    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado con el PIN proporcionado' });
    }

    // Verificar si el estudiante ya pertenece a un equipo
    if (estudiante.equipoId) {
      return res.status(400).json({ error: 'El estudiante ya pertenece a un equipo' });
    }

    // Asignar el estudiante al equipo
    estudiante.equipoId = team.id;
    await estudiante.save();

    return res.status(200).json({ message: 'Estudiante agregado al equipo exitosamente', estudiante });
  } catch (error) {
    return res.status(500).json({ error: 'Error al agregar estudiante al equipo', details: error.message });
  }
};

const getTeamStudents = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener equipo junto con sus estudiantes
    const team = await Team.findByPk(id, {
      include: [{
        model: Estudiante,
        as: 'estudiantes'
      }]
    });

    if (!team) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }

    // Retornar los estudiantes del equipo (o un arreglo vacío si no hay)
    return res.status(200).json(team.estudiantes || []);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener estudiantes del equipo', details: error.message });
  }
};

const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.findAll({
      include: [{
        model: Estudiante,
        as: 'estudiantes'
      }]
    });
    return res.status(200).json(teams);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener los equipos', details: error.message });
  }
};

module.exports = {
  createTeam,
  getAllTeams,
  addStudentToTeam,
  getTeamStudents,
};
