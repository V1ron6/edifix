import { DataTypes } from 'sequelize';
import sequelize from '../Config/database.js';

const Reminder = sequelize.define('Reminder', {
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
  title: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  reminderTime: {
    type: DataTypes.TIME,
    allowNull: false,
    comment: 'Time of day to send reminder (HH:MM:SS)'
  },
  daysOfWeek: {
    type: DataTypes.JSON,
    defaultValue: [1, 2, 3, 4, 5, 6, 0],
    comment: 'Days to send reminder (0=Sunday, 6=Saturday)'
  },
  type: {
    type: DataTypes.ENUM('study', 'exam', 'custom'),
    defaultValue: 'study'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  sendEmail: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lastSentAt: {
    type: DataTypes.DATE,
    defaultValue: null
  },
  relatedCourseId: {
    type: DataTypes.UUID,
    defaultValue: null,
    references: {
      model: 'courses',
      key: 'id'
    }
  }
}, {
  tableName: 'reminders',
  timestamps: true
});

export default Reminder;
