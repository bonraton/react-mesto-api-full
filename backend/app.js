const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/user');
const { jwtCheck } = require('./middlewares/auth');
const { registerValidator, loginValidator } = require('./middlewares/validation');
const cors = require('cors')

const { PORT = 3000 } = process.env;
const app = express();
const corsOptions = {
  origin: ['https://nomoredomains.mesto.nomoredomains.rocks',
          'http://nomoredomains.mesto.nomoredomains.rocks',
          'http://localhost:3000'],
  methods: ['PUT', 'GET', 'POST', 'PATCH', 'DELETE', 'HEAD'],
  preflightContinue: false,
  optionSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

app.use('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewurlParser: true,
});

app.use('/users', jwtCheck, require('./routes/user'));
app.use('/cards', jwtCheck, require('./routes/cards'));

app.post('/signin', loginValidator, login);
app.post('/signup', registerValidator, createUser);

app.use('*', jwtCheck);

app.use(errors(), (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
});

app.listen(PORT, () => {
});
