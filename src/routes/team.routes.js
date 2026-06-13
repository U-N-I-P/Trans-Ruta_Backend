const { Router } = require('express');
const { createTeam, addStudentToTeam, getTeamStudents } = require('../controllers/team.controller');

const router = Router();

router.post('/', createTeam);
router.post('/:id/students', addStudentToTeam);
router.get('/:id/students', getTeamStudents);

module.exports = router;
