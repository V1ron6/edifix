import { DataTypes } from 'sequelize';
import sequelize from '../Config/database.js';

const ForumLike = sequelize.define('ForumLike', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  threadId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'Set if liking a thread'
  },
  postId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'Set if liking a post'
  }
}, {
  tableName: 'forum_likes',
  timestamps: true
});

export default ForumLike;
