const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Поле является обязательным'],
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Ошибка при вводе email',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле является обязательным'],
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: [2, 'Минимальное кол-во символов: 2'],
    maxlength: [30, 'Максимальное кол-во символов: 30'],
  },
});

module.exports = mongoose.model('user', userSchema);
