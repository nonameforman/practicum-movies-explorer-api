const Movie = require('../models/movie');

const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require('../errors/index');

const getFavMovies = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const movies = await Movie.find({ owner });
    res.status(200).send(movies);
  } catch (err) {
    next(err);
  }
};

const saveMovie = async (req, res, next) => {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
    } = req.body;
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
      owner: req.user._id,
    });
    res.status(201).send(movie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(`Введены некорректные данные: ${Object.values(err.errors).map((error) => error.message).join(', ')}`));
    } else {
      next(err);
    }
  }
};

const deleteMovie = async (req, res, next) => {
  const { movieId } = req.params;
  try {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      next(new NotFoundError('Такого фильма нет'));
      return;
    }
    if (!(String(movie.owner) === req.user._id)) { // не понятно, исправить
      next(new ForbiddenError('У вас нет доступа'));
      return;
    }
    await movie.remove();
    res.status(200).send({ message: 'Фильм удален' });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError(`Введены некорректные данные: ${err.message}`));
    } else {
      next(err);
    }
  }
};

module.exports = {
  getFavMovies,
  saveMovie,
  deleteMovie,
};
