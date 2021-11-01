const router = require('express').Router();
const {
  getUsers, updateProfile, updateAvatar, getUser,
} = require('../controllers/user');

const { objectIdValidator, updateUserInfoValidator, updateUserAvatarValidator } = require('../middlewares/validation');

router.get('/', getUsers);

router.get('/:id', getUser);

router.get('/me', getUser);

router.patch('/me', updateUserInfoValidator, updateProfile);

router.patch('/me/avatar', updateUserAvatarValidator, updateAvatar);

module.exports = router;
