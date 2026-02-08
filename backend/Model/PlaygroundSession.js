import { DataTypes } from 'sequelize';
import sequelize from '../Config/database.js';

const PlaygroundSession = sequelize.define('PlaygroundSession', {
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
    defaultValue: 'Untitled'
  },
  language: {
    type: DataTypes.ENUM('html', 'css', 'javascript', 'nodejs'),
    allowNull: false
  },
  htmlCode: {
    type: DataTypes.TEXT('long'),
    defaultValue: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Playground</title>\n</head>\n<body>\n  \n</body>\n</html>'
  },
  cssCode: {
    type: DataTypes.TEXT('long'),
    defaultValue: '/* Your CSS here */'
  },
  jsCode: {
    type: DataTypes.TEXT('long'),
    defaultValue: '// Your JavaScript here'
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  forkedFromId: {
    type: DataTypes.UUID,
    defaultValue: null,
    references: {
      model: 'playground_sessions',
      key: 'id'
    }
  }
}, {
  tableName: 'playground_sessions',
  timestamps: true
});

export default PlaygroundSession;
