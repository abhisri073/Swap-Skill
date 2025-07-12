const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getMyProfile, updateMyProfile, searchUsersBySkill } = require('../controllers/userController');

router.get('/me', protect, getMyProfile);
router.put('/me/update', protect, updateMyProfile);
router.get('/search', searchUsersBySkill); // Can be public or protected depending on requirement

module.exports = router;