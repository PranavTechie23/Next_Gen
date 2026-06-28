'use strict';

const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

// Guard: fail fast at startup if controller methods are missing
const requiredMethods = ['getTestimonials', 'getFaqs'];
requiredMethods.forEach((method) => {
  if (typeof publicController[method] !== 'function') {
    throw new Error(`publicController.${method} is not a function. Check your controller exports.`);
  }
});

router.get('/testimonials', publicController.getTestimonials);
router.get('/faqs',         publicController.getFaqs);

module.exports = router;