import 'dotenv/config';
import {Sequelize} from 'sequelize';
import {initUserModel} from '../models/user.js';
import {initContactModel} from '../models/contact.js';

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('no DATABASE_URL');
}

export const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: process.env.PG_SSL === 'true'
    ? {ssl: {require: true, rejectUnauthorized: false}}
    : {},
});


initUserModel(sequelize);
initContactModel(sequelize);

export async function initDb() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    await sequelize.sync({ alter: true });
    console.log('✅ All models were synchronized successfully');
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
}
