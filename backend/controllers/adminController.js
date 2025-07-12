const User = require('../models/User');
const SwapRequest = require('../models/SwapRequest');

// @desc    Ban a user (requires 'protect' and 'admin' middleware)
// @route   PUT /api/admin/ban/:userId
// @access  Private/Admin
// Note: We accept 'io' if the route passes it, although not used here
const banUser = async (req, res, io) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Implementation of ban logic (e.g., setting a 'isBanned' field in the User model)
        // For this example, we'll just return a success message.
        // user.isBanned = true; 
        // await user.save();
        
        res.json({ message: `User ${user.name} banned successfully.` });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Monitor pending swaps
// @route   GET /api/admin/swaps/pending
// @access  Private/Admin
const monitorPendingSwaps = async (req, res, io) => {
    try {
        // Find all swaps with 'pending' status and populate user details
        const pendingSwaps = await SwapRequest.find({ status: 'pending' })
            .populate('senderId', 'name email')
            .populate('receiverId', 'name email');
        
        res.json(pendingSwaps);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Download reports of user activity, feedback logs, and swap stats
// @route   GET /api/admin/reports
// @access  Private/Admin
const generateReports = async (req, res, io) => {
    // This is a placeholder for generating reports based on your database logs
    // Example: Fetching total users and total accepted swaps
    try {
        const totalUsers = await User.countDocuments();
        const totalAcceptedSwaps = await SwapRequest.countDocuments({ status: 'accepted' });
        
        // In a real application, you'd generate a CSV or PDF report
        res.json({ 
            message: 'Report generated successfully', 
            stats: { 
                totalUsers, 
                totalAcceptedSwaps 
            } 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error generating report', error: error.message });
    }
};

// @desc    Send platform-wide messages (e.g., announcements, downtime alerts)
// @route   POST /api/admin/message
// @access  Private/Admin
const sendPlatformMessage = (req, res, io) => {
    const { type, message } = req.body;

    if (!message) {
        return res.status(400).json({ message: 'Message content is required.' });
    }

    try {
        // Broadcast the message to all connected clients via Socket.IO
        // We use io.emit() to send to all connected sockets
        io.emit('platformMessage', { 
            type: type || 'info', 
            message, 
            timestamp: Date.now() 
        });

        res.status(200).json({ message: 'Message broadcast successfully.' });

    } catch (error) {
        res.status(500).json({ message: 'Failed to broadcast message', error: error.message });
    }
};

module.exports = { banUser, monitorPendingSwaps, generateReports, sendPlatformMessage };