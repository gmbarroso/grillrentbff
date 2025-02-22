import Joi from 'joi';
import { UserRole } from '../entities/user';

export const registerUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  apartment: Joi.string().required(),
  block: Joi.number().valid(1, 2).required(),
  role: Joi.string().valid(UserRole.ADMIN, UserRole.RESIDENT).default(UserRole.RESIDENT),
});

export const loginUserSchema = Joi.object({
  apartment: Joi.string().required(),
  block: Joi.number().valid(1, 2).required(),
  password: Joi.string().min(8).max(12).required(),
});

export const updateUserProfileSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
