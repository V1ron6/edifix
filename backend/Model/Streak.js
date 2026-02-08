import { DataTypes } from 'sequelize';
import sequelize from '../Config/database.js';

const Streak = sequelize.define('Streak', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  currentStreak: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  longestStreak: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastActivityDate: {
    type: DataTypes.DATEONLY,
    defaultValue: null
  },
  totalActiveDays: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  streakFreezes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Number of streak freezes available'
  }
}, {
  tableName: 'streaks',
  timestamps: true
});

// Method to update streak
Streak.prototype.updateStreak = async function() {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (this.lastActivityDate === today) {
    // Already logged activity today
    return this;
  }

  if (this.lastActivityDate === yesterday) {
    // Consecutive day - increment streak
    this.currentStreak += 1;
    this.totalActiveDays += 1;
    if (this.currentStreak > this.longestStreak) {
      this.longestStreak = this.currentStreak;
    }
  } else if (this.lastActivityDate === null) {
    // First activity
    this.currentStreak = 1;
    this.totalActiveDays = 1;
    this.longestStreak = 1;
  } else {
    // Streak broken
    if (this.streakFreezes > 0) {
      // Use streak freeze
      this.streakFreezes -= 1;
      this.currentStreak += 1;
    } else {
      // Reset streak
      this.currentStreak = 1;
    }
    this.totalActiveDays += 1;
  }

  this.lastActivityDate = today;
  await this.save();
  return this;
};

export default Streak;
