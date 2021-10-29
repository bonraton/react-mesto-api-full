const router = require('express').Router();
const {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/card');
const { createCardValidator, objectIdValidator } = require('../middlewares/validation');

router.get('/', getAllCards);

router.post('/', createCardValidator, createCard);

router.delete('/:id', objectIdValidator, deleteCard);

router.put('/:id/likes', objectIdValidator, likeCard);

router.delete('/:id/likes', objectIdValidator, dislikeCard);

module.exports = router;
