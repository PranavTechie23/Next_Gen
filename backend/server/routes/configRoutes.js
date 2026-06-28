'use strict';

const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');

// Guard: fail fast at startup if controller methods are missing
if (typeof configController.getPublicConfig !== 'function') {
  throw new Error('configController.getPublicConfig is not a function. Check your controller exports.');
}

router.get('/public', configController.getPublicConfig);

module.exports = router;