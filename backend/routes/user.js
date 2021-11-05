const router = require('express').Router();
const {
  getUsers, updateProfile, updateAvatar, getUser,
} = require('../controllers/user');

const { objectIdValidator, updateUserInfoValidator, updateUserAvatarValidator } = require('../middlewares/validation');

router.get('/', getUsers);

router.get('/me', objectIdValidator, getUser);

router.get('/:id', objectIdValidator, getUser);

router.patch('/me', updateUserInfoValidator, updateProfile);

router.patch('/me/avatar', updateUserAvatarValidator, updateAvatar);

module.exports = router;
