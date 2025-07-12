// backend/routes/swapRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createSwapRequest, getMySwaps, updateSwapStatus } = require('../controllers/swapController');

// Export a function that takes `io` as an argument
module.exports = (io) => {
  const router = express.Router();

  // Pass `io` to the controller functions
  router.post('/', protect, (req, res) => createSwapRequest(req, res, io));
  router.get('/me', protect, getMySwaps); // getMySwaps doesn't need io directly for now
  router.put('/:id/status', protect, (req, res) => updateSwapStatus(req, res, io));

  return router;
};