import { PlaygroundSession, User } from '../Model/index.js';
import { Op } from 'sequelize';

// @desc    Get user's playground sessions
// @route   GET /api/playground
// @access  Private
export const getMySessions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { language, limit = 20, page = 1 } = req.query;

    const where = { userId };
    if (language) where.language = language;

    const offset = (page - 1) * limit;

    const { count, rows: sessions } = await PlaygroundSession.findAndCountAll({
      where,
      order: [['updatedAt', 'DESC']],
      limit: parseInt(limit),
      offset,
      attributes: ['id', 'title', 'language', 'isPublic', 'createdAt', 'updatedAt']
    });

    res.json({
      success: true,
      data: {
        sessions,
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

// @desc    Get single playground session
// @route   GET /api/playground/:id
// @access  Private/Public (if public)
export const getSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const session = await PlaygroundSession.findByPk(id, {
      include: [{
        model: User,
        attributes: ['id', 'username', 'avatar']
      }]
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Check access
    if (!session.isPublic && session.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create playground session
// @route   POST /api/playground
// @access  Private
export const createSession = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      title,
      language,
      htmlCode,
      cssCode,
      jsCode,
      isPublic
    } = req.body;

    const session = await PlaygroundSession.create({
      userId,
      title: title || 'Untitled',
      language,
      htmlCode,
      cssCode,
      jsCode,
      isPublic: isPublic || false
    });

    res.status(201).json({
      success: true,
      message: 'Playground session created',
      data: session
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update playground session
// @route   PUT /api/playground/:id
// @access  Private
export const updateSession = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const session = await PlaygroundSession.findOne({
      where: { id, userId }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found or access denied'
      });
    }

    const {
      title,
      htmlCode,
      cssCode,
      jsCode,
      isPublic
    } = req.body;

    if (title !== undefined) session.title = title;
    if (htmlCode !== undefined) session.htmlCode = htmlCode;
    if (cssCode !== undefined) session.cssCode = cssCode;
    if (jsCode !== undefined) session.jsCode = jsCode;
    if (isPublic !== undefined) session.isPublic = isPublic;

    await session.save();

    res.json({
      success: true,
      message: 'Session updated',
      data: session
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete playground session
// @route   DELETE /api/playground/:id
// @access  Private
export const deleteSession = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const session = await PlaygroundSession.findOne({
      where: { id, userId }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found or access denied'
      });
    }

    await session.destroy();

    res.json({
      success: true,
      message: 'Session deleted'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fork a public playground session
// @route   POST /api/playground/:id/fork
// @access  Private
export const forkSession = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const originalSession = await PlaygroundSession.findByPk(id);

    if (!originalSession) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    if (!originalSession.isPublic && originalSession.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Cannot fork private session'
      });
    }

    const forkedSession = await PlaygroundSession.create({
      userId,
      title: `${originalSession.title} (Fork)`,
      language: originalSession.language,
      htmlCode: originalSession.htmlCode,
      cssCode: originalSession.cssCode,
      jsCode: originalSession.jsCode,
      isPublic: false,
      forkedFromId: originalSession.id
    });

    res.status(201).json({
      success: true,
      message: 'Session forked successfully',
      data: forkedSession
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public playground sessions (explore)
// @route   GET /api/playground/explore
// @access  Public
export const explorePublicSessions = async (req, res, next) => {
  try {
    const { language, search, limit = 20, page = 1 } = req.query;

    const where = { isPublic: true };
    if (language) where.language = language;
    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }

    const offset = (page - 1) * limit;

    const { count, rows: sessions } = await PlaygroundSession.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
      include: [{
        model: User,
        attributes: ['id', 'username', 'avatar']
      }],
      attributes: ['id', 'title', 'language', 'createdAt', 'updatedAt']
    });

    res.json({
      success: true,
      data: {
        sessions,
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

// @desc    Run code (basic execution for JavaScript)
// @route   POST /api/playground/run
// @access  Private
export const runCode = async (req, res, next) => {
  try {
    const { language, code } = req.body;

    // For security, we only support basic JavaScript execution
    // In production, you'd want to use a sandboxed environment
    if (language !== 'javascript') {
      return res.json({
        success: true,
        data: {
          output: 'Server-side execution only supports JavaScript. For HTML/CSS, preview in browser.',
          type: 'info'
        }
      });
    }

    // Very basic and unsafe - for demo only
    // In production, use VM2 or similar sandboxing
    let output = '';
    const consoleLogs = [];

    try {
      // Create a mock console
      const mockConsole = {
        log: (...args) => consoleLogs.push(args.map(a => 
          typeof a === 'object' ? JSON.stringify(a) : String(a)
        ).join(' ')),
        error: (...args) => consoleLogs.push('[ERROR] ' + args.join(' ')),
        warn: (...args) => consoleLogs.push('[WARN] ' + args.join(' '))
      };

      // This is NOT safe for production!
      const fn = new Function('console', code);
      fn(mockConsole);
      
      output = consoleLogs.join('\n') || 'Code executed successfully (no output)';
    } catch (err) {
      output = `Error: ${err.message}`;
    }

    res.json({
      success: true,
      data: {
        output,
        type: 'result'
      }
    });
  } catch (error) {
    next(error);
  }
};
