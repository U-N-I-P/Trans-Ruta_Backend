const { Router } = require('express');
const { createTeam, getAllTeams, addStudentToTeam, getTeamStudents } = require('../controllers/team.controller');

const router = Router();

router.get('/', getAllTeams);
router.post('/', createTeam);
router.post('/:id/students', addStudentToTeam);
router.get('/:id/students', getTeamStudents);

module.exports = router;
