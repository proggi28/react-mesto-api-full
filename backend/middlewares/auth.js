const jwt = require('jsonwebtoken');
const ForbiddenError = require('../errors/ForbiddenError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const JWT_SECRET = 'verylongpasswordoftheyandexpraktikumstudent';

// eslint-disable-next-line consistent-return
module.exports = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    next(new UnauthorizedError('Необходима авторизация'));
  } else {
    const token = authorization.replace('Bearer ', '');
    let payload;

    try {
      payload = await jwt.verify(token, JWT_SECRET);
    } catch (err) {
      next(new ForbiddenError('Необходима авторизация'));
    }

    req.user = payload;

    next();
  }
};
