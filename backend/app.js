const express = require('express');
const mongoose = require('mongoose');
const cors  = require('cors');
const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/user');
const { jwtCheck } = require('./middlewares/auth');
const { registerValidator, loginValidator } = require('./middlewares/validation');


const { PORT = 3000 } = process.env;
const app = express();

// app.use(function(req, res, next) {
//   const { origin } = req.headers;
//   res.header('Acces-Control-Allow-Origin', origin);
//   res.header('Methods', ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE']);
//   res.header('Acces-Control-Allow-Headers', ['content-type', 'authorization'])
//   next();
// })

const corsOptions = {
  origin: ['https://www.api.nomoredomains.mesto.nomoredomains.work',
            'https://nomoredomains.mesto.nomoredomains.rocks/signin',
            'http://localhost:3000'],
  methods: ['OPTIONS', 'GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: [
    'Content-Type',
    'origin',
    'x-access-token',
    'authorization'
  ],
  credentials: true,
};
app.use(function(req, res, next) {
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  }
  next();
})
app.use("*", cors(corsOptions));
// app.options("*", cors(corsOptions));

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


//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

// const corsOptions = {
//   origin: "https://api.nomoredomains.mesto.nomoredomains.work",
//   allowedHeaders: 'Content-Type, Authorization',
//   methods: DEFAULT_ALLOWEDMETHODS,
//   credentials: true,
//   optionSuccessStatus: 204,
// }

// app.use(cors({
//   origin: function (origin , callback) {
//     if (!origin) return callback(null, true);
//     if (allowedCors.indexOf(origin) === -1) {
//       const msg = 'HATE CORS';
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   }
// }));
// app.options('*', cors(corsOptions));


// app.use(cors(corsOptions));


// const allowedCors = ['http://localhost:3000',
//                       'http://localhost:3001',
//                      'https://nomoredomains.mesto.nomoredomains.rocks',
//                      'http://nomoredomains.mesto.nomoredomains.rocks',
//                      'https://api.nomoredomains.mesto.nomoredomains.work',
//                      'http://api.nomoredomains.mesto.nomoredomains.work',
                    // ]
// const DEFAULT_ALLOWEDMETHODS = 'GET, HEAD, PUT, PATCH, POST, DELETE';