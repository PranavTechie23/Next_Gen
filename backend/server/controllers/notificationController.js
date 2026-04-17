const db = require('../config/db');

/**
 * INTERNAL FUNCTION: createNotification
 * Inserts a new notification into the notifications table.
 * @param {number} recipient_user_id - Matches users.id
 * @param {string} title - Title of the notification
 * @param {string} message - Content of the notification
 */
const createNotification = async (recipient_user_id, title, message) => {
    try {
        await db.execute(
            `INSERT INTO notifications 
            (recipient_user_id, title, message, is_read, created_at) 
            VALUES (?, ?, ?, FALSE, NOW())`,
            [recipient_user_id, title, message]
        );
    } catch (error) {
        console.error("Error creating internal notification:", error);
    }
};

/**
 * Route: GET /api/notifications
 * Behavior: Fetch notifications for logged-in user, order by latest first
 * Add filters (status) and pagination (page, limit)
 */
const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        let { status, page, limit } = req.query;

        console.log("🔥 Logged in user ID:", req.user.id);
        
        
        let queryBase = 'FROM notifications WHERE recipient_user_id = ?';
        const queryParams = [userId];

        if (status === 'unread') {
            queryBase += ' AND is_read = FALSE';
        } else if (status === 'read') {
            queryBase += ' AND is_read = TRUE';
        }

        // Fetch Total Count for pagination metadata
        const [countResult] = await db.execute(`SELECT COUNT(*) as total ${queryBase}`, queryParams);
        const total = countResult[0].total;

        // Pagination logic constraints
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const offset = (page - 1) * limit;

        // Safely inline parsed integers for LIMIT and OFFSET
        const query = `SELECT id, title, message, is_read, created_at ${queryBase} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
        
        const [notifications] = await db.execute(query, queryParams);

        res.status(200).json({
            count: notifications.length,
            total,
            page,
            limit,
            notifications
        });

    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Internal server error while fetching notifications." });
    }
};

/**
 * Route: PUT /api/notifications/:id/read
 * Behavior: Mark a notification as read and ensure ownership based on token
 */
const markAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const notificationId = req.params.id;

        // Ensure user can only mark their OWN notifications 
        const [result] = await db.execute(
            'UPDATE notifications SET is_read = TRUE WHERE id = ? AND recipient_user_id = ?',
            [notificationId, userId]
        );

        if (result.affectedRows === 0) {
            // Either ID is invalid, or the notification belongs to another user
            return res.status(403).json({ message: "Notification not found or you lack permission to update it." });
        }

        res.status(200).json({ message: "Notification marked as read successfully." });

    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({ message: "Internal server error while updating notification state." });
    }
};

/**
 * Route: GET /api/notifications/unread-count
 * Behavior: Return total unread notifications for logged-in user
 */
const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user.id;
        const [rows] = await db.execute(
            'SELECT COUNT(*) as unread_count FROM notifications WHERE recipient_user_id = ? AND is_read = FALSE',
            [userId]
        );
        res.status(200).json({ unread_count: rows[0].unread_count });
    } catch (error) {
        console.error("Error fetching unread count:", error);
        res.status(500).json({ message: "Internal server error while fetching unread count." });
    }
};

/**
 * Route: PUT /api/notifications/read-all
 * Behavior: Mark all notifications as read for logged-in user
 */
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const [result] = await db.execute(
            'UPDATE notifications SET is_read = TRUE WHERE recipient_user_id = ? AND is_read = FALSE',
            [userId]
        );
        res.status(200).json({ 
            message: "All notifications marked as read.",
            affectedRows: result.affectedRows 
        });
    } catch (error) {
        console.error("Error marking all as read:", error);
        res.status(500).json({ message: "Internal server error while updating notifications." });
    }
};

/**
 * Route: DELETE /api/notifications/:id
 * Behavior: Delete notification only if it belongs to user
 */
const deleteNotification = async (req, res) => {
    try {
        const userId = req.user.id;
        const notificationId = req.params.id;

        const [result] = await db.execute(
            'DELETE FROM notifications WHERE id = ? AND recipient_user_id = ?',
            [notificationId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(403).json({ message: "Notification not found or you lack permission to delete it." });
        }

        res.status(200).json({ message: "Notification deleted successfully." });
    } catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).json({ message: "Internal server error while deleting notification." });
    }
};

module.exports = {
    createNotification,
    getNotifications,
    markAsRead,
    getUnreadCount,
    markAllAsRead,
    deleteNotification
};
