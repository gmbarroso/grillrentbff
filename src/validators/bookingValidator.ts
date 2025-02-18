import Joi from 'joi';

export const createBookingSchema = Joi.object({
  resourceId: Joi.string().required(),
  userId: Joi.string().required(),
  startTime: Joi.string().isoDate().required(),
  endTime: Joi.string().isoDate().required(),
});

export const checkAvailabilitySchema = Joi.object({
  resourceId: Joi.string().required(),
  startTime: Joi.string().isoDate().required(),
  endTime: Joi.string().isoDate().required(),
});
