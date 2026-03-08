import Joi from "joi";

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const resendVerifyEmailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'missing required field email',
    'string.empty': 'missing required field email',
  }),
});
export const emailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'missing required field email',
    'string.email': 'invalid email format',
    'string.empty': 'missing required field email',
  }),
});
