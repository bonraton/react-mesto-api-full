const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../configs');
const UnauthorizedError = require('../errors/UnauthorizedError');

const jwtCheck = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Ошибка аутентификации');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError('Ошибка аутентификации');
  }
  req.user = payload;
  return next();
};

module.exports = { jwtCheck };
