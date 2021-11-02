const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../configs/index');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const options = {
  runValidators: true,
  new: true,
};

const getUsers = (req, res, next) => User.find({})
  .then((user) => res.send({ data: user }))
  .catch(next);

const getUser = (req, res, next) => User.findById(req.user._id)
  .then((user) => {
    if (user) {
      res.status(200).send(user);
    }
    throw new NotFoundError('Пользователь с данным Id не найден');
  })
  .catch(next);

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => User.create({
    name, about, avatar, email, password: hash,
  }))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      if (err.name === 'MongoServerError') {
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
      throw new BadRequestError('Пользователь с данным Id не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, options)
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      }
      throw new BadRequestError('Пользователь с данным Id не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

module.exports = {
  getUsers, getUser, createUser, updateProfile, updateAvatar, login,
};
