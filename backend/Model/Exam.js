import { DataTypes } from 'sequelize';
import sequelize from '../Config/database.js';

const Exam = sequelize.define('Exam', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  courseId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  questions: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Array of question objects'
    /*
    Question format:
    {
      id: string,
      type: 'multiple_choice' | 'true_false' | 'code',
      question: string,
      options: string[] (for multiple choice),
      correctAnswer: string | number,
      points: number,
      codeTemplate: string (for code questions),
      expectedOutput: string (for code questions)
    }
    */
  },
  totalPoints: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  passingScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Minimum points to pass'
  },
  timeLimit: {
    type: DataTypes.INTEGER,
    defaultValue: 30,
    comment: 'Time limit in minutes'
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'exams',
  timestamps: true
});

export default Exam;
