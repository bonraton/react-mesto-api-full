const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { JWT_SECRET } = require('../helpers/constants');

const options = {
  runValidators: true,
  new: true,
};

const getUsers = (req, res, next) => User.find({})
  .then((user) => res.send({ data: user }))
  .catch(next);

const getUser = (req, res, next) => User.findById(req.params.id)
  .then((user) => {
    if (user) {
      res.status(200).send(user);
    }
    throw new NotFoundError('Пользователь с данным Id не найден');
  })
  .catch(next);

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('пользователь с данным Id не найден');
      }
      res.send(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => User.create({
    name, about, avatar, email, password: hash,
  }))
    .then(() => {
      res.send({
        data: {
          name, about, avatar, email,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      if (err.name === 'MongoServerError' && err.code === 11000) {
        throw new ConflictError('пользователь c таким email уже существует');
      }
      next(err);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = { token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' }) };
      res.send(token);
    })
    .catch(() => next(new UnauthorizedError('Пользователь с указанным email не найден')));
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, options)
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      }
      throw new NotFoundError('Пользователь с данным Id не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, options)
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      }
      throw new NotFoundError('Пользователь с данным Id не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers, getUser, createUser, updateProfile, updateAvatar, login, getCurrentUser,
};
