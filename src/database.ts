import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Import model initializers
import { initUser, User as UserModel } from './models/User';
import { initRequest, Request as RequestModel } from './models/Request';

dotenv.config();

const DB_NAME = process.env.DB_NAME as string;
const DB_USER = process.env.DB_USER as string;
const DB_PASSWORD = process.env.DB_PASSWORD as string;
const DB_HOST = process.env.DB_HOST as string;
const DB_DIALECT = (process.env.DB_DIALECT || 'mysql') as 'mysql';

// Throw an error if essential database variables are missing
if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST) {
    throw new Error('Missing essential database environment variables. Please check your .env file or Render configuration.');
}

// Initialize the Sequelize instance directly.
export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: DB_DIALECT,
    logging: false, // It's good practice to disable logging in production
    dialectOptions: {
      // Add SSL options if your database provider requires it
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
      // Additional MySQL options for better connection handling
      connectTimeout: 60000,
      acquireTimeout: 60000,
      timeout: 60000,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    },
    // Retry configuration for better reliability
    retry: {
      max: 3,
      timeout: 3000
    }
});

/**
 * Initializes database models and their associations.
 */
export const connectAndInitialize = async () => {
    try {
        // 1. Initialize all models
        initUser(sequelize);
        initRequest(sequelize);

        // 2. Define all associations
        UserModel.hasMany(RequestModel, { foreignKey: 'studentId' });
        RequestModel.belongsTo(UserModel, { foreignKey: 'studentId' });

        // 3. Authenticate the connection
        await sequelize.authenticate();
        console.log('Sequelize has connected to the database successfully.');

    } catch (error) {
        console.error('Failed to connect and initialize the database:', error);
        throw error; // Re-throw the error to be caught by the calling function
    }
};

// Export the models for use in other parts of the application.
export const User = UserModel;
export const Request = RequestModel;