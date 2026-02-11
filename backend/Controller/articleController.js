import { Article, User } from '../Model/index.js';
import { Op } from 'sequelize';

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
export const getArticles = async (req, res, next) => {
  try {
    const { category, tag, featured, published, search, page = 1, limit = 10 } = req.query;

    const where = {};
    
    // By default, only show published articles for public
    if (published !== undefined) {
      where.isPublished = published === 'true';
    } else {
      where.isPublished = true;
    }
    
    if (category) where.category = category;
    if (featured !== undefined) where.isFeatured = featured === 'true';
    
    if (tag) {
      where.tags = {
        [Op.like]: `%${tag}%`
      };
    }
    
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } },
        { excerpt: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: articles } = await Article.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'avatar']
      }]
    });

    res.json({
      success: true,
      count: articles.length,
      total: count,
      totalPages: Math.ceil(count / parseInt(limit)),
      currentPage: parseInt(page),
      data: articles
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single article
// @route   GET /api/articles/:id
// @access  Public
export const getArticle = async (req, res, next) => {
  try {
    const article = await Article.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'avatar']
      }]
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Increment view count
    await article.increment('viewCount');

    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get article by slug
// @route   GET /api/articles/slug/:slug
// @access  Public
export const getArticleBySlug = async (req, res, next) => {
  try {
    const article = await Article.findOne({
      where: { slug: req.params.slug },
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'avatar']
      }]
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Increment view count
    await article.increment('viewCount');

    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create article
// @route   POST /api/articles
// @access  Private/Admin
export const createArticle = async (req, res, next) => {
  try {
    const { 
      title, 
      content, 
      excerpt, 
      thumbnail, 
      category, 
      tags, 
      source, 
      readTimeMinutes,
      isPublished,
      isFeatured 
    } = req.body;

    // Generate slug from title
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug exists
    const existingSlug = await Article.findOne({ where: { slug } });
    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message: 'An article with this title already exists'
      });
    }

    const articleData = {
      title,
      slug,
      content,
      excerpt,
      thumbnail,
      category,
      tags: tags || [],
      source,
      authorId: req.user.id,
      readTimeMinutes: readTimeMinutes || Math.ceil(content.split(/\s+/).length / 200),
      isPublished: isPublished || false,
      isFeatured: isFeatured || false
    };

    if (isPublished) {
      articleData.publishedAt = new Date();
    }

    const article = await Article.create(articleData);

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: article
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Private/Admin
export const updateArticle = async (req, res, next) => {
  try {
    const article = await Article.findByPk(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    const { 
      title, 
      content, 
      excerpt, 
      thumbnail, 
      category, 
      tags, 
      source, 
      readTimeMinutes,
      isPublished,
      isFeatured 
    } = req.body;

    // If title changed, update slug
    let slug = article.slug;
    if (title && title !== article.title) {
      slug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check if new slug exists
      const existingSlug = await Article.findOne({ 
        where: { 
          slug,
          id: { [Op.ne]: article.id }
        } 
      });
      if (existingSlug) {
        return res.status(400).json({
          success: false,
          message: 'An article with this title already exists'
        });
      }
    }

    // Set publishedAt if publishing for the first time
    let publishedAt = article.publishedAt;
    if (isPublished && !article.isPublished && !article.publishedAt) {
      publishedAt = new Date();
    }

    await article.update({
      title: title || article.title,
      slug,
      content: content || article.content,
      excerpt: excerpt !== undefined ? excerpt : article.excerpt,
      thumbnail: thumbnail !== undefined ? thumbnail : article.thumbnail,
      category: category || article.category,
      tags: tags || article.tags,
      source: source !== undefined ? source : article.source,
      readTimeMinutes: readTimeMinutes || article.readTimeMinutes,
      isPublished: isPublished !== undefined ? isPublished : article.isPublished,
      isFeatured: isFeatured !== undefined ? isFeatured : article.isFeatured,
      publishedAt
    });

    res.json({
      success: true,
      message: 'Article updated successfully',
      data: article
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Private/Admin
export const deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findByPk(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    await article.destroy();

    res.json({
      success: true,
      message: 'Article deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all articles (Admin - includes unpublished)
// @route   GET /api/articles/admin/all
// @access  Private/Admin
export const getAllArticlesAdmin = async (req, res, next) => {
  try {
    const { category, published, featured, page = 1, limit = 20 } = req.query;

    const where = {};
    if (category) where.category = category;
    if (published !== undefined) where.isPublished = published === 'true';
    if (featured !== undefined) where.isFeatured = featured === 'true';

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: articles } = await Article.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'avatar']
      }]
    });

    res.json({
      success: true,
      count: articles.length,
      total: count,
      totalPages: Math.ceil(count / parseInt(limit)),
      currentPage: parseInt(page),
      data: articles
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured articles
// @route   GET /api/articles/featured
// @access  Public
export const getFeaturedArticles = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;

    const articles = await Article.findAll({
      where: {
        isPublished: true,
        isFeatured: true
      },
      order: [['publishedAt', 'DESC']],
      limit: parseInt(limit),
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'avatar']
      }]
    });

    res.json({
      success: true,
      count: articles.length,
      data: articles
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get articles by category
// @route   GET /api/articles/category/:category
// @access  Public
export const getArticlesByCategory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { category } = req.params;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: articles } = await Article.findAndCountAll({
      where: {
        category,
        isPublished: true
      },
      order: [['publishedAt', 'DESC']],
      limit: parseInt(limit),
      offset,
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'avatar']
      }]
    });

    res.json({
      success: true,
      count: articles.length,
      total: count,
      totalPages: Math.ceil(count / parseInt(limit)),
      currentPage: parseInt(page),
      data: articles
    });
  } catch (error) {
    next(error);
  }
};
