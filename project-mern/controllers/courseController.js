const Course = require('../models/Course');

// create new course
const createCourse = async (req, res) => {
    try {
        const course = await Course.create(req.body);
        
        res.status(201).json({
            success: true,
            data: course
        });
    } catch (error) {
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        }
        
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'Course code already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// get all courses
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('enrolledStudents', 'name email')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// get course by ID
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('enrolledStudents', 'name email');
        
        if (!course) {
            return res.status(404).json({
                success: false,
                error: 'Course not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error) {
        // Handle invalid ObjectId
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                error: 'Course not found'
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// update course by ID
const updateCourse = async (req, res) => {
    try {
        req.body.updatedAt = Date.now();
        
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        
        if (!course) {
            return res.status(404).json({
                success: false,
                error: 'Course not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error) {
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        }
        
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'Course code already exists'
            });
        }
        
        // Handle invalid ObjectId
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                error: 'Course not found'
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// partially update course by ID (params)
const patchCourse = async (req, res) => {
    try {
        req.body.updatedAt = Date.now();
        
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            {
                new: true,
                runValidators: true
            }
        );
        
        if (!course) {
            return res.status(404).json({
                success: false,
                error: 'Course not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error) {
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        }
        
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'Course code already exists'
            });
        }
        
        // Handle invalid ObjectId
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                error: 'Course not found'
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// delete course by ID
const deleteCourseById = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        
        if (!course) {
            return res.status(404).json({
                success: false,
                error: 'Course not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: {},
            message: 'Course deleted successfully'
        });
    } catch (error) {
        // Handle invalid ObjectId
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                error: 'Course not found'
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    patchCourse,
    deleteCourseById
};