const winston = require('winston');
const expressWinston = require('express-winston');

const requestLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filemame: 'request.log' })],
  format: winston.format.json(),
});

const errorLogger = expressWinston.errorLoger({
  transports: [new winston.transport.File({ filename: 'error.log' })],
  format: winston.format.json(),
});

module.exports = { requestLogger, errorLogger };
