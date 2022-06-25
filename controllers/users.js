const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} = require('../errors/index');

const SALT_ROUNDS = 10;
const MONGO_ERROR = 11000;
const { NODE_ENV, JWT_SECRET } = process.env;

const register = async (req, res, next) => {
  const { email, password, name } = req.body;
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    let user = await User.create({
      email, password: hash, name,
    });
    user = user.toObject();
    delete user.password;
    res.status(201).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(`Введены некорректные данные: ${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      return;
    }
    if (err.code === MONGO_ERROR) {
      next(new ConflictError('Пользователь уже существует'));
      return;
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      next(new UnauthorizedError('Пользователь не найден'));
      return;
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new UnauthorizedError('Неправильный email/пароль');
    }
    const token = await jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '30d' });
    res.status(200).send({ token });
  } catch (err) {
    next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    } else {
      res.status(200).send(user);
    }
  } catch (err) {
    next(err);
  }
};

const editUser = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    const updatedProfile = await User.findByIdAndUpdate(
      req.user._id,
      { email, name },
      { new: true, runValidators: true },
    );
    if (!updatedProfile) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.status(200).send(updatedProfile);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Введены некорректные данные'));
    } else if (err.code === MONGO_ERROR) {
      next(new ConflictError('Пользователь c такой почтой уже есть'));
    } else {
      next(err);
    }
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  editUser,
};
