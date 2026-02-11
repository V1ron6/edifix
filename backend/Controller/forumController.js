import { ForumCategory, ForumThread, ForumPost, ForumLike, User } from '../Model/index.js';
import { Op } from 'sequelize';
import sequelize from '../Config/database.js';

// ==================== CATEGORIES ====================

// @desc    Get all forum categories
// @route   GET /api/forum/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await ForumCategory.findAll({
      where: { isActive: true },
      order: [['order', 'ASC']],
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*) FROM forum_threads 
              WHERE forum_threads.categoryId = ForumCategory.id
            )`),
            'threadCount'
          ]
        ]
      }
    });

    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category by slug
// @route   GET /api/forum/categories/:slug
// @access  Public
export const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await ForumCategory.findOne({
      where: { slug: req.params.slug, isActive: true }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create category
// @route   POST /api/forum/categories
// @access  Admin
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, icon, color, order } = req.body;

    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existingSlug = await ForumCategory.findOne({ where: { slug } });
    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message: 'A category with this name already exists'
      });
    }

    const category = await ForumCategory.create({
      name,
      slug,
      description,
      icon,
      color,
      order: order || 0
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/forum/categories/:id
// @access  Admin
export const updateCategory = async (req, res, next) => {
  try {
    const category = await ForumCategory.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const { name, description, icon, color, order, isActive } = req.body;

    let slug = category.slug;
    if (name && name !== category.name) {
      slug = name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const existingSlug = await ForumCategory.findOne({
        where: { slug, id: { [Op.ne]: category.id } }
      });
      if (existingSlug) {
        return res.status(400).json({
          success: false,
          message: 'A category with this name already exists'
        });
      }
    }

    await category.update({
      name: name || category.name,
      slug,
      description: description !== undefined ? description : category.description,
      icon: icon || category.icon,
      color: color || category.color,
      order: order !== undefined ? order : category.order,
      isActive: isActive !== undefined ? isActive : category.isActive
    });

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/forum/categories/:id
// @access  Admin
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await ForumCategory.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has threads
    const threadCount = await ForumThread.count({ where: { categoryId: category.id } });
    if (threadCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category with ${threadCount} threads. Move or delete threads first.`
      });
    }

    await category.destroy();

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ==================== THREADS ====================

// @desc    Get all threads
// @route   GET /api/forum/threads
// @access  Public
export const getThreads = async (req, res, next) => {
  try {
    const { category, tag, solved, search, sort = 'latest', page = 1, limit = 20 } = req.query;

    const where = {};
    
    if (category) {
      const cat = await ForumCategory.findOne({ where: { slug: category } });
      if (cat) where.categoryId = cat.id;
    }
    
    if (solved !== undefined) {
      where.isSolved = solved === 'true';
    }

    if (tag) {
      where.tags = { [Op.like]: `%${tag}%` };
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ];
    }

    let order;
    switch (sort) {
      case 'popular':
        order = [['viewCount', 'DESC']];
        break;
      case 'most-replies':
        order = [['replyCount', 'DESC']];
        break;
      case 'oldest':
        order = [['createdAt', 'ASC']];
        break;
      default: // latest
        order = [['isPinned', 'DESC'], ['lastActivityAt', 'DESC']];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: threads } = await ForumThread.findAndCountAll({
      where,
      order,
      limit: parseInt(limit),
      offset,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar']
        },
        {
          model: ForumCategory,
          as: 'category',
          attributes: ['id', 'name', 'slug', 'color']
        }
      ]
    });

    res.json({
      success: true,
      count: threads.length,
      total: count,
      totalPages: Math.ceil(count / parseInt(limit)),
      currentPage: parseInt(page),
      data: threads
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get threads by category
// @route   GET /api/forum/categories/:slug/threads
// @access  Public
export const getThreadsByCategory = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, sort = 'latest' } = req.query;

    const category = await ForumCategory.findOne({
      where: { slug: req.params.slug, isActive: true }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    let order;
    switch (sort) {
      case 'popular':
        order = [['viewCount', 'DESC']];
        break;
      case 'most-replies':
        order = [['replyCount', 'DESC']];
        break;
      default:
        order = [['isPinned', 'DESC'], ['lastActivityAt', 'DESC']];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: threads } = await ForumThread.findAndCountAll({
      where: { categoryId: category.id },
      order,
      limit: parseInt(limit),
      offset,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar']
        }
      ]
    });

    res.json({
      success: true,
      count: threads.length,
      total: count,
      totalPages: Math.ceil(count / parseInt(limit)),
      currentPage: parseInt(page),
      category,
      data: threads
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single thread
// @route   GET /api/forum/threads/:id
// @access  Public
export const getThread = async (req, res, next) => {
  try {
    const thread = await ForumThread.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar']
        },
        {
          model: ForumCategory,
          as: 'category',
          attributes: ['id', 'name', 'slug', 'color']
        }
      ]
    });

    if (!thread) {
      return res.status(404).json({
        success: false,
        message: 'Thread not found'
      });
    }

    // Increment view count
    await thread.increment('viewCount');

    // Check if current user has liked this thread
    let hasLiked = false;
    if (req.user) {
      const like = await ForumLike.findOne({
        where: { userId: req.user.id, threadId: thread.id }
      });
      hasLiked = !!like;
    }

    res.json({
      success: true,
      data: {
        ...thread.toJSON(),
        hasLiked
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get thread by slug
// @route   GET /api/forum/categories/:categorySlug/threads/:threadSlug
// @access  Public
export const getThreadBySlug = async (req, res, next) => {
  try {
    const { categorySlug, threadSlug } = req.params;

    const category = await ForumCategory.findOne({
      where: { slug: categorySlug }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const thread = await ForumThread.findOne({
      where: { categoryId: category.id, slug: threadSlug },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar']
        },
        {
          model: ForumCategory,
          as: 'category',
          attributes: ['id', 'name', 'slug', 'color']
        }
      ]
    });

    if (!thread) {
      return res.status(404).json({
        success: false,
        message: 'Thread not found'
      });
    }

    await thread.increment('viewCount');

    let hasLiked = false;
    if (req.user) {
      const like = await ForumLike.findOne({
        where: { userId: req.user.id, threadId: thread.id }
      });
      hasLiked = !!like;
    }

    res.json({
      success: true,
      data: {
        ...thread.toJSON(),
        hasLiked
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create thread
// @route   POST /api/forum/threads
// @access  Protected
export const createThread = async (req, res, next) => {
  try {
    const { categoryId, title, content, tags } = req.body;

    // Check category exists
    const category = await ForumCategory.findByPk(categoryId);
    if (!category || !category.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Generate slug
    const baseSlug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 180);

    // Make slug unique within category
    let slug = baseSlug;
    let counter = 1;
    while (await ForumThread.findOne({ where: { categoryId, slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const thread = await ForumThread.create({
      categoryId,
      authorId: req.user.id,
      title,
      slug,
      content,
      tags: tags || [],
      lastActivityAt: new Date()
    });

    const fullThread = await ForumThread.findByPk(thread.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar']
        },
        {
          model: ForumCategory,
          as: 'category',
          attributes: ['id', 'name', 'slug', 'color']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Thread created successfully',
      data: fullThread
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update thread
// @route   PUT /api/forum/threads/:id
// @access  Protected (author or admin)
export const updateThread = async (req, res, next) => {
  try {
    const thread = await ForumThread.findByPk(req.params.id);

    if (!thread) {
      return res.status(404).json({
        success: false,
        message: 'Thread not found'
      });
    }

    // Check ownership
    if (thread.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this thread'
      });
    }

    const { title, content, tags, categoryId } = req.body;

    // Update slug if title changed
    let slug = thread.slug;
    let newCategoryId = thread.categoryId;

    if (categoryId && categoryId !== thread.categoryId) {
      const category = await ForumCategory.findByPk(categoryId);
      if (!category || !category.isActive) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
      newCategoryId = categoryId;
    }

    if (title && title !== thread.title) {
      const baseSlug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .substring(0, 180);

      slug = baseSlug;
      let counter = 1;
      while (await ForumThread.findOne({ 
        where: { 
          categoryId: newCategoryId, 
          slug,
          id: { [Op.ne]: thread.id }
        } 
      })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    await thread.update({
      title: title || thread.title,
      slug,
      content: content || thread.content,
      tags: tags || thread.tags,
      categoryId: newCategoryId
    });

    res.json({
      success: true,
      message: 'Thread updated successfully',
      data: thread
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete thread
// @route   DELETE /api/forum/threads/:id
// @access  Protected (author or admin)
export const deleteThread = async (req, res, next) => {
  try {
    const thread = await ForumThread.findByPk(req.params.id);

    if (!thread) {
      return res.status(404).json({
        success: false,
        message: 'Thread not found'
      });
    }

    if (thread.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this thread'
      });
    }

    await thread.destroy();

    res.json({
      success: true,
      message: 'Thread deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Pin/Unpin thread
// @route   PUT /api/forum/threads/:id/pin
// @access  Admin
export const togglePinThread = async (req, res, next) => {
  try {
    const thread = await ForumThread.findByPk(req.params.id);

    if (!thread) {
      return res.status(404).json({
        success: false,
        message: 'Thread not found'
      });
    }

    await thread.update({ isPinned: !thread.isPinned });

    res.json({
      success: true,
      message: thread.isPinned ? 'Thread pinned' : 'Thread unpinned',
      data: { isPinned: thread.isPinned }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lock/Unlock thread
// @route   PUT /api/forum/threads/:id/lock
// @access  Admin
export const toggleLockThread = async (req, res, next) => {
  try {
    const thread = await ForumThread.findByPk(req.params.id);

    if (!thread) {
      return res.status(404).json({
        success: false,
        message: 'Thread not found'
      });
    }

    await thread.update({ isLocked: !thread.isLocked });

    res.json({
      success: true,
      message: thread.isLocked ? 'Thread locked' : 'Thread unlocked',
      data: { isLocked: thread.isLocked }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark thread as solved
// @route   PUT /api/forum/threads/:id/solve
// @access  Protected (thread author only)
export const markThreadSolved = async (req, res, next) => {
  try {
    const thread = await ForumThread.findByPk(req.params.id);

    if (!thread) {
      return res.status(404).json({
        success: false,
        message: 'Thread not found'
      });
    }

    if (thread.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only the thread author can mark it as solved'
      });
    }

    const { postId } = req.body;

    if (postId) {
      const post = await ForumPost.findOne({
        where: { id: postId, threadId: thread.id }
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found in this thread'
        });
      }

      // Unmark previous solution if exists
      await ForumPost.update(
        { isSolution: false },
        { where: { threadId: thread.id, isSolution: true } }
      );

      await post.update({ isSolution: true });
      await thread.update({ isSolved: true, solvedPostId: post.id });
    } else {
      // Toggle solved status
      await thread.update({ 
        isSolved: !thread.isSolved,
        solvedPostId: null
      });
      
      if (!thread.isSolved) {
        await ForumPost.update(
          { isSolution: false },
          { where: { threadId: thread.id } }
        );
      }
    }

    res.json({
      success: true,
      message: thread.isSolved ? 'Thread marked as solved' : 'Thread marked as unsolved',
      data: { isSolved: thread.isSolved }
    });
  } catch (error) {
    next(error);
  }
};

// ==================== POSTS ====================

// @desc    Get posts for a thread
// @route   GET /api/forum/threads/:threadId/posts
// @access  Public
export const getPostsByThread = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const { threadId } = req.params;

    const thread = await ForumThread.findByPk(threadId);
    if (!thread) {
      return res.status(404).json({
        success: false,
        message: 'Thread not found'
      });
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: posts } = await ForumPost.findAndCountAll({
      where: { threadId, parentId: null },
      order: [
        ['isSolution', 'DESC'],
        ['createdAt', 'ASC']
      ],
      limit: parseInt(limit),
      offset,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar']
        },
        {
          model: ForumPost,
          as: 'replies',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'username', 'avatar']
            }
          ]
        }
      ]
    });

    // Check likes for current user
    let postsWithLikes = posts;
    if (req.user) {
      const postIds = posts.map(p => p.id);
      const userLikes = await ForumLike.findAll({
        where: { userId: req.user.id, postId: { [Op.in]: postIds } }
      });
      const likedPostIds = new Set(userLikes.map(l => l.postId));

      postsWithLikes = posts.map(post => ({
        ...post.toJSON(),
        hasLiked: likedPostIds.has(post.id)
      }));
    }

    res.json({
      success: true,
      count: posts.length,
      total: count,
      totalPages: Math.ceil(count / parseInt(limit)),
      currentPage: parseInt(page),
      data: postsWithLikes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create post (reply)
// @route   POST /api/forum/threads/:threadId/posts
// @access  Protected
export const createPost = async (req, res, next) => {
  try {
    const { threadId } = req.params;
    const { content, parentId } = req.body;

    const thread = await ForumThread.findByPk(threadId);
    if (!thread) {
      return res.status(404).json({
        success: false,
        message: 'Thread not found'
      });
    }

    if (thread.isLocked) {
      return res.status(403).json({
        success: false,
        message: 'This thread is locked and cannot receive new replies'
      });
    }

    // Validate parent post if provided
    if (parentId) {
      const parentPost = await ForumPost.findOne({
        where: { id: parentId, threadId }
      });
      if (!parentPost) {
        return res.status(404).json({
          success: false,
          message: 'Parent post not found'
        });
      }
    }

    const post = await ForumPost.create({
      threadId,
      authorId: req.user.id,
      parentId: parentId || null,
      content
    });

    // Update thread stats
    await thread.update({
      replyCount: thread.replyCount + 1,
      lastActivityAt: new Date()
    });

    const fullPost = await ForumPost.findByPk(post.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Reply posted successfully',
      data: fullPost
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update post
// @route   PUT /api/forum/posts/:id
// @access  Protected (author or admin)
export const updatePost = async (req, res, next) => {
  try {
    const post = await ForumPost.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (post.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }

    const { content } = req.body;

    await post.update({
      content,
      isEdited: true,
      editedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post
// @route   DELETE /api/forum/posts/:id
// @access  Protected (author or admin)
export const deletePost = async (req, res, next) => {
  try {
    const post = await ForumPost.findByPk(req.params.id, {
      include: [{ model: ForumThread, as: 'thread' }]
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (post.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    const thread = post.thread;

    // If this was the solution, unmark it
    if (post.isSolution) {
      await thread.update({ isSolved: false, solvedPostId: null });
    }

    await post.destroy();

    // Update thread reply count
    await thread.update({
      replyCount: Math.max(0, thread.replyCount - 1)
    });

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ==================== LIKES ====================

// @desc    Like/Unlike a thread
// @route   POST /api/forum/threads/:id/like
// @access  Protected
export const toggleThreadLike = async (req, res, next) => {
  try {
    const thread = await ForumThread.findByPk(req.params.id);

    if (!thread) {
      return res.status(404).json({
        success: false,
        message: 'Thread not found'
      });
    }

    const existingLike = await ForumLike.findOne({
      where: { userId: req.user.id, threadId: thread.id }
    });

    if (existingLike) {
      await existingLike.destroy();
      await thread.update({ likeCount: Math.max(0, thread.likeCount - 1) });

      res.json({
        success: true,
        message: 'Thread unliked',
        data: { liked: false, likeCount: thread.likeCount }
      });
    } else {
      await ForumLike.create({
        userId: req.user.id,
        threadId: thread.id
      });
      await thread.update({ likeCount: thread.likeCount + 1 });

      res.json({
        success: true,
        message: 'Thread liked',
        data: { liked: true, likeCount: thread.likeCount }
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Like/Unlike a post
// @route   POST /api/forum/posts/:id/like
// @access  Protected
export const togglePostLike = async (req, res, next) => {
  try {
    const post = await ForumPost.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const existingLike = await ForumLike.findOne({
      where: { userId: req.user.id, postId: post.id }
    });

    if (existingLike) {
      await existingLike.destroy();
      await post.update({ likeCount: Math.max(0, post.likeCount - 1) });

      res.json({
        success: true,
        message: 'Post unliked',
        data: { liked: false, likeCount: post.likeCount }
      });
    } else {
      await ForumLike.create({
        userId: req.user.id,
        postId: post.id
      });
      await post.update({ likeCount: post.likeCount + 1 });

      res.json({
        success: true,
        message: 'Post liked',
        data: { liked: true, likeCount: post.likeCount }
      });
    }
  } catch (error) {
    next(error);
  }
};

// ==================== USER THREADS & POSTS ====================

// @desc    Get current user's threads
// @route   GET /api/forum/my/threads
// @access  Protected
export const getMyThreads = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: threads } = await ForumThread.findAndCountAll({
      where: { authorId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
      include: [
        {
          model: ForumCategory,
          as: 'category',
          attributes: ['id', 'name', 'slug', 'color']
        }
      ]
    });

    res.json({
      success: true,
      count: threads.length,
      total: count,
      totalPages: Math.ceil(count / parseInt(limit)),
      currentPage: parseInt(page),
      data: threads
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's posts
// @route   GET /api/forum/my/posts
// @access  Protected
export const getMyPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: posts } = await ForumPost.findAndCountAll({
      where: { authorId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
      include: [
        {
          model: ForumThread,
          as: 'thread',
          attributes: ['id', 'title', 'slug'],
          include: [
            {
              model: ForumCategory,
              as: 'category',
              attributes: ['id', 'name', 'slug']
            }
          ]
        }
      ]
    });

    res.json({
      success: true,
      count: posts.length,
      total: count,
      totalPages: Math.ceil(count / parseInt(limit)),
      currentPage: parseInt(page),
      data: posts
    });
  } catch (error) {
    next(error);
  }
};
