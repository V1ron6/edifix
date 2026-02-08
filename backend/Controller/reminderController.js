import { Reminder, User, Course, Notification } from '../Model/index.js';
import { sendEmail, emailTemplates } from '../Config/email.js';

// @desc    Get user's reminders
// @route   GET /api/reminders
// @access  Private
export const getReminders = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const reminders = await Reminder.findAll({
      where: { userId },
      include: [{
        model: Course,
        as: 'course',
        attributes: ['id', 'title', 'slug'],
        required: false
      }],
      order: [['reminderTime', 'ASC']]
    });

    res.json({
      success: true,
      data: reminders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single reminder
// @route   GET /api/reminders/:id
// @access  Private
export const getReminder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const reminder = await Reminder.findOne({
      where: { id, userId },
      include: [{
        model: Course,
        as: 'course',
        attributes: ['id', 'title', 'slug'],
        required: false
      }]
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    res.json({
      success: true,
      data: reminder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create reminder
// @route   POST /api/reminders
// @access  Private
export const createReminder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      title,
      message,
      reminderTime,
      daysOfWeek,
      type,
      sendEmail: shouldSendEmail,
      relatedCourseId
    } = req.body;

    // Validate course if provided
    if (relatedCourseId) {
      const course = await Course.findByPk(relatedCourseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Related course not found'
        });
      }
    }

    const reminder = await Reminder.create({
      userId,
      title,
      message,
      reminderTime,
      daysOfWeek: daysOfWeek || [0, 1, 2, 3, 4, 5, 6],
      type: type || 'study',
      sendEmail: shouldSendEmail || false,
      relatedCourseId
    });

    res.status(201).json({
      success: true,
      message: 'Reminder created successfully',
      data: reminder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update reminder
// @route   PUT /api/reminders/:id
// @access  Private
export const updateReminder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const reminder = await Reminder.findOne({ where: { id, userId } });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    const {
      title,
      message,
      reminderTime,
      daysOfWeek,
      type,
      isActive,
      sendEmail: shouldSendEmail,
      relatedCourseId
    } = req.body;

    if (title !== undefined) reminder.title = title;
    if (message !== undefined) reminder.message = message;
    if (reminderTime !== undefined) reminder.reminderTime = reminderTime;
    if (daysOfWeek !== undefined) reminder.daysOfWeek = daysOfWeek;
    if (type !== undefined) reminder.type = type;
    if (isActive !== undefined) reminder.isActive = isActive;
    if (shouldSendEmail !== undefined) reminder.sendEmail = shouldSendEmail;
    if (relatedCourseId !== undefined) reminder.relatedCourseId = relatedCourseId;

    await reminder.save();

    res.json({
      success: true,
      message: 'Reminder updated successfully',
      data: reminder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete reminder
// @route   DELETE /api/reminders/:id
// @access  Private
export const deleteReminder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const reminder = await Reminder.findOne({ where: { id, userId } });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    await reminder.destroy();

    res.json({
      success: true,
      message: 'Reminder deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle reminder active status
// @route   PUT /api/reminders/:id/toggle
// @access  Private
export const toggleReminder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const reminder = await Reminder.findOne({ where: { id, userId } });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    reminder.isActive = !reminder.isActive;
    await reminder.save();

    res.json({
      success: true,
      message: `Reminder ${reminder.isActive ? 'activated' : 'deactivated'}`,
      data: reminder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process due reminders (called by cron job)
// @route   POST /api/reminders/process
// @access  Private/System
export const processReminders = async (req, res, next) => {
  try {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM
    const currentDay = now.getDay(); // 0-6

    // Find reminders that are due
    const dueReminders = await Reminder.findAll({
      where: {
        isActive: true,
        reminderTime: currentTime
      },
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email', 'emailRemindersEnabled']
        },
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title'],
          required: false
        }
      ]
    });

    let processed = 0;

    for (const reminder of dueReminders) {
      // Check if today is in daysOfWeek
      if (!reminder.daysOfWeek.includes(currentDay)) {
        continue;
      }

      // Check if already sent today
      if (reminder.lastSentAt) {
        const lastSent = new Date(reminder.lastSentAt).toDateString();
        if (lastSent === now.toDateString()) {
          continue;
        }
      }

      // Create in-app notification
      await Notification.create({
        userId: reminder.userId,
        type: 'streak_reminder',
        title: `⏰ ${reminder.title}`,
        message: reminder.message || `Time for your ${reminder.type} session!`,
        data: {
          reminderId: reminder.id,
          courseId: reminder.relatedCourseId
        }
      });

      // Send email if enabled
      if (reminder.sendEmail && reminder.User.emailRemindersEnabled) {
        try {
          const lessonTitle = reminder.course?.title || 'your studies';
          const template = emailTemplates.reminder(reminder.User.username, lessonTitle);
          await sendEmail({
            to: reminder.User.email,
            subject: template.subject,
            html: template.html
          });
        } catch (emailError) {
          console.error('Failed to send reminder email:', emailError);
        }
      }

      // Update lastSentAt
      reminder.lastSentAt = now;
      await reminder.save();
      processed++;
    }

    res.json({
      success: true,
      message: `Processed ${processed} reminders`
    });
  } catch (error) {
    next(error);
  }
};
