import dotenv from 'dotenv';

dotenv.config();

export const API_URL = process.env.API_URL || 'http://localhost:3000';
export const JWT_SECRET = process.env.JWT_SECRET;
export const USE_MOCKS = process.env.USE_MOCKS === 'true';
