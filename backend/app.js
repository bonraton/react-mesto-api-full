const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/user');
const { jwtCheck } = require('./middlewares/auth');
const { registerValidator, loginValidator } = require('./middlewares/validation');
const { cors } = require('cors');

const corsOptions = {
  origin: "*",
  methods: DEFAULT_ALLOWEDMETHODS,
  allowedHeaders: reqHeaders
}

const allowedCors = ['http://localhost:3000',
                     'https://nomoredomains.mesto.nomoredomains.rocks',
                     'http://nomoredomains.mesto.nomoredomains.rocks',
                     'https://api.nomoredomains.mesto.nomoredomains.work',
                     'http://api.nomoredomains.mesto.nomoredomains.work',
                     'http://nomoredomains.mesto.nomoredomains.rocks/signup',
                     'http://nomoredomains.mesto.nomoredomains.rocks/users/me'
                    ]
const DEFAULT_ALLOWEDMETHODS = 'GET, HEAD, PUT, PATCH, POST, DELETE';


const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewurlParser: true,
});

app.use(cors(corsOptions), function(req, res, next) {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  next();
})

app.use(cors(corsOptions), function(req, res, next) {
  const { method } = req;
  const requestHeaders  = req.headers['access-control-request-headers'];
  if (method === 'OPTIONS') {
    res.status(200);
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWEDMETHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  next();
})

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
