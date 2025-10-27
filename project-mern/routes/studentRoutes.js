const express = require('express');
const router = express.Router();
const { createStudent, getAllStudents, getStudentById, updateStudentById, deleteStudentById } = require('../controllers/studentController');

router.get('/students', getAllStudents);

router.post('/students', createStudent);

router.get('/students/:id', getStudentById);

router.put('/students/:id', updateStudentById);

router.delete('/students/:id', deleteStudentById);

module.exports = router;