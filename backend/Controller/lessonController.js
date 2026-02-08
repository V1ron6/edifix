import { Lesson, Course, Progress } from '../Model/index.js';
import { Op } from 'sequelize';

// @desc    Get all lessons for a course
// @route   GET /api/lessons/course/:courseId
// @access  Public
export const getLessonsByCourse = async (req, res, next) => {
  try {
    const lessons = await Lesson.findAll({
      where: {
        courseId: req.params.courseId,
        isPublished: true
      },
      order: [['order', 'ASC']]
    });

    res.json({
      success: true,
      count: lessons.length,
      data: lessons
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lesson
// @route   GET /api/lessons/:id
// @access  Public
export const getLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findByPk(req.params.id, {
      include: [{
        model: Course,
        as: 'Course',
        attributes: ['id', 'title', 'slug', 'category']
      }]
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    res.json({
      success: true,
      data: lesson
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get lesson by slug
// @route   GET /api/lessons/slug/:courseSlug/:lessonSlug
// @access  Public
export const getLessonBySlug = async (req, res, next) => {
  try {
    const { courseSlug, lessonSlug } = req.params;

    const course = await Course.findOne({ where: { slug: courseSlug } });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const lesson = await Lesson.findOne({
      where: {
        courseId: course.id,
        slug: lessonSlug
      },
      include: [{
        model: Course,
        as: 'Course',
        attributes: ['id', 'title', 'slug', 'category']
      }]
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Get next and previous lessons
    const [prevLesson, nextLesson] = await Promise.all([
      Lesson.findOne({
        where: {
          courseId: course.id,
          order: { [Op.lt]: lesson.order },
          isPublished: true
        },
        order: [['order', 'DESC']],
        attributes: ['id', 'title', 'slug', 'order']
      }),
      Lesson.findOne({
        where: {
          courseId: course.id,
          order: { [Op.gt]: lesson.order },
          isPublished: true
        },
        order: [['order', 'ASC']],
        attributes: ['id', 'title', 'slug', 'order']
      })
    ]);

    res.json({
      success: true,
      data: {
        lesson,
        navigation: {
          previous: prevLesson,
          next: nextLesson
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create lesson
// @route   POST /api/lessons
// @access  Private/Admin
export const createLesson = async (req, res, next) => {
  try {
    const {
      courseId,
      title,
      content,
      order,
      type,
      videoUrl,
      estimatedMinutes,
      codeTemplate,
      expectedOutput,
      hints
    } = req.body;

    // Check if course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Generate slug
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check if slug exists in this course
    const existingSlug = await Lesson.findOne({
      where: { courseId, slug }
    });
    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message: 'A lesson with this title already exists in this course'
      });
    }

    const lesson = await Lesson.create({
      courseId,
      title,
      slug,
      content,
      order,
      type,
      videoUrl,
      estimatedMinutes,
      codeTemplate,
      expectedOutput,
      hints
    });

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      data: lesson
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lesson
// @route   PUT /api/lessons/:id
// @access  Private/Admin
export const updateLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findByPk(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    const {
      title,
      content,
      order,
      type,
      videoUrl,
      estimatedMinutes,
      codeTemplate,
      expectedOutput,
      hints,
      isPublished
    } = req.body;

    // Update slug if title changed
    if (title && title !== lesson.title) {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const existingSlug = await Lesson.findOne({
        where: {
          courseId: lesson.courseId,
          slug,
          id: { [Op.ne]: lesson.id }
        }
      });
      if (existingSlug) {
        return res.status(400).json({
          success: false,
          message: 'A lesson with this title already exists in this course'
        });
      }
      lesson.slug = slug;
      lesson.title = title;
    }

    if (content !== undefined) lesson.content = content;
    if (order !== undefined) lesson.order = order;
    if (type !== undefined) lesson.type = type;
    if (videoUrl !== undefined) lesson.videoUrl = videoUrl;
    if (estimatedMinutes !== undefined) lesson.estimatedMinutes = estimatedMinutes;
    if (codeTemplate !== undefined) lesson.codeTemplate = codeTemplate;
    if (expectedOutput !== undefined) lesson.expectedOutput = expectedOutput;
    if (hints !== undefined) lesson.hints = hints;
    if (isPublished !== undefined) lesson.isPublished = isPublished;

    await lesson.save();

    res.json({
      success: true,
      message: 'Lesson updated successfully',
      data: lesson
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lesson
// @route   DELETE /api/lessons/:id
// @access  Private/Admin
export const deleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findByPk(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    await lesson.destroy();

    res.json({
      success: true,
      message: 'Lesson deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
