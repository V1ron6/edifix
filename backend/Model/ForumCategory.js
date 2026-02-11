import { DataTypes } from 'sequelize';
import sequelize from '../Config/database.js';

const ForumCategory = sequelize.define('ForumCategory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  icon: {
    type: DataTypes.STRING(50),
    defaultValue: 'chat',
    comment: 'Icon name for the category'
  },
  color: {
    type: DataTypes.STRING(20),
    defaultValue: '#3498db',
    comment: 'Color theme for the category'
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'forum_categories',
  timestamps: true
});

export default ForumCategory;
