import { DataTypes } from 'sequelize';
import sequelize from '../Config/database.js';

const ForumPost = sequelize.define('ForumPost', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  threadId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  authorId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  parentId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'For nested replies - parent post ID'
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    comment: 'Markdown content'
  },
  likeCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isEdited: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  editedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isSolution: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Marked as the solution to the thread question'
  }
}, {
  tableName: 'forum_posts',
  timestamps: true
});

export default ForumPost;
