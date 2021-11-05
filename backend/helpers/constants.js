const { NODE_ENV, JWT_SECRET } = process.env;

const constants = {
  JWT_SECRET: NODE_ENV === 'production' ? JWT_SECRET : 'super-duper-mega-strong-secret',
};

module.exports = { constants };
