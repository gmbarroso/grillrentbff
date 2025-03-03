import Joi from 'joi';
import { UserRole } from '../entities/user';

export const registerUserSchema = Joi.object({
  name: Joi.string()
    .max(50)
    .pattern(/^[a-zA-Z\s]*$/, 'letters and spaces')
    .required(),
  email: Joi.string()
    .email()
    .max(100)
    .required(),
  password: Joi.string()
    .min(8)
    .max(20)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'letters and numbers')
    .required(),
  apartment: Joi.string().required(),
  block: Joi.number().required(),
  role: Joi.string().valid(UserRole.ADMIN, UserRole.RESIDENT).default(UserRole.RESIDENT),
});

export const loginUserSchema = Joi.object({
  apartment: Joi.string().required(),
  block: Joi.number().required(),
  password: Joi.string().required(),
});

export const updateUserProfileSchema = Joi.object({
  name: Joi.string()
    .max(50)
    .pattern(/^[a-zA-Z\s]*$/, 'letters and spaces'),
  email: Joi.string()
    .email()
    .max(100),
  password: Joi.string()
    .min(8)
    .max(20)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'letters and numbers'),
});
