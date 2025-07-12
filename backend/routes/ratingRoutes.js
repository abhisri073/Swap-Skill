const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { submitRating, getUserRatings } = require('../controllers/ratingController');

router.post('/', protect, submitRating); // Submit a rating (requires auth)
router.get('/:userId', getUserRatings); // Get user ratings (can be public)

module.exports = router;