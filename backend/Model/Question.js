import { DataTypes } from 'sequelize';
import sequelize from '../Config/database.js';

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  courseId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'courses',
      key: 'id'
    },
    comment: 'Optional - can be null for general questions'
  },
  category: {
    type: DataTypes.ENUM('html', 'css', 'javascript', 'git', 'nodejs', 'databases', 'expressjs', 'middleware', 'cors', 'deployment', 'general'),
    allowNull: false
  },
  difficulty: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    allowNull: false,
    defaultValue: 'beginner'
  },
  type: {
    type: DataTypes.ENUM('multiple_choice', 'true_false', 'code', 'fill_blank', 'short_answer'),
    allowNull: false,
    defaultValue: 'multiple_choice'
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  options: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of options for multiple choice questions'
  },
  correctAnswer: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Index for multiple choice, boolean string for true/false, or actual answer for others'
  },
  explanation: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Explanation shown after answering'
  },
  codeTemplate: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Starting code for code-type questions'
  },
  expectedOutput: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Expected output for code-type questions'
  },
  hints: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of hints'
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of tags like interview, leetcode, beginner-friendly'
  },
  source: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Source of the question: leetcode, interview, custom, etc.'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  timesUsed: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  correctRate: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    comment: 'Percentage of correct answers'
  }
}, {
  tableName: 'questions',
  timestamps: true,
  indexes: [
    { fields: ['category'] },
    { fields: ['difficulty'] },
    { fields: ['type'] },
    { fields: ['isActive'] }
  ]
});

export default Question;
