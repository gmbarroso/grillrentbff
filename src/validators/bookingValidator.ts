import Joi from 'joi';

export const createBookingSchema = Joi.object({
  resourceId: Joi.string().required(),
  startTime: Joi.date().iso().required(),
  endTime: Joi.date().iso().required(),
});
