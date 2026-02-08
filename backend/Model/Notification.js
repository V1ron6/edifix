import { DataTypes } from 'sequelize';
import sequelize from '../Config/database.js';

const Notification = sequelize.define('Notification', {
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
  type: {
    type: DataTypes.ENUM(
      'streak_reminder',
      'exam_ready',
      'course_completed',
      'lesson_completed',
      'streak_milestone',
      'streak_broken',
      'new_course',
      'system'
    ),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  data: {
    type: DataTypes.JSON,
    defaultValue: null,
    comment: 'Additional data like courseId, examId, etc.'
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  readAt: {
    type: DataTypes.DATE,
    defaultValue: null
  }
}, {
  tableName: 'notifications',
  timestamps: true
});

export default Notification;
