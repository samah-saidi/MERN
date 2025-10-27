const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Course title is required'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters long'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    code: {
        type: String,
        required: [true, 'Course code is required'],
        unique: true,
        uppercase: true,
        trim: true,
        match: [/^[A-Z]{2,4}\d{3,4}$/, 'Please provide a valid course code (e.g., CS101, MATH2001)']
    },
    description: {
        type: String,
        required: [true, 'Course description is required'],
        minlength: [10, 'Description must be at least 10 characters long'],
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    instructor: {
        type: String,
        required: [true, 'Instructor name is required'],
        trim: true
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true,
        enum: {
            values: ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Engineering', 'Business', 'Other'],
            message: '{VALUE} is not a valid department'
        }
    },
    semester: {
        type: String,
        required: [true, 'Semester is required'],
        enum: {
            values: ['Fall', 'Spring', 'Summer'],
            message: '{VALUE} is not a valid semester'
        }
    },
    year: {
        type: Number,
        required: [true, 'Year is required'],
        min: [2020, 'Year must be 2020 or later'],
        max: [2030, 'Year cannot exceed 2030']
    },
    capacity: {
        type: Number,
        required: [true, 'Course capacity is required'],
        min: [1, 'Capacity must be at least 1'],
        default: 30
    },
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    schedule: {
        days: {
            type: [String],
            enum: {
                values: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                message: '{VALUE} is not a valid day'
            }
        },
        time: {
            type: String,
            match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide a valid time format (HH:MM)']
        },
        room: {
            type: String,
            trim: true
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Course', courseSchema);