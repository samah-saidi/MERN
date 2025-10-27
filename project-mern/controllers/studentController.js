const Student = require('../models/Student');

// Create New Student
const createStudent = async (req, res) => {
    try {
        const newStudent = new Student({
            username: req.body.username,
            studentId: req.body.studentId,
            age: req.body.age,
            email: req.body.email,
            password: req.body.password
        });
        
        const savedStudent = await newStudent.save();
        
        res.status(201).json({
            success: true,
            data: savedStudent
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
        
        // Handle duplicate key error (username, email, or studentId)
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            let message = '';
            
            if (field === 'username') {
                message = 'Username already exists';
            } else if (field === 'email') {
                message = 'Email already exists';
            } else if (field === 'studentId') {
                message = 'Student ID already exists';
            }
            
            return res.status(400).json({
                success: false,
                error: message
            });
        }
        
        // Generic server error
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }   
};

// Get All Students
const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().select('-password');
        
        res.status(200).json({
            success: true,
            count: students.length,
            data: students
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// Get Student by ID
const getStudentById = async (req, res) => {
    try {   
        const student = await Student.findById(req.params.id).select('-password');
        
        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        // Handle invalid ObjectId
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// Update Student by ID
const updateStudentById = async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { 
                new: true, 
                runValidators: true 
            }
        ).select('-password');

        if (!updatedStudent) {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: updatedStudent
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
            const field = Object.keys(error.keyPattern)[0];
            let message = '';
            
            if (field === 'username') {
                message = 'Username already exists';
            } else if (field === 'email') {
                message = 'Email already exists';
            } else if (field === 'studentId') {
                message = 'Student ID already exists';
            }
            
            return res.status(400).json({
                success: false,
                error: message
            });
        }
        
        // Handle invalid ObjectId
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// Delete Student by ID
const deleteStudentById = async (req, res) => {
    try {       
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        
        if (!deletedStudent) {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: {},
            message: 'Student deleted successfully'
        });
    } catch (error) {
        // Handle invalid ObjectId
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

module.exports = {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudentById,
    deleteStudentById
};