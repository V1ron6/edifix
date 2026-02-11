import { DataTypes } from 'sequelize';
import sequelize from '../Config/database.js';

const ForumThread = sequelize.define('ForumThread', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  authorId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(220),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    comment: 'Markdown content'
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of tags for filtering'
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  replyCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  likeCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isPinned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isLocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Locked threads cannot receive new replies'
  },
  isSolved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'For question threads - marked as solved'
  },
  solvedPostId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'The post that solved the question'
  },
  lastActivityAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'forum_threads',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['categoryId', 'slug']
    }
  ]
});

export default ForumThread;
