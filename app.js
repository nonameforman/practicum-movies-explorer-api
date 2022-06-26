require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');

const { PORT, MONGODB } = require('./config');
const routes = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const handleError = require('./middlewares/handleError');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://movies-diplom.nomoredomains.xyz',
    'http://movies-diplom.nomoredomains.xyz',
  ],
}));

async function connectMongo() {
  await mongoose.connect(MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });
  app.listen(PORT);
}
connectMongo();

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(handleError);
