const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { register } = require('../controllers/users');

const regRouter = express.Router();

regRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi
      .string()
      .required()
      .email()
      .messages({
        'string.empty': 'Поле EMAIL не может быть пустым',
        'any.required': 'Поле EMAIL обязательное',
      }),
    password: Joi
      .string()
      .required()
      .messages({
        'string.empty': 'Поле PASSWORD не может быть пустым',
        'any.required': 'Поле PASSWORD обязательное',
      }),
    name: Joi
      .string()
      .required()
      .min(2)
      .max(30)
      .messages({
        'string.empty': 'Поле NAME не может быть пустым',
        'string.min': 'Поле NAME не может быть короче 2 символов',
        'string.max': 'Поле NAME не может быть длиннее 30 символов',
        'any.required': 'Поле NAME обязательное',
      }),
  }),
}), register);

module.exports = regRouter;
