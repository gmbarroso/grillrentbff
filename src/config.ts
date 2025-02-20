import dotenv from 'dotenv';

dotenv.config();

export const API_URL = process.env.API_URL || 'http://localhost:3000';
export const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecret';
