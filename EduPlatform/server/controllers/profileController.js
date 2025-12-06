const asyncHandler = require('express-async-handler');
const Profile = require('../models/Profile');
const User = require('../models/User');

// CREATE PROFILE
exports.createProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { bio, website } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const profile = await Profile.create({ user: userId, bio, website });
  res.status(201).json(profile);
});

// GET PROFILE
exports.getProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const profile = await Profile.findOne({ user: userId }).populate('user', 'username email');
  if (!profile) {
    res.status(404);
    throw new Error('Profile not found');
  }
  res.json(profile);
});

// UPDATE PROFILE
exports.updateProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const profile = await Profile.findOneAndUpdate({ user: userId }, req.body, { new: true });
  if (!profile) {
    res.status(404);
    throw new Error('Profile not found');
  }
  res.json(profile);
});
