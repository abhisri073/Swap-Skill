const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
// Assuming you have defined the admin controller functions as provided in Step 13
const { banUser, monitorPendingSwaps, generateReports, sendPlatformMessage } = require('../controllers/adminController');

// Export a function that accepts the 'io' instance (as configured in server.js)
module.exports = (io) => {
  const router = express.Router();

  // All routes require authentication (`protect`) and admin role (`admin`)
  router.post('/message', protect, admin, (req, res) => sendPlatformMessage(req, res, io));

  router.get('/reports', protect, admin, (req, res) => generateReports(req, res, io));
  // Note: We pass io to the controller functions if they need it for real-time updates
  router.put('/ban/:userId', protect, admin, (req, res) => banUser(req, res, io));
  
  router.get('/swaps/pending', protect, admin, (req, res) => monitorPendingSwaps(req, res, io));

  return router;
};