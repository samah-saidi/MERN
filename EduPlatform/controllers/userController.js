const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// CREATE USER
exports.createUser = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  const user = await User.create({ username, email });
  res.status(201).json(user);
});

// GET ALL USERS
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// GET ONE USER (with courses)
exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate('courses', 'title');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json(user);
});
