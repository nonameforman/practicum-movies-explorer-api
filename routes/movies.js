const express = require('express');
const { celebrate, Joi } = require('celebrate');

const {
  getFavMovies,
  saveMovie,
  deleteMovie,
} = require('../controllers/movies');

const moviesRouter = express.Router();

moviesRouter.get('/movies', getFavMovies);
moviesRouter.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required().positive(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    trailerLink: Joi.string().required(),
    thumbnail: Joi.string().required(),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), saveMovie);
moviesRouter.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24),
  }),
}), deleteMovie);

module.exports = moviesRouter;
