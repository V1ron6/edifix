import { DataTypes } from 'sequelize';
import sequelize from '../Config/database.js';

const Lesson = sequelize.define('Lesson', {
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
  slug: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    comment: 'Markdown content'
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('theory', 'practice', 'quiz'),
    defaultValue: 'theory'
  },
  videoUrl: {
    type: DataTypes.STRING(255),
    defaultValue: null
  },
  estimatedMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 15
  },
  codeTemplate: {
    type: DataTypes.TEXT,
    defaultValue: null,
    comment: 'Starter code for practice lessons'
  },
  expectedOutput: {
    type: DataTypes.TEXT,
    defaultValue: null,
    comment: 'Expected output for validation'
  },
  hints: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of hints for practice lessons'
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'lessons',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['courseId', 'slug']
    }
  ]
});

export default Lesson;
