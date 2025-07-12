const Rating = require('../models/Rating');
const User = require('../models/User'); // Used to potentially update average rating on user profile
const SwapRequest = require('../models/SwapRequest'); // Used to verify swap status

// @desc    Submit a rating and feedback after a swap
// @route   POST /api/ratings
// @access  Private
const submitRating = async (req, res) => {
    const { ratedUserId, swapId, rating, comment } = req.body;
    const raterId = req.user._id; // User submitting the rating

    // Basic validation
    if (!ratedUserId || !rating) {
        return res.status(400).json({ message: 'Rated user ID and rating are required.' });
    }

    // Optional: Verify that the rating is associated with a completed swap between the two users
    if (swapId) {
        const swap = await SwapRequest.findById(swapId);
        if (!swap || swap.status !== 'accepted') {
            return res.status(400).json({ message: 'Rating must be associated with an accepted swap.' });
        }
        
        // Ensure the rater is a participant of the swap
        const isParticipant = (swap.senderId.toString() === raterId.toString() && swap.receiverId.toString() === ratedUserId) ||
                              (swap.receiverId.toString() === raterId.toString() && swap.senderId.toString() === ratedUserId);

        if (!isParticipant) {
            return res.status(403).json({ message: 'You can only rate participants of the swap.' });
        }
    }

    try {
        // Prevent duplicate ratings for the same swap/user pair (optional, but good practice)
        const existingRating = await Rating.findOne({ raterId, ratedUserId, swapId });
        if (existingRating) {
            return res.status(409).json({ message: 'You have already rated this user for this swap.' });
        }

        const newRating = await Rating.create({
            raterId,
            ratedUserId,
            swapId,
            rating,
            comment
        });

        // Optional: Update the average rating on the user profile (requires a separate update logic or aggregation)

        res.status(201).json(newRating);

    } catch (error) {
        res.status(500).json({ message: 'Error submitting rating', error: error.message });
    }
};

// @desc    Get ratings for a specific user
// @route   GET /api/ratings/:userId
// @access  Public
const getUserRatings = async (req, res) => {
    try {
        const ratings = await Rating.find({ ratedUserId: req.params.userId })
                                    .populate('raterId', 'name profilePhoto')
                                    .sort({ createdAt: -1 }); // Sort by newest first
        
        // Calculate average rating
        const averageRating = ratings.reduce((acc, current) => acc + current.rating, 0) / ratings.length;

        res.json({
            ratings,
            averageRating: averageRating || 0 // Default to 0 if no ratings
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ratings', error: error.message });
    }
};

module.exports = { submitRating, getUserRatings };