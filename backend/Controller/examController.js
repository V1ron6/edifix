import { Exam, ExamResult, Course, Notification, User, Progress, Lesson, Question } from '../Model/index.js';
import { sendEmail, emailTemplates } from '../Config/email.js';
import { Op } from 'sequelize';
import sequelize from '../Config/database.js';

// @desc    Get exams for a course
// @route   GET /api/exams/course/:courseId
// @access  Private
export const getExamsByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const exams = await Exam.findAll({
      where: {
        courseId,
        isPublished: true
      },
      attributes: { exclude: ['questions'] } // Don't send questions in list
    });

    // Get user's results for these exams
    const results = await ExamResult.findAll({
      where: {
        userId,
        examId: exams.map(e => e.id)
      }
    });

    const resultsMap = new Map(results.map(r => [r.examId, r]));

    const examsWithStatus = exams.map(exam => ({
      ...exam.toJSON(),
      userResult: resultsMap.get(exam.id) || null,
      hasAttempted: resultsMap.has(exam.id)
    }));

    res.json({
      success: true,
      data: examsWithStatus
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single exam (for taking)
// @route   GET /api/exams/:id
// @access  Private
export const getExam = async (req, res, next) => {
  try {
    const exam = await Exam.findByPk(req.params.id, {
      include: [{
        model: Course,
        as: 'Course',
        attributes: ['id', 'title', 'slug']
      }]
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    // Remove correct answers from questions for client
    const questionsWithoutAnswers = exam.questions.map(q => {
      const { correctAnswer, ...questionWithoutAnswer } = q;
      return questionWithoutAnswer;
    });

    res.json({
      success: true,
      data: {
        ...exam.toJSON(),
        questions: questionsWithoutAnswers
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit exam answers
// @route   POST /api/exams/:id/submit
// @access  Private
export const submitExam = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id: examId } = req.params;
    const { answers, startedAt } = req.body;

    const exam = await Exam.findByPk(examId, {
      include: [{ model: Course, as: 'Course' }]
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    // Calculate score
    let score = 0;
    const gradedAnswers = exam.questions.map(question => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) {
        score += question.points;
      }
      return {
        questionId: question.id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        points: isCorrect ? question.points : 0
      };
    });

    const passed = score >= exam.passingScore;
    const completedAt = new Date();
    const timeTaken = Math.round((completedAt - new Date(startedAt)) / 1000);

    // Save result
    const result = await ExamResult.create({
      userId,
      examId,
      score,
      totalPoints: exam.totalPoints,
      passed,
      answers: gradedAnswers,
      timeTaken,
      startedAt: new Date(startedAt),
      completedAt
    });

    // Create notification
    await Notification.create({
      userId,
      type: passed ? 'course_completed' : 'exam_ready',
      title: passed ? 'Exam Passed!' : 'Exam Completed',
      message: passed
        ? `Congratulations! You passed the ${exam.title} with ${score}/${exam.totalPoints} points!`
        : `You scored ${score}/${exam.totalPoints} on ${exam.title}. You need ${exam.passingScore} to pass. Try again!`,
      data: { examId, score, totalPoints: exam.totalPoints, passed }
    });

    res.json({
      success: true,
      data: {
        result,
        passed,
        score,
        totalPoints: exam.totalPoints,
        passingScore: exam.passingScore,
        percentage: Math.round((score / exam.totalPoints) * 100),
        gradedAnswers
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's exam results
// @route   GET /api/exams/results
// @access  Private
export const getMyResults = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const results = await ExamResult.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      include: [{
        model: Exam,
        as: 'exam',
        attributes: ['id', 'title', 'courseId'],
        include: [{
          model: Course,
          as: 'Course',
          attributes: ['id', 'title', 'slug']
        }]
      }]
    });

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create exam
// @route   POST /api/exams
// @access  Private/Admin
export const createExam = async (req, res, next) => {
  try {
    const {
      courseId,
      title,
      description,
      questions,
      totalPoints,
      passingScore,
      timeLimit
    } = req.body;

    // Verify course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const exam = await Exam.create({
      courseId,
      title,
      description,
      questions,
      totalPoints,
      passingScore,
      timeLimit
    });

    res.status(201).json({
      success: true,
      message: 'Exam created successfully',
      data: exam
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update exam
// @route   PUT /api/exams/:id
// @access  Private/Admin
export const updateExam = async (req, res, next) => {
  try {
    const exam = await Exam.findByPk(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    const {
      title,
      description,
      questions,
      totalPoints,
      passingScore,
      timeLimit,
      isPublished
    } = req.body;

    if (title !== undefined) exam.title = title;
    if (description !== undefined) exam.description = description;
    if (questions !== undefined) exam.questions = questions;
    if (totalPoints !== undefined) exam.totalPoints = totalPoints;
    if (passingScore !== undefined) exam.passingScore = passingScore;
    if (timeLimit !== undefined) exam.timeLimit = timeLimit;
    if (isPublished !== undefined) exam.isPublished = isPublished;

    await exam.save();

    res.json({
      success: true,
      message: 'Exam updated successfully',
      data: exam
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete exam
// @route   DELETE /api/exams/:id
// @access  Private/Admin
export const deleteExam = async (req, res, next) => {
  try {
    const exam = await Exam.findByPk(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    await exam.destroy();

    res.json({
      success: true,
      message: 'Exam deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Trigger random exam notification for eligible users
// @route   POST /api/exams/trigger-random
// @access  Private/Admin (or called by cron)
export const triggerRandomExam = async (req, res, next) => {
  try {
    // Find users who have completed at least one course
    const eligibleUsers = await Progress.findAll({
      where: { status: 'completed' },
      attributes: ['userId', 'courseId'],
      group: ['userId', 'courseId']
    });

    const userCourseMap = new Map();
    eligibleUsers.forEach(p => {
      if (!userCourseMap.has(p.userId)) {
        userCourseMap.set(p.userId, []);
      }
      userCourseMap.get(p.userId).push(p.courseId);
    });

    let notificationsSent = 0;

    for (const [userId, courseIds] of userCourseMap) {
      // Pick a random course they've completed
      const randomCourseId = courseIds[Math.floor(Math.random() * courseIds.length)];

      // Find an exam for that course
      const exam = await Exam.findOne({
        where: {
          courseId: randomCourseId,
          isPublished: true
        },
        include: [{ model: Course, as: 'Course' }]
      });

      if (exam) {
        const user = await User.findByPk(userId);

        // Create notification
        await Notification.create({
          userId,
          type: 'exam_ready',
          title: 'Random Exam Time!',
          message: `Time to test your ${exam.Course.title} knowledge! Take the "${exam.title}" exam.`,
          data: { examId: exam.id, courseId: randomCourseId }
        });

        // Send email if enabled
        if (user.emailRemindersEnabled) {
          try {
            const template = emailTemplates.examNotification(user.username, exam.Course.title);
            await sendEmail({
              to: user.email,
              subject: template.subject,
              html: template.html
            });
          } catch (emailError) {
            console.error('Failed to send exam email:', emailError);
          }
        }

        notificationsSent++;
      }
    }

    res.json({
      success: true,
      message: `Sent ${notificationsSent} exam notifications`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate a dynamic exam with random questions
// @route   POST /api/exams/generate
// @access  Private
export const generateDynamicExam = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { 
      category, 
      difficulty = 'beginner', 
      questionCount = 10,
      timeLimit = 15
    } = req.body;

    // Validate category
    const validCategories = ['html', 'css', 'javascript', 'git', 'nodejs', 'databases', 'expressjs', 'middleware', 'cors', 'deployment', 'general'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${validCategories.join(', ')}`
      });
    }

    // Build query for questions
    const whereClause = {
      category,
      isActive: true
    };

    // If specific difficulty, filter by it. Otherwise, get mixed difficulties
    if (difficulty !== 'mixed') {
      whereClause.difficulty = difficulty;
    }

    // Get all matching questions
    const allQuestions = await Question.findAll({
      where: whereClause,
      order: [['timesUsed', 'ASC']] // Prioritize less used questions
    });

    if (allQuestions.length < questionCount) {
      // If not enough questions in the category, try to get more with mixed difficulty
      const additionalQuestions = await Question.findAll({
        where: {
          category,
          isActive: true,
          id: { [Op.notIn]: allQuestions.map(q => q.id) }
        },
        limit: questionCount - allQuestions.length
      });
      allQuestions.push(...additionalQuestions);
    }

    if (allQuestions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No questions found for this category'
      });
    }

    // Shuffle and select questions
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, Math.min(questionCount, shuffled.length));

    // Calculate total points
    const totalPoints = selectedQuestions.reduce((sum, q) => sum + q.points, 0);
    const passingScore = Math.ceil(totalPoints * 0.6); // 60% to pass

    // Format questions for exam (remove correct answers for response)
    const formattedQuestions = selectedQuestions.map((q, index) => ({
      id: q.id,
      questionNumber: index + 1,
      type: q.type,
      question: q.question,
      options: q.options ? JSON.parse(q.options) : null,
      codeTemplate: q.codeTemplate,
      hints: q.hints ? JSON.parse(q.hints) : null,
      points: q.points,
      difficulty: q.difficulty
    }));

    // Update usage count for selected questions
    await Question.increment('timesUsed', {
      where: { id: selectedQuestions.map(q => q.id) }
    });

    // Store the exam session data (correct answers) for validation
    // In production, you might want to store this in Redis or a temp table
    const examSession = {
      id: `dynamic_${Date.now()}_${userId}`,
      category,
      difficulty,
      questionIds: selectedQuestions.map(q => q.id),
      totalPoints,
      passingScore,
      timeLimit,
      createdAt: new Date()
    };

    res.json({
      success: true,
      data: {
        examId: examSession.id,
        category,
        difficulty,
        title: `${category.charAt(0).toUpperCase() + category.slice(1)} ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Quiz`,
        questions: formattedQuestions,
        totalPoints,
        passingScore,
        timeLimit,
        questionCount: formattedQuestions.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit dynamic exam answers
// @route   POST /api/exams/submit-dynamic
// @access  Private
export const submitDynamicExam = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { examId, answers, startedAt, category } = req.body;

    // Get the questions that were in this exam
    const questionIds = Object.keys(answers);
    const questions = await Question.findAll({
      where: { id: questionIds }
    });

    if (questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid exam submission'
      });
    }

    // Calculate score
    let score = 0;
    let correctCount = 0;
    const gradedAnswers = questions.map(question => {
      const userAnswer = answers[question.id];
      const correctAnswer = question.correctAnswer;
      
      // Handle different answer types
      let isCorrect = false;
      if (question.type === 'multiple_choice' || question.type === 'true_false') {
        isCorrect = String(userAnswer) === String(correctAnswer);
      } else if (question.type === 'short_answer') {
        // Basic string comparison (case-insensitive, trimmed)
        isCorrect = userAnswer?.toLowerCase().trim() === correctAnswer?.toLowerCase().trim();
      }
      // For code questions, you would need a code evaluation service

      if (isCorrect) {
        score += question.points;
        correctCount++;
      }

      return {
        questionId: question.id,
        question: question.question,
        userAnswer,
        correctAnswer: correctAnswer,
        isCorrect,
        points: isCorrect ? question.points : 0,
        maxPoints: question.points,
        explanation: question.explanation
      };
    });

    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    const passingScore = Math.ceil(totalPoints * 0.6);
    const passed = score >= passingScore;
    const completedAt = new Date();
    const timeTaken = Math.round((completedAt - new Date(startedAt)) / 1000);
    const percentage = Math.round((score / totalPoints) * 100);

    // Update question statistics
    for (const graded of gradedAnswers) {
      const question = questions.find(q => q.id === graded.questionId);
      if (question) {
        const newCorrectRate = question.timesUsed > 0
          ? ((question.correctRate * (question.timesUsed - 1)) + (graded.isCorrect ? 100 : 0)) / question.timesUsed
          : (graded.isCorrect ? 100 : 0);
        
        await Question.update(
          { correctRate: newCorrectRate },
          { where: { id: question.id } }
        );
      }
    }

    // Create notification
    await Notification.create({
      userId,
      type: passed ? 'course_completed' : 'exam_ready',
      title: passed ? 'Quiz Passed!' : 'Quiz Completed',
      message: passed
        ? `Great job! You scored ${score}/${totalPoints} (${percentage}%) on the ${category} quiz!`
        : `You scored ${score}/${totalPoints} (${percentage}%) on the ${category} quiz. Keep practicing!`,
      data: { examId, score, totalPoints, passed, category }
    });

    res.json({
      success: true,
      data: {
        examId,
        passed,
        score,
        totalPoints,
        passingScore,
        percentage,
        correctCount,
        totalQuestions: questions.length,
        timeTaken,
        gradedAnswers
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get questions by category (for admin)
// @route   GET /api/exams/questions/:category
// @access  Private/Admin
export const getQuestionsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { difficulty, page = 1, limit = 20 } = req.query;

    const whereClause = { category };
    if (difficulty) {
      whereClause.difficulty = difficulty;
    }

    const { count, rows: questions } = await Question.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({
      success: true,
      data: {
        questions,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / parseInt(limit)),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new question
// @route   POST /api/exams/questions
// @access  Private/Admin
export const addQuestion = async (req, res, next) => {
  try {
    const {
      category,
      difficulty,
      type,
      question,
      options,
      correctAnswer,
      explanation,
      codeTemplate,
      expectedOutput,
      hints,
      points,
      tags,
      source
    } = req.body;

    const newQuestion = await Question.create({
      category,
      difficulty,
      type,
      question,
      options: options ? JSON.stringify(options) : null,
      correctAnswer,
      explanation,
      codeTemplate,
      expectedOutput,
      hints: hints ? JSON.stringify(hints) : null,
      points: points || 10,
      tags: tags ? JSON.stringify(tags) : null,
      source
    });

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: newQuestion
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a question
// @route   PUT /api/exams/questions/:id
// @access  Private/Admin
export const updateQuestion = async (req, res, next) => {
  try {
    const questionRecord = await Question.findByPk(req.params.id);

    if (!questionRecord) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    const allowedFields = [
      'category', 'difficulty', 'type', 'question', 'options',
      'correctAnswer', 'explanation', 'codeTemplate', 'expectedOutput',
      'hints', 'points', 'tags', 'source', 'isActive'
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (['options', 'hints', 'tags'].includes(field) && Array.isArray(req.body[field])) {
          questionRecord[field] = JSON.stringify(req.body[field]);
        } else {
          questionRecord[field] = req.body[field];
        }
      }
    }

    await questionRecord.save();

    res.json({
      success: true,
      message: 'Question updated successfully',
      data: questionRecord
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a question
// @route   DELETE /api/exams/questions/:id
// @access  Private/Admin
export const deleteQuestion = async (req, res, next) => {
  try {
    const questionRecord = await Question.findByPk(req.params.id);

    if (!questionRecord) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    await questionRecord.destroy();

    res.json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get question statistics
// @route   GET /api/exams/questions/stats
// @access  Private/Admin
export const getQuestionStats = async (req, res, next) => {
  try {
    const stats = await Question.findAll({
      attributes: [
        'category',
        'difficulty',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('AVG', sequelize.col('correctRate')), 'avgCorrectRate']
      ],
      group: ['category', 'difficulty'],
      raw: true
    });

    const totalCount = await Question.count();

    res.json({
      success: true,
      data: {
        total: totalCount,
        byCategory: stats
      }
    });
  } catch (error) {
    next(error);
  }
};
