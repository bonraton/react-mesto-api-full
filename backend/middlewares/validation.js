const { Joi, celebrate } = require('celebrate');
const { isURL, isEmail, isMongoId } = require('validator');

const checkUrlValidity = (value) => {
  if (isURL(value)) {
    return value;
  }
  throw new Error('Неверный формат url');
};

const checkEmailValidity = (value) => {
  if (isEmail(value)) {
    return value;
  }
  throw new Error('Неверный формат email');
};

const checkObjectIdValidity = (value) => {
  if (isMongoId(value)) {
    return value;
  }
  throw new Error('Неверный формат objectId');
};

const JoiStringRequire = Joi.string().required();

const createCardValidator = celebrate({
  body: Joi.object().keys({
    name: JoiStringRequire.min(2).max(30),
    link: JoiStringRequire.custom(checkUrlValidity),
  }),
});

const objectIdValidator = celebrate({
  params: Joi.object().keys({
    id: JoiStringRequire.custom(checkObjectIdValidity),
  }),
});

const registerValidator = celebrate({
  body: Joi.object().keys({
    email: JoiStringRequire.custom(checkEmailValidity),
    password: JoiStringRequire.min(8),
    name: Joi.string().min(2).max(30).default('Жак-ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
    avatar: Joi.string().custom(checkUrlValidity).default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
  }),
});

const loginValidator = celebrate({
  body: Joi.object().keys({
    email: JoiStringRequire.custom(checkEmailValidity),
    password: JoiStringRequire.min(8),
  }),
});

const updateUserInfoValidator = celebrate({
  body: Joi.object().keys({
    name: JoiStringRequire.min(2).max(30),
    about: JoiStringRequire.min(2).max(30),
  }),
});

const updateUserAvatarValidator = celebrate({
  body: Joi.object().keys({
    avatar: JoiStringRequire.custom(checkUrlValidity),
  }),
});

module.exports = {
  createCardValidator,
  registerValidator,
  loginValidator,
  objectIdValidator,
  updateUserInfoValidator,
  updateUserAvatarValidator,
};
