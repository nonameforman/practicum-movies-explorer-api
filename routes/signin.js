const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { login } = require('../controllers/users');

const logRouter = express.Router();

logRouter.post('/signin', celebrate({
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
  }),
}), login);

module.exports = logRouter;
