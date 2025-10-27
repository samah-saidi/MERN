const express = require('express');
const router = express.Router();
const { 
  createCourse, 
  getCourses, 
  enrollUserInCourse, 
  getCourseStudents 
} = require('../controllers/courseController');
const { 
  addReview, 
  getCourseReviews 
} = require('../controllers/reviewController');

router.route('/')
  .post(createCourse)
  .get(getCourses);

router.route('/:courseId/enroll')
  .post(enrollUserInCourse);

router.route('/:courseId/students')
  .get(getCourseStudents);

router.route('/:courseId/reviews')
  .post(addReview)
  .get(getCourseReviews);

module.exports = router;
