// backend/controllers/swapController.js
const SwapRequest = require('../models/SwapRequest');
const User = require('../models/User'); // Import User model to get user details for notification

// @desc    Create a new swap request
// @route   POST /api/swaps
const createSwapRequest = async (req, res, io) => { // Accept io here
  const { receiverId, senderSkill, receiverSkill, message } = req.body;
  const senderId = req.user._id; // User ID from `protect` middleware

  try {
    const swap = await SwapRequest.create({
      senderId,
      receiverId,
      senderSkill,
      receiverSkill,
      message,
    });

    // Populate sender and receiver details for a richer notification
    const populatedSwap = await SwapRequest.findById(swap._id)
      .populate('senderId', 'name profilePhoto')
      .populate('receiverId', 'name profilePhoto');

    // Emit Socket.IO notification to the receiver
    // We send to the specific room named after the receiver's userId
    io.to(receiverId.toString()).emit('newSwapRequest', {
      message: `New swap request from ${populatedSwap.senderId.name} for ${populatedSwap.senderSkill}!`,
      swap: populatedSwap
    });
    console.log(`Emitted 'newSwapRequest' to ${receiverId}`);

    res.status(201).json(populatedSwap);
  } catch (error) {
    console.error('Error creating swap request:', error);
    res.status(500).json({ message: 'Error creating swap request', error: error.message });
  }
};

// @desc    Get all pending, accepted, or rejected swaps for the user
// @route   GET /api/swaps/me
const getMySwaps = async (req, res) => {
  const userId = req.user._id;

  try {
    // Find swaps where the user is either the sender or the receiver
    const swaps = await SwapRequest.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    }).populate('senderId', 'name profilePhoto') // Populate sender info
      .populate('receiverId', 'name profilePhoto') // Populate receiver info
      .sort({ createdAt: -1 });

    res.json(swaps);
  } catch (error) {
    console.error('Error fetching swaps:', error);
    res.status(500).json({ message: 'Error fetching swaps', error: error.message });
  }
};

// @desc    Accept/Reject/Cancel a swap request
// @route   PUT /api/swaps/:id/status
const updateSwapStatus = async (req, res, io) => { // Accept io here
  const { status } = req.body; // 'accepted', 'rejected', 'cancelled', 'deleted'
  const swapId = req.params.id;
  const userId = req.user._id;

  try {
    const swap = await SwapRequest.findById(swapId);

    if (!swap) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Authorization check:
    // Receiver can accept/reject
    // Sender can cancel/delete (if pending)
    const isReceiver = swap.receiverId.toString() === userId.toString();
    const isSender = swap.senderId.toString() === userId.toString();

    if ((status === 'accepted' || status === 'rejected') && !isReceiver) {
      return res.status(403).json({ message: 'Not authorized to accept/reject this request.' });
    } else if ((status === 'cancelled' || status === 'deleted') && !isSender) {
      return res.status(403).json({ message: 'Not authorized to cancel/delete this request.' });
    }

    // Specific requirement: User can delete if not accepted
    if (status === 'deleted' && swap.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot delete an accepted or already processed request.' });
    }
    
    // Prevent changing status if already accepted/rejected/cancelled/deleted, unless it's a 'deleted' action on a pending.
    if (swap.status !== 'pending' && status !== 'deleted') {
        return res.status(400).json({ message: `Cannot change status from ${swap.status}.` });
    }


    swap.status = status;
    const updatedSwap = await swap.save();

    // Populate sender and receiver details for a richer notification
    const populatedUpdatedSwap = await SwapRequest.findById(updatedSwap._id)
      .populate('senderId', 'name profilePhoto')
      .populate('receiverId', 'name profilePhoto');

    // Determine the other party to notify
    const otherPartyId = isSender ? populatedUpdatedSwap.receiverId._id.toString() : populatedUpdatedSwap.senderId._id.toString();
    const notificationMessage = isSender 
        ? `Your request for ${populatedUpdatedSwap.receiverSkill} from ${populatedUpdatedSwap.receiverId.name} was ${status}.`
        : `The swap request from ${populatedUpdatedSwap.senderId.name} for ${populatedUpdatedSwap.senderSkill} was ${status}.`;

    // Emit Socket.IO notification to the other party
    io.to(otherPartyId).emit('swapStatusUpdated', {
      message: notificationMessage,
      swap: populatedUpdatedSwap
    });
    console.log(`Emitted 'swapStatusUpdated' to ${otherPartyId}`);

    res.json(populatedUpdatedSwap);
  } catch (error) {
    console.error('Error updating swap status:', error);
    res.status(500).json({ message: 'Error updating swap status', error: error.message });
  }
};

module.exports = { createSwapRequest, getMySwaps, updateSwapStatus };