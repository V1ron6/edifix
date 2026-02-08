import { DataTypes } from 'sequelize';
import sequelize from '../Config/database.js';

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  thumbnail: {
    type: DataTypes.STRING(255),
    defaultValue: null
  },
  category: {
    type: DataTypes.ENUM('frontend', 'backend'),
    allowNull: false
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Order in learning path'
  },
  difficulty: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    defaultValue: 'beginner'
  },
  estimatedHours: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  prerequisites: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of course IDs that must be completed first'
  }
}, {
  tableName: 'courses',
  timestamps: true
});

export default Course;
