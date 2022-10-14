const express = require('express');
const NotFoundError = require('../errors/NotFoundError');

const regRouter = require('./singup');
const logRouter = require('./signin');
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const moviesRouter = require('./movies');

const router = express.Router();

router.use(regRouter);
router.use(logRouter);
router.use(auth);
router.use(usersRouter);
router.use(moviesRouter);
router.use((req, res, next) => {
  next(new NotFoundError('Такой страницы не существует'));
});

module.exports = router;
