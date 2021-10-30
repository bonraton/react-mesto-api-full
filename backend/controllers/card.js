/* eslint-disable consistent-return */
const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (card.owner.equals(req.user._id)) {
        return card.deleteOne(card)
          .then(() => res.send({ data: card }));
      }
      next(new ForbiddenError('Вы не можете удалить чужую карточку'));
    })
    .catch(() => {
      next(new NotFoundError('Данная карточка не найдена'));
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).then((like) => {
    if (like) {
      res.status(200).send({ data: like });
    }
    throw new NotFoundError('Данная карточка не найдена');
  })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((like) => {
      if (like) {
        res.status(200).send({ data: like });
      }
      throw new NotFoundError('Данная карточка не найдена');
    })
    .catch(next);
};

module.exports = {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
};
