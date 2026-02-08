import { Progress, Course, Lesson, Streak, Notification } from '../Model/index.js';
import { Op } from 'sequelize';
import sequelize from '../Config/database.js';

// @desc    Get user's overall progress
// @route   GET /api/progress
// @access  Private
export const getOverallProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get all courses with lesson counts
    const courses = await Course.findAll({
      where: { isPublished: true },
      include: [{
        model: Lesson,
        as: 'lessons',
        where: { isPublished: true },
        required: false,
        attributes: ['id']
      }],
      order: [['category', 'ASC'], ['order', 'ASC']]
    });

    // Get user's completed lessons
    const completedProgress = await Progress.findAll({
      where: {
        userId,
        status: 'completed'
      },
      attributes: ['courseId', 'lessonId']
    });

    const completedLessonIds = new Set(completedProgress.map(p => p.lessonId));

    // Calculate progress for each course
    const courseProgress = courses.map(course => {
      const totalLessons = course.lessons.length;
      const completedLessons = course.lessons.filter(l => completedLessonIds.has(l.id)).length;
      const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      return {
        courseId: course.id,
        title: course.title,
        slug: course.slug,
        category: course.category,
        totalLessons,
        completedLessons,
        percentage,
        status: percentage === 100 ? 'completed' : percentage > 0 ? 'in_progress' : 'not_started'
      };
    });

    // Calculate overall stats
    const totalLessons = courses.reduce((sum, c) => sum + c.lessons.length, 0);
    const totalCompleted = completedProgress.length;
    const overallPercentage = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

    // Separate by category
    const frontendProgress = courseProgress.filter(c => c.category === 'frontend');
    const backendProgress = courseProgress.filter(c => c.category === 'backend');

    res.json({
      success: true,
      data: {
        overall: {
          totalLessons,
          completedLessons: totalCompleted,
          percentage: overallPercentage
        },
        frontend: {
          courses: frontendProgress,
          percentage: frontendProgress.length > 0
            ? Math.round(frontendProgress.reduce((sum, c) => sum + c.percentage, 0) / frontendProgress.length)
            : 0
        },
        backend: {
          courses: backendProgress,
          percentage: backendProgress.length > 0
            ? Math.round(backendProgress.reduce((sum, c) => sum + c.percentage, 0) / backendProgress.length)
            : 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get progress for a specific course
// @route   GET /api/progress/course/:courseId
// @access  Private
export const getCourseProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    const course = await Course.findByPk(courseId, {
      include: [{
        model: Lesson,
        as: 'lessons',
        where: { isPublished: true },
        required: false,
        order: [['order', 'ASC']]
      }]
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Get user's progress for this course
    const userProgress = await Progress.findAll({
      where: { userId, courseId }
    });

    const progressMap = new Map(userProgress.map(p => [p.lessonId, p]));

    // Build lesson progress array
    const lessonProgress = course.lessons.map(lesson => {
      const progress = progressMap.get(lesson.id);
      return {
        lessonId: lesson.id,
        title: lesson.title,
        slug: lesson.slug,
        type: lesson.type,
        order: lesson.order,
        status: progress?.status || 'not_started',
        completedAt: progress?.completedAt || null,
        timeSpentMinutes: progress?.timeSpentMinutes || 0,
        attempts: progress?.attempts || 0
      };
    });

    const completedCount = lessonProgress.filter(l => l.status === 'completed').length;
    const totalTime = lessonProgress.reduce((sum, l) => sum + l.timeSpentMinutes, 0);

    res.json({
      success: true,
      data: {
        course: {
          id: course.id,
          title: course.title,
          slug: course.slug,
          category: course.category
        },
        totalLessons: course.lessons.length,
        completedLessons: completedCount,
        percentage: course.lessons.length > 0
          ? Math.round((completedCount / course.lessons.length) * 100)
          : 0,
        totalTimeMinutes: totalTime,
        lessons: lessonProgress
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lesson progress
// @route   POST /api/progress/lesson/:lessonId
// @access  Private
export const updateLessonProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { lessonId } = req.params;
    const { status, timeSpentMinutes, code } = req.body;

    // Get the lesson to find courseId
    const lesson = await Lesson.findByPk(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Find or create progress
    let [progress, created] = await Progress.findOrCreate({
      where: { userId, lessonId },
      defaults: {
        courseId: lesson.courseId,
        status: status || 'in_progress',
        timeSpentMinutes: timeSpentMinutes || 0,
        lastAttemptCode: code || null
      }
    });

    if (!created) {
      // Update existing progress
      if (status) progress.status = status;
      if (timeSpentMinutes) progress.timeSpentMinutes += timeSpentMinutes;
      if (code) {
        progress.lastAttemptCode = code;
        progress.attempts += 1;
      }
      if (status === 'completed' && !progress.completedAt) {
        progress.completedAt = new Date();
      }
      await progress.save();
    }

    // Update streak if lesson completed
    if (status === 'completed') {
      const streak = await Streak.findOne({ where: { userId } });
      if (streak) {
        const previousStreak = streak.currentStreak;
        await streak.updateStreak();

        // Check for streak milestones
        if (streak.currentStreak > 0 && streak.currentStreak % 7 === 0) {
          await Notification.create({
            userId,
            type: 'streak_milestone',
            title: '🔥 Streak Milestone!',
            message: `Amazing! You've reached a ${streak.currentStreak}-day streak!`,
            data: { streak: streak.currentStreak }
          });
        }
      }

      // Check if course is completed
      const courseLessons = await Lesson.findAll({
        where: { courseId: lesson.courseId, isPublished: true },
        attributes: ['id']
      });

      const completedLessons = await Progress.count({
        where: {
          userId,
          courseId: lesson.courseId,
          status: 'completed'
        }
      });

      if (completedLessons === courseLessons.length) {
        const course = await Course.findByPk(lesson.courseId);
        await Notification.create({
          userId,
          type: 'course_completed',
          title: 'Course Completed!',
          message: `Congratulations! You've completed "${course.title}"!`,
          data: { courseId: course.id, courseName: course.title }
        });
      }
    }

    res.json({
      success: true,
      message: 'Progress updated',
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent activity
// @route   GET /api/progress/activity
// @access  Private
export const getRecentActivity = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;

    const recentProgress = await Progress.findAll({
      where: { userId },
      order: [['updatedAt', 'DESC']],
      limit,
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

    res.json({
      success: true,
      data: recentProgress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current/next lesson to continue
// @route   GET /api/progress/continue
// @access  Private
export const getContinueLesson = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Find the most recent in-progress lesson
    const inProgress = await Progress.findOne({
      where: {
        userId,
        status: 'in_progress'
      },
      order: [['updatedAt', 'DESC']],
      include: [
        {
          model: Lesson,
          as: 'lesson',
          include: [{ model: Course, as: 'Course', attributes: ['id', 'title', 'slug'] }]
        }
      ]
    });

    if (inProgress) {
      return res.json({
        success: true,
        data: {
          type: 'continue',
          lesson: inProgress.lesson
        }
      });
    }

    // Find the next lesson to start
    // Get all completed lesson IDs
    const completedLessonIds = await Progress.findAll({
      where: { userId, status: 'completed' },
      attributes: ['lessonId']
    }).then(results => results.map(r => r.lessonId));

    // Find the first incomplete lesson in order
    const nextLesson = await Lesson.findOne({
      where: {
        isPublished: true,
        id: { [Op.notIn]: completedLessonIds.length ? completedLessonIds : ['none'] }
      },
      include: [{
        model: Course,
        as: 'Course',
        where: { isPublished: true },
        attributes: ['id', 'title', 'slug', 'order']
      }],
      order: [
        [{ model: Course, as: 'Course' }, 'order', 'ASC'],
        ['order', 'ASC']
      ]
    });

    res.json({
      success: true,
      data: nextLesson ? {
        type: 'next',
        lesson: nextLesson
      } : null
    });
  } catch (error) {
    next(error);
  }
};
