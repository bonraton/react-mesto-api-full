const router = require('express').Router();
const {
  getUsers, updateProfile, updateAvatar, getUser, getCurrentUser,
} = require('../controllers/user');

const { objectIdValidator, updateUserInfoValidator, updateUserAvatarValidator } = require('../middlewares/validation');

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.patch('/me', updateUserInfoValidator, updateProfile);

router.get('/:id', objectIdValidator, getUser);

router.patch('/me/avatar', updateUserAvatarValidator, updateAvatar);

module.exports = router;
