const express = require('express');
const usersRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const {
  getUsers,
  getUserByID,
  userProfile,
  userUpdateProfile,
  userUpdateAvatar,
} = require('../controllers/users');

usersRoutes.get('/', auth, getUsers);

usersRoutes.get('/me', auth, express.json(), userProfile);

usersRoutes.get(
  '/:userId',
  auth,
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex().required(),
    }),
  }),
  getUserByID,
);

usersRoutes.patch('/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), express.json(), userUpdateProfile);

usersRoutes.patch('/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/(http(s)?:\/\/)?(www\.)?[A-Za-zА-Яа-я0-9-]*\.[A-Za-zА-Яа-я0-9-]{2,8}(\/?[\wа-яА-Я#!:.?+=&%@!_~[\]$'*+,;=()-]*)*/),
  }),
}), express.json(), userUpdateAvatar);

module.exports = {
  usersRoutes,
};
