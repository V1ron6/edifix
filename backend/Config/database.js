import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Parse host and port from dbip
const [dbHost, dbPort] = (process.env.dbip || '127.0.0.1:3306').split(':');

const sequelize = new Sequelize(
  process.env.dbname || process.env.DB_NAME,
  process.env.dbusername || process.env.DB_USER,
  process.env.dbpassword || process.env.DB_PASSWORD,
  {
    host: dbHost || process.env.DB_HOST || '127.0.0.1',
    port: parseInt(dbPort) || parseInt(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      // Fix for MariaDB auth_gssapi_client issue
      authPlugins: {
        mysql_clear_password: () => () => Buffer.from(process.env.dbpassword || process.env.DB_PASSWORD || '')
      }
    }
  }
);

// Test connection
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('[OK] MySQL Database connected successfully');
    
    // Sync all models - creates tables if they don't exist
    await sequelize.sync({ alter: false });
    console.log('[OK] Database tables synced');
  } catch (error) {
    console.error('[ERROR] Unable to connect to database:', error.message);
    process.exit(1);
  }
};

export default sequelize;
