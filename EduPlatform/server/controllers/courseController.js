const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');
const User = require('../models/User');

// CREATE COURSE
const createCourse = asyncHandler(async (req, res) => {
  const { title, description, instructor } = req.body;
  const course = await Course.create({ title, description, instructor });
  res.status(201).json(course);
});

// GET ALL COURSES
const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

// GET COURSE BY ID
const getCourseById = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.courseId).populate('instructor', 'name email');
    if (!course) {
        res.status(404);    
        throw new Error('Course not found');
    }

    res.json(course);
});
// ENROLL USER IN COURSE
const enrollUserInCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.userId; // Extrait du token JWT par le middleware protect

  const course = await Course.findById(courseId);
  const user = await User.findById(userId);

  if (!course || !user) {
    res.status(404);
    throw new Error('Cours ou utilisateur non trouvé');
  }

  // Vérifier si l'utilisateur est déjà inscrit
  if (course.students.includes(userId)) {
    return res.status(400).json({ message: 'Vous êtes déjà inscrit à ce cours' });
  }

  course.students.push(userId);
  user.courses.push(courseId);

  await course.save();
  await user.save();

  res.status(200).json({ message: 'Inscription réussie' });
});

// GET STUDENTS OF COURSE
const getCourseStudents = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId).populate('students', 'username email');
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  res.json(course.students);
});

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  enrollUserInCourse,
  getCourseStudents
};
