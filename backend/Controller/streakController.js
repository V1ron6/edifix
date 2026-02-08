import { Streak, User, Notification } from '../Model/index.js';
import { sendEmail, emailTemplates } from '../Config/email.js';

// @desc    Get user's streak
// @route   GET /api/streak
// @access  Private
export const getStreak = async (req, res, next) => {
  try {
    const userId = req.user.id;

    let streak = await Streak.findOne({ where: { userId } });

    // Create streak if doesn't exist
    if (!streak) {
      streak = await Streak.create({ userId });
    }

    res.json({
      success: true,
      data: streak
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update streak (called when user completes activity)
// @route   POST /api/streak/update
// @access  Private
export const updateStreak = async (req, res, next) => {
  try {
    const userId = req.user.id;

    let streak = await Streak.findOne({ where: { userId } });

    if (!streak) {
      streak = await Streak.create({ userId });
    }

    const previousStreak = streak.currentStreak;
    const wasStreakBroken = streak.lastActivityDate && 
      new Date(streak.lastActivityDate) < new Date(Date.now() - 2 * 86400000);

    await streak.updateStreak();

    // Notify if streak was broken (but recovered with freeze or reset)
    if (wasStreakBroken && previousStreak > 0) {
      const user = await User.findByPk(userId);
      
      // Create notification
      await Notification.create({
        userId,
        type: 'streak_broken',
        title: '😢 Streak Reset',
        message: `Your ${previousStreak}-day streak has ended. But you're back! Let's build a new one.`,
        data: { previousStreak }
      });

      // Send email if enabled
      if (user.emailRemindersEnabled) {
        try {
          const template = emailTemplates.streakBroken(user.username, previousStreak);
          await sendEmail({
            to: user.email,
            subject: template.subject,
            html: template.html
          });
        } catch (emailError) {
          console.error('Failed to send streak broken email:', emailError);
        }
      }
    }

    res.json({
      success: true,
      message: 'Streak updated',
      data: streak
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Use streak freeze
// @route   POST /api/streak/use-freeze
// @access  Private
export const useStreakFreeze = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const streak = await Streak.findOne({ where: { userId } });

    if (!streak) {
      return res.status(404).json({
        success: false,
        message: 'Streak not found'
      });
    }

    if (streak.streakFreezes <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No streak freezes available'
      });
    }

    // Check if freeze is needed (missed yesterday)
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];

    if (streak.lastActivityDate === today) {
      return res.status(400).json({
        success: false,
        message: 'You already have activity today. No freeze needed.'
      });
    }

    if (streak.lastActivityDate === yesterday) {
      return res.status(400).json({
        success: false,
        message: 'Your streak is still active. No freeze needed.'
      });
    }

    // Apply freeze - maintain streak but mark as used
    streak.streakFreezes -= 1;
    streak.lastActivityDate = yesterday; // Pretend activity was yesterday
    await streak.save();

    res.json({
      success: true,
      message: 'Streak freeze used successfully',
      data: streak
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get streak leaderboard
// @route   GET /api/streak/leaderboard
// @access  Public
export const getStreakLeaderboard = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const type = req.query.type || 'current'; // 'current' or 'longest'

    const orderField = type === 'longest' ? 'longestStreak' : 'currentStreak';

    const leaderboard = await Streak.findAll({
      order: [[orderField, 'DESC']],
      limit,
      include: [{
        model: User,
        attributes: ['id', 'username', 'avatar']
      }]
    });

    res.json({
      success: true,
      data: leaderboard.map((entry, index) => ({
        rank: index + 1,
        userId: entry.User.id,
        username: entry.User.username,
        avatar: entry.User.avatar,
        currentStreak: entry.currentStreak,
        longestStreak: entry.longestStreak,
        totalActiveDays: entry.totalActiveDays
      }))
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Award streak freeze (admin or reward)
// @route   POST /api/streak/award-freeze/:userId
// @access  Private/Admin
export const awardStreakFreeze = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { amount = 1 } = req.body;

    const streak = await Streak.findOne({ where: { userId } });

    if (!streak) {
      return res.status(404).json({
        success: false,
        message: 'Streak not found for this user'
      });
    }

    streak.streakFreezes += amount;
    await streak.save();

    // Notify user
    await Notification.create({
      userId,
      type: 'system',
      title: '❄️ Streak Freeze Awarded!',
      message: `You've received ${amount} streak freeze${amount > 1 ? 's' : ''}!`,
      data: { amount, total: streak.streakFreezes }
    });

    res.json({
      success: true,
      message: `Awarded ${amount} streak freeze(s)`,
      data: streak
    });
  } catch (error) {
    next(error);
  }
};
