import cron from 'node-cron';
import { Streak, User, Notification, Progress, Exam, Course, Reminder } from '../Model/index.js';
import { sendEmail, emailTemplates } from '../Config/email.js';
import { Op } from 'sequelize';

// Check and reset broken streaks - runs every day at midnight
export const checkStreaks = cron.schedule('0 0 * * *', async () => {
  console.log('[CRON] Running streak check job...');
  
  try {
    // Check if table exists first
    const tableExists = await Streak.describe().catch(() => null);
    if (!tableExists) {
      console.log('[CRON] Streak table not ready, skipping...');
      return;
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];

    // Find users who missed yesterday and day before (streak broken)
    const brokenStreaks = await Streak.findAll({
      where: {
        currentStreak: { [Op.gt]: 0 },
        lastActivityDate: { [Op.lt]: yesterday },
        streakFreezes: 0 // No freeze available
      },
      include: [{
        model: User,
        attributes: ['id', 'username', 'email', 'emailRemindersEnabled']
      }]
    });

    for (const streak of brokenStreaks) {
      const previousStreak = streak.currentStreak;
      
      // Reset streak
      streak.currentStreak = 0;
      await streak.save();

      // Notify user
      await Notification.create({
        userId: streak.userId,
        type: 'streak_broken',
        title: 'Streak Lost',
        message: `Your ${previousStreak}-day streak has ended. Start a new one today!`,
        data: { previousStreak }
      });

      // Send email
      if (streak.User.emailRemindersEnabled) {
        try {
          const template = emailTemplates.streakBroken(streak.User.username, previousStreak);
          await sendEmail({
            to: streak.User.email,
            subject: template.subject,
            html: template.html
          });
        } catch (err) {
          console.error('Failed to send streak email:', err);
        }
      }
    }

    console.log(`[OK] Streak check complete. ${brokenStreaks.length} streaks reset.`);
  } catch (error) {
    console.error('[ERROR] Streak check error:', error);
  }
}, {
  scheduled: false // Don't auto-start, we'll start it in server.js
});

// Process reminders - runs every minute
export const processRemindersJob = cron.schedule('* * * * *', async () => {
  try {
    // Check if table exists first
    const tableExists = await Reminder.describe().catch(() => null);
    if (!tableExists) {
      return; // Table doesn't exist yet, skip
    }

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM
    const currentDay = now.getDay();

    const dueReminders = await Reminder.findAll({
      where: {
        isActive: true,
        reminderTime: {
          [Op.like]: `${currentTime}%`
        }
      },
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email', 'emailRemindersEnabled', 'notificationsEnabled']
        },
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title'],
          required: false
        }
      ]
    });

    for (const reminder of dueReminders) {
      // Check day of week
      if (!reminder.daysOfWeek.includes(currentDay)) continue;

      // Check if already sent today
      if (reminder.lastSentAt) {
        const lastSent = new Date(reminder.lastSentAt).toDateString();
        if (lastSent === now.toDateString()) continue;
      }

      // Skip if user disabled notifications
      if (!reminder.User.notificationsEnabled) continue;

      // Create notification
      await Notification.create({
        userId: reminder.userId,
        type: 'streak_reminder',
        title: `Reminder: ${reminder.title}`,
        message: reminder.message || `Time for your ${reminder.type} session!`,
        data: { reminderId: reminder.id, courseId: reminder.relatedCourseId }
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
        } catch (err) {
          console.error('Failed to send reminder email:', err);
        }
      }

      reminder.lastSentAt = now;
      await reminder.save();
    }
  } catch (error) {
    console.error('[ERROR] Reminder processing error:', error);
  }
}, {
  scheduled: false
});

// Trigger random exams - runs twice daily at 10:00 and 18:00
export const triggerRandomExams = cron.schedule('0 10,18 * * *', async () => {
  console.log('[CRON] Running random exam trigger...');
  
  try {
    // Check if table exists first
    const tableExists = await Progress.describe().catch(() => null);
    if (!tableExists) {
      console.log('[CRON] Progress table not ready, skipping...');
      return;
    }

    // Get users who completed lessons in the last 7 days
    const activeUserProgress = await Progress.findAll({
      where: {
        status: 'completed',
        completedAt: {
          [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      },
      attributes: ['userId', 'courseId'],
      group: ['userId', 'courseId']
    });

    // Randomly select ~10% of active users
    const userCourseMap = new Map();
    activeUserProgress.forEach(p => {
      if (Math.random() > 0.9) { // 10% chance
        if (!userCourseMap.has(p.userId)) {
          userCourseMap.set(p.userId, []);
        }
        userCourseMap.get(p.userId).push(p.courseId);
      }
    });

    let triggered = 0;

    for (const [userId, courseIds] of userCourseMap) {
      const randomCourseId = courseIds[Math.floor(Math.random() * courseIds.length)];

      const exam = await Exam.findOne({
        where: { courseId: randomCourseId, isPublished: true },
        include: [{ model: Course, as: 'Course' }]
      });

      if (exam) {
        const user = await User.findByPk(userId);
        if (!user.notificationsEnabled) continue;

        await Notification.create({
          userId,
          type: 'exam_ready',
          title: 'Pop Quiz Time!',
          message: `Ready to test your ${exam.Course.title} skills? Take the "${exam.title}" exam!`,
          data: { examId: exam.id, courseId: randomCourseId }
        });

        if (user.emailRemindersEnabled) {
          try {
            const template = emailTemplates.examNotification(user.username, exam.Course.title);
            await sendEmail({
              to: user.email,
              subject: template.subject,
              html: template.html
            });
          } catch (err) {
            console.error('Failed to send exam email:', err);
          }
        }

        triggered++;
      }
    }

    console.log(`[OK] Random exam trigger complete. ${triggered} notifications sent.`);
  } catch (error) {
    console.error('[ERROR] Random exam trigger error:', error);
  }
}, {
  scheduled: false
});

// Start all cron jobs
export const startCronJobs = () => {
  checkStreaks.start();
  processRemindersJob.start();
  triggerRandomExams.start();
  console.log('⏰ Cron jobs started');
};

// Stop all cron jobs
export const stopCronJobs = () => {
  checkStreaks.stop();
  processRemindersJob.stop();
  triggerRandomExams.stop();
  console.log('⏰ Cron jobs stopped');
};
