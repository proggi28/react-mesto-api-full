const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const User = require('../models/user');

const { JWT_SECRET } = process.env;

const SALT_ROUNDS = 10;

// eslint-disable-next-line consistent-return
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

// eslint-disable-next-line consistent-return
const getUserByID = async (req, res, next) => {
  try {
    const userById = await User.findById(req.params.userId);
    if (!userById) {
      next(new NotFoundError('Пользователь по заданному id отсутствует в базе'));
      return;
    }
    res.status(200).send(userById);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Невалидный id пользователя'));
      return;
    }
    next(err);
  }
};

const createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    const savedUser = await user.save();
    const { password: removedPassword, ...result } = savedUser.toObject();
    res.status(201).send(result);
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictError('Данный email уже зарегистрирован'));
      return;
    }
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      return;
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new BadRequestError('Неправильные логин или пароль'));
    return;
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    next(new UnauthorizedError('Неправильные логин или пароль'));
    return;
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    next(new UnauthorizedError('Неправильные логин или пароль'));
    return;
  }

  const token = await jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
  res.status(200).send({ token });
};

// eslint-disable-next-line consistent-return
const userProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    return res.status(200).send(user);
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
};

const userUpdateProfile = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const updateUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    );
    res.status(200).send(updateUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      return;
    }
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные'));
      return;
    }
    next(err);
  }
};

const userUpdateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const updateUser = await User.findByIdAndUpdate(
      req.user.id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    );
    res.status(200).send(updateUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
      return;
    }
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные'));
      return;
    }
    next(err);
  }
};

module.exports = {
  getUsers,
  getUserByID,
  createUser,
  login,
  userProfile,
  userUpdateProfile,
  userUpdateAvatar,
};
