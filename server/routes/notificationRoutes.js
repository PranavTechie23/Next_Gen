const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// Validates the JWT token payload and attaches `req.user`
router.use(protect);

// GET /api/notifications
// Retrieves users notifications descending (supports ?status & ?page & ?limit)
router.get('/', notificationController.getNotifications);

// GET /api/notifications/unread-count
// Retrieves total unread aggregate count
router.get('/unread-count', notificationController.getUnreadCount);

// PUT /api/notifications/read-all
// Marks all unread items strictly under this user as read
router.put('/read-all', notificationController.markAllAsRead);

// PUT /api/notifications/:id/read
// Marks a specific notification as read, bounded to the authenticated user
router.put('/:id/read', notificationController.markAsRead);

// DELETE /api/notifications/:id
// Removes a single notification, constrained by ownership
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
