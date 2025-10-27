const express = require('express');
const router = express.Router();
const { createCourse, getAllCourses, getCourseById, updateCourse, patchCourse, deleteCourseById } = require('../controllers/courseController');

router.post('/courses', createCourse);

router.get('/courses', getAllCourses);  

router.get('/courses/:id', getCourseById);

router.put('/courses/:id', updateCourse);

router.patch('/courses/:id', patchCourse);

router.delete('/courses/:id', deleteCourseById);

module.exports = router;