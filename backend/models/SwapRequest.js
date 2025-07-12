const mongoose = require('mongoose');

const SwapRequestSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  senderSkill: { // The skill the sender is offering
    type: String,
    required: true,
  },
  receiverSkill: { // The skill the sender is requesting from the receiver
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled', 'deleted'],
    default: 'pending',
  },
  message: { // Optional message with the swap request
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('SwapRequest', SwapRequestSchema);