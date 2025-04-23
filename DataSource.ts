import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Expense } from './entities/Expense';
import { Budget } from './entities/Budget';

// Load environment variables
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Expense, Budget], 
  synchronize: true,            
  logging: true,               
});
