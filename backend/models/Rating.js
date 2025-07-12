const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  // The user who submitted the rating (the rater)
  raterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // The user who was rated (the rated user)
  ratedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // The swap associated with this rating (optional, but good for context)
  swapId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SwapRequest'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: false,
    trim: true
  },
}, { timestamps: true });

module.exports = mongoose.model('Rating', RatingSchema);