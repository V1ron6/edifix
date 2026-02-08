import { User, Course, Lesson, Progress, Exam, ExamResult, Streak, Notification } from '../Model/index.js';
import { Op } from 'sequelize';
import sequelize from '../Config/database.js';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Private
export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get user with streak
    const user = await User.findByPk(userId, {
      include: [{ model: Streak, as: 'streak' }]
    });

    // Get progress stats
    const progressStats = await Progress.findAll({
      where: { userId },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('status')), 'count']
      ],
      group: ['status']
    });

    const progressMap = {};
    progressStats.forEach(p => {
      progressMap[p.status] = parseInt(p.get('count'));
    });

    // Get total lessons
    const totalLessons = await Lesson.count({
      where: { isPublished: true }
    });

    // Get recent activity
    const recentActivity = await Progress.findAll({
      where: { userId },
      order: [['updatedAt', 'DESC']],
      limit: 5,
      include: [
        {
          model: Lesson,
          as: 'lesson',
          attributes: ['id', 'title', 'slug', 'type']
        },
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'slug']
        }
      ]
    });

    // Get unread notifications count
    const unreadNotifications = await Notification.count({
      where: { userId, isRead: false }
    });

    // Get exam stats
    const examResults = await ExamResult.findAll({
      where: { userId },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN passed = true THEN 1 ELSE 0 END')), 'passed']
      ]
    });

    // Get next lesson to continue
    const inProgressLesson = await Progress.findOne({
      where: { userId, status: 'in_progress' },
      order: [['updatedAt', 'DESC']],
      include: [
        { model: Lesson, as: 'lesson' },
        { model: Course, as: 'course', attributes: ['id', 'title', 'slug'] }
      ]
    });

    // Get courses in progress
    const coursesInProgress = await Course.findAll({
      where: { isPublished: true },
      include: [{
        model: Progress,
        as: 'progress',
        where: { userId },
        required: true
      }, {
        model: Lesson,
        as: 'lessons',
        where: { isPublished: true },
        required: false,
        attributes: ['id']
      }]
    });

    const courseProgressData = coursesInProgress.map(course => {
      const completedLessons = course.progress.filter(p => p.status === 'completed').length;
      const totalCourseLessons = course.lessons.length;
      return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        category: course.category,
        completedLessons,
        totalLessons: totalCourseLessons,
        percentage: totalCourseLessons > 0 
          ? Math.round((completedLessons / totalCourseLessons) * 100) 
          : 0
      };
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar
        },
        streak: user.streak || { currentStreak: 0, longestStreak: 0 },
        progress: {
          completed: progressMap.completed || 0,
          inProgress: progressMap.in_progress || 0,
          notStarted: totalLessons - (progressMap.completed || 0) - (progressMap.in_progress || 0),
          total: totalLessons,
          percentage: totalLessons > 0 
            ? Math.round(((progressMap.completed || 0) / totalLessons) * 100) 
            : 0
        },
        exams: {
          total: parseInt(examResults[0]?.get('total')) || 0,
          passed: parseInt(examResults[0]?.get('passed')) || 0
        },
        unreadNotifications,
        continueLesson: inProgressLesson ? {
          lesson: inProgressLesson.lesson,
          course: inProgressLesson.course
        } : null,
        coursesInProgress: courseProgressData,
        recentActivity
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin dashboard statistics
// @route   GET /api/dashboard/admin
// @access  Private/Admin
export const getAdminDashboard = async (req, res, next) => {
  try {
    // User stats
    const totalUsers = await User.count();
    const newUsersThisWeek = await User.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });

    // Content stats
    const totalCourses = await Course.count();
    const publishedCourses = await Course.count({ where: { isPublished: true } });
    const totalLessons = await Lesson.count();
    const totalExams = await Exam.count();

    // Activity stats
    const activeUsersToday = await Progress.count({
      distinct: true,
      col: 'userId',
      where: {
        updatedAt: {
          [Op.gte]: new Date().setHours(0, 0, 0, 0)
        }
      }
    });

    // Exam completion stats
    const examsTaken = await ExamResult.count();
    const examsPassed = await ExamResult.count({ where: { passed: true } });

    // Top courses by enrollment
    const topCourses = await Progress.findAll({
      attributes: [
        'courseId',
        [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('userId'))), 'enrollments']
      ],
      group: ['courseId'],
      order: [[sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('userId'))), 'DESC']],
      limit: 5,
      include: [{
        model: Course,
        as: 'course',
        attributes: ['id', 'title', 'slug']
      }]
    });

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          newThisWeek: newUsersThisWeek,
          activeToday: activeUsersToday
        },
        content: {
          courses: {
            total: totalCourses,
            published: publishedCourses
          },
          lessons: totalLessons,
          exams: totalExams
        },
        exams: {
          taken: examsTaken,
          passed: examsPassed,
          passRate: examsTaken > 0 ? Math.round((examsPassed / examsTaken) * 100) : 0
        },
        topCourses: topCourses.map(tc => ({
          course: tc.course,
          enrollments: parseInt(tc.get('enrollments'))
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};
