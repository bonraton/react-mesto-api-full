const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/user');
const { jwtCheck } = require('./middlewares/auth');
const { registerValidator, loginValidator } = require('./middlewares/validation');
const cors  = require('cors');

const { PORT = 3000 } = process.env;
const app = express();


const allowedCors = ['http://localhost:3000',
                      'http://localhost:3001',
                     'https://nomoredomains.mesto.nomoredomains.rocks',
                     'http://nomoredomains.mesto.nomoredomains.rocks',
                     'https://api.nomoredomains.mesto.nomoredomains.work',
                     'http://api.nomoredomains.mesto.nomoredomains.work',
                    ]
const DEFAULT_ALLOWEDMETHODS = 'GET, HEAD, PUT, PATCH, POST, DELETE';

// app.use(cors());
// app.options('*', cors(), function (req,res) {
//   if (req.method === 'OPTIONS') {
//     res.sendStatus(200);
//   }
// });

const corsOptions = {
  origin: "http://api.nomoredomains.mesto.nomoredomains.work/users/me",
  methods: DEFAULT_ALLOWEDMETHODS,
  allowedHeaders: ['content-type', 'authorization'],
  credentials: true,
  optionSuccessStatus: 204,
}

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewurlParser: true,
});

app.use('/users', jwtCheck, require('./routes/user'));
app.use('/cards', jwtCheck, require('./routes/cards'));

app.post('/signin', cors(), loginValidator, login);
app.post('/signup', cors(), registerValidator, createUser);

app.use('*', jwtCheck);

app.use(errors(), (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
});

app.listen(PORT, () => {
});


//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