'use strict';

const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Guard: fail fast at startup if controller methods are missing
const requiredMethods = ['getAllKits', 'getKitById'];
requiredMethods.forEach((method) => {
  if (typeof assessmentController[method] !== 'function') {
    throw new Error(`assessmentController.${method} is not a function. Check your controller exports.`);
  }
});

const studentOnly = [protect, authorize('STUDENT')];

router.get('/kits',     studentOnly, assessmentController.getAllKits);
router.get('/kits/:id', studentOnly, assessmentController.getKitById);

module.exports = router;