import { Notification } from '../Model/index.js';
import { Op } from 'sequelize';

// @desc    Get user's notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { unreadOnly, type, limit = 20, page = 1 } = req.query;

    const where = { userId };
    if (unreadOnly === 'true') where.isRead = false;
    if (type) where.type = type;

    const offset = (page - 1) * limit;

    const { count, rows: notifications } = await Notification.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const count = await Notification.count({
      where: {
        userId,
        isRead: false
      }
    });

    res.json({
      success: true,
      data: { unreadCount: count }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const notification = await Notification.findOne({
      where: { id, userId }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;

    await Notification.update(
      {
        isRead: true,
        readAt: new Date()
      },
      {
        where: {
          userId,
          isRead: false
        }
      }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const notification = await Notification.findOne({
      where: { id, userId }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.destroy();

    res.json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete all read notifications
// @route   DELETE /api/notifications/clear-read
// @access  Private
export const clearReadNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const deleted = await Notification.destroy({
      where: {
        userId,
        isRead: true
      }
    });

    res.json({
      success: true,
      message: `Deleted ${deleted} read notifications`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create notification (internal/admin)
// @route   POST /api/notifications
// @access  Private/Admin
export const createNotification = async (req, res, next) => {
  try {
    const { userId, type, title, message, data } = req.body;

    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      data
    });

    res.status(201).json({
      success: true,
      message: 'Notification created',
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send notification to all users (broadcast)
// @route   POST /api/notifications/broadcast
// @access  Private/Admin
export const broadcastNotification = async (req, res, next) => {
  try {
    const { type, title, message, data } = req.body;
    const { User } = await import('../Model/index.js');

    const users = await User.findAll({
      where: { notificationsEnabled: true },
      attributes: ['id']
    });

    const notifications = users.map(user => ({
      userId: user.id,
      type: type || 'system',
      title,
      message,
      data
    }));

    await Notification.bulkCreate(notifications);

    res.json({
      success: true,
      message: `Broadcast sent to ${users.length} users`
    });
  } catch (error) {
    next(error);
  }
};
