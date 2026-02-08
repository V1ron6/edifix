import { DataTypes } from 'sequelize';
import sequelize from '../Config/database.js';

const Progress = sequelize.define('Progress', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  courseId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id'
    }
  },
  lessonId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'lessons',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('not_started', 'in_progress', 'completed'),
    defaultValue: 'not_started'
  },
  completedAt: {
    type: DataTypes.DATE,
    defaultValue: null
  },
  timeSpentMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Number of attempts for practice lessons'
  },
  lastAttemptCode: {
    type: DataTypes.TEXT,
    defaultValue: null,
    comment: 'Last code submitted in playground'
  }
}, {
  tableName: 'progress',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'lessonId']
    }
  ]
});

export default Progress;
