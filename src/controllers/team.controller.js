const { Team, Student } = require('../models');

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
    const student = await Student.findOne({ where: { pin } });
    if (!student) {
      return res.status(404).json({ error: 'Estudiante no encontrado con el PIN proporcionado' });
    }

    // Verificar si el estudiante ya pertenece a un equipo
    if (student.teamId) {
      return res.status(400).json({ error: 'El estudiante ya pertenece a un equipo' });
    }

    // Asignar el estudiante al equipo
    student.teamId = team.id;
    await student.save();

    return res.status(200).json({ message: 'Estudiante agregado al equipo exitosamente', student });
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
        model: Student,
        as: 'students' // Esto asume que la asociación en models/index.js se definirá con "as: 'students'"
      }]
    });

    if (!team) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }

    // Retornar los estudiantes del equipo (o un arreglo vacío si no hay)
    return res.status(200).json(team.students || []);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener estudiantes del equipo', details: error.message });
  }
};

module.exports = {
  createTeam,
  addStudentToTeam,
  getTeamStudents,
};
