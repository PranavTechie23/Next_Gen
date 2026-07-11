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

// Proxy route to fetch DuckDuckGo favicons and filter out their generic 1478-byte placeholder
router.get('/company-logo', (req, res) => {
    const domain = req.query.domain;
    if (!domain) return res.status(400).send('Domain required');
    
    const https = require('https');
    https.get(`https://icons.duckduckgo.com/ip3/${domain}.ico`, (proxyRes) => {
        const chunks = [];
        proxyRes.on('data', chunk => chunks.push(chunk));
        proxyRes.on('end', () => {
            const buffer = Buffer.concat(chunks);
            // DuckDuckGo's missing icon placeholder is exactly 1478 bytes
            if (buffer.length === 1478 || proxyRes.statusCode === 404) {
                return res.status(404).send('Logo not found');
            }
            res.set('Content-Type', proxyRes.headers['content-type'] || 'image/x-icon');
            res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
            res.status(200).send(buffer);
        });
    }).on('error', () => {
        res.status(500).send('Error fetching proxy');
    });
});

module.exports = router;