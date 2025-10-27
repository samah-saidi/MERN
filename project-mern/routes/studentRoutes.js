const express = require('express');
const router = express.Router();
const { createStudent, getAllStudents, getStudentById, updateStudentById } = require('../controllers/studentController');

router.get('/students', getAllStudents);

router.post('/students', createStudent);

router.get('/students/:id', getStudentById);

router.put('/students/:id', updateStudentById);

module.exports = router;