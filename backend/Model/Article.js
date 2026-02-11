import { DataTypes } from 'sequelize';
import sequelize from '../Config/database.js';

const Article = sequelize.define('Article', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique: true
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    comment: 'Markdown content'
  },
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Short description/summary'
  },
  thumbnail: {
    type: DataTypes.STRING(255),
    defaultValue: null
  },
  category: {
    type: DataTypes.ENUM('html', 'css', 'javascript', 'nodejs', 'expressjs', 'databases', 'git', 'deployment', 'best-practices', 'tips', 'general'),
    allowNull: false
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of tags for filtering'
  },
  source: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Original source URL if external'
  },
  authorId: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'Admin who created/added the article'
  },
  readTimeMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'articles',
  timestamps: true
});

export default Article;
