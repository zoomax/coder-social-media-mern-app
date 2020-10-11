const Joi = require("joi");

const registerationValidator = Joi.object({
  name: Joi.string().alphanum().min(3).max(20).required().trim(),
  email: Joi.string()
    .required()
    .trim()
    .pattern(new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)),
  password: Joi.string().alphanum().required().min(6).max(30),
  confirmPassword: Joi.ref("password"),
  avatar: Joi.string().trim(),
});

const loginValidator = Joi.object({
  email: Joi.string().email().required().trim(),
  password: Joi.string().alphanum().required().min(6).max(30),
});
const socialValidator = Joi.object({
  twitter: Joi.string().trim(),
  facebook: Joi.string().trim(),
  linkedin: Joi.string().trim(),
  instagram: Joi.string().trim(),
  youtube: Joi.string().trim(),
});
const experienceValidator = Joi.object({
  title: Joi.string().trim().required(),
  company: Joi.string().trim().required(),
  location: Joi.string().trim(),
  from: Joi.date().required(),
  to: Joi.date(),
  current: Joi.boolean().default(false),
  description: Joi.string().trim(),
});
const educationValidator = Joi.object({
  school: Joi.string().trim(),
  degree: Joi.string().trim(),
  fieldofstudy: Joi.string().trim(),
  from: Joi.date().required(),
  to: Joi.date(),
  current: Joi.boolean().default(false),
  description: Joi.string().trim(),
});
const profileValidator = Joi.object({
  user: Joi.string().required().trim(),
  company: Joi.string().trim(),
  website: Joi.string().trim(),
  status: Joi.string().trim().required(),
  bio: Joi.string().trim().min(50).max(255),
  skills: Joi.array().items(Joi.string().trim()).required(),
  githubusername: Joi.string().trim(),
  social: socialValidator,
  location: Joi.string().trim(),
});

const validateSchema = (body, schema) => {
  return schema.validate(body);
};
module.exports = {
  registerationValidator,
  loginValidator,
  profileValidator,
  experienceValidator , 
  educationValidator , 
  validateSchema,
};
