const User = require('../models/User.js');

// @desc    Get user profile (protected route for the authenticated user)
// @route   GET /api/users/me
const getMyProfile = async (req, res) => {
  // req.user is set by the authMiddleware
  res.json(req.user); 
};

// @desc    Update user profile
// @route   PUT /api/users/me/update
const updateMyProfile = async (req, res) => {
  const { name, location, isPublic, skillsOffered, skillsWanted, availability } = req.body;
  
  const user = await User.findById(req.user.id);

  if (user) {
    // Update fields if provided
    user.name = name || user.name;
    user.location = location || user.location;
    user.isPublic = isPublic !== undefined ? isPublic : user.isPublic;
    user.skillsOffered = skillsOffered || user.skillsOffered;
    user.skillsWanted = skillsWanted || user.skillsWanted;
    user.availability = availability || user.availability;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Search for users by skill
// @route   GET /api/users/search?skill=photoshop
const searchUsersBySkill = async (req, res) => {
  const { skill } = req.query;

  if (!skill) {
    return res.status(400).json({ message: 'Please provide a skill to search for.' });
  }

  // Find users who offer the skill OR want the skill AND have a public profile
  const users = await User.find({
    isPublic: true,
    $or: [
      { skillsOffered: { $regex: skill, $options: 'i' } },
      { skillsWanted: { $regex: skill, $options: 'i' } }
    ]
  }).select('-password -email -__v'); // Exclude sensitive information

  res.json(users);
};

module.exports = { getMyProfile, updateMyProfile, searchUsersBySkill };