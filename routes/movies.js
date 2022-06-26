const express = require('express');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const {
  getFavMovies,
  saveMovie,
  deleteMovie,
} = require('../controllers/movies');

const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) { throw new Error('Неправильный формат ссылки'); }
  return value;
};

const moviesRouter = express.Router();

moviesRouter.get('/movies', getFavMovies);
moviesRouter.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required().positive().integer(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validateURL),
    trailerLink: Joi.string().required().custom(validateURL),
    thumbnail: Joi.string().required().custom(validateURL),
    movieId: Joi.number().required().positive().integer(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), saveMovie);
moviesRouter.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), deleteMovie);

module.exports = moviesRouter;
