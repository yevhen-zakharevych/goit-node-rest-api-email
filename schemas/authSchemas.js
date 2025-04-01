import Joi from "joi";

import { emailRegexp } from "../constants/emailRegexp.js";
import { subscriptionTypes } from "../constants/subscriptionTypes.js";

export const authSignupSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string().valid(...subscriptionTypes),
});

export const authSigninSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});
