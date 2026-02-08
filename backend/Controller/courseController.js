import { Course, Lesson, Progress } from '../Model/index.js';
import { Op } from 'sequelize';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res, next) => {
  try {
    const { category, difficulty, published } = req.query;

    const where = {};
    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;
    if (published !== undefined) where.isPublished = published === 'true';

    const courses = await Course.findAll({
      where,
      order: [['order', 'ASC']],
      include: [{
        model: Lesson,
        as: 'lessons',
        attributes: ['id', 'title', 'order', 'type', 'estimatedMinutes'],
        where: { isPublished: true },
        required: false
      }]
    });

    res.json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
export const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [{
        model: Lesson,
        as: 'lessons',
        order: [['order', 'ASC']]
      }]
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get course by slug
// @route   GET /api/courses/slug/:slug
// @access  Public
export const getCourseBySlug = async (req, res, next) => {
  try {
    const course = await Course.findOne({
      where: { slug: req.params.slug },
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

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Admin
export const createCourse = async (req, res, next) => {
  try {
    const { title, description, category, order, difficulty, estimatedHours, prerequisites, thumbnail } = req.body;

    // Generate slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check if slug exists
    const existingSlug = await Course.findOne({ where: { slug } });
    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message: 'A course with this title already exists'
      });
    }

    const course = await Course.create({
      title,
      slug,
      description,
      category,
      order,
      difficulty,
      estimatedHours,
      prerequisites,
      thumbnail
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
export const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const { title, description, category, order, difficulty, estimatedHours, prerequisites, thumbnail, isPublished } = req.body;

    // Update slug if title changed
    if (title && title !== course.title) {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const existingSlug = await Course.findOne({
        where: { slug, id: { [Op.ne]: course.id } }
      });
      if (existingSlug) {
        return res.status(400).json({
          success: false,
          message: 'A course with this title already exists'
        });
      }
      course.slug = slug;
      course.title = title;
    }

    if (description !== undefined) course.description = description;
    if (category !== undefined) course.category = category;
    if (order !== undefined) course.order = order;
    if (difficulty !== undefined) course.difficulty = difficulty;
    if (estimatedHours !== undefined) course.estimatedHours = estimatedHours;
    if (prerequisites !== undefined) course.prerequisites = prerequisites;
    if (thumbnail !== undefined) course.thumbnail = thumbnail;
    if (isPublished !== undefined) course.isPublished = isPublished;

    await course.save();

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    await course.destroy();

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get learning path (ordered courses)
// @route   GET /api/courses/learning-path/:category
// @access  Public
export const getLearningPath = async (req, res, next) => {
  try {
    const { category } = req.params;

    if (!['frontend', 'backend'].includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Category must be frontend or backend'
      });
    }

    const courses = await Course.findAll({
      where: {
        category,
        isPublished: true
      },
      order: [['order', 'ASC']],
      include: [{
        model: Lesson,
        as: 'lessons',
        attributes: ['id', 'title', 'order', 'type', 'estimatedMinutes'],
        where: { isPublished: true },
        required: false
      }]
    });

    res.json({
      success: true,
      data: {
        category,
        courses
      }
    });
  } catch (error) {
    next(error);
  }
};
