const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    username: {
        type: String,
        required:[ true, 'Student name is required' ],
        unique: true,
        minlength: [3, 'Name must be at least 3 characters long']
    },
    studentId: {
        type: String,
        unique: true,
        sparse: true
    },    
    age: {  
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long']
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    }

});
module.exports = mongoose.model('Student', studentSchema);