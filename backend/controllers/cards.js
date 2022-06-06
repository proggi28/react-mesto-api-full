const Card = require('../models/card');
const ForbiddenError = require('../errors/ForbiddenError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (err) {
    next(err);
  }
};

const deleteCardById = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      next(new NotFoundError('Карточка не найдена'));
      return;
    }
    if (!card.owner.equals(req.user.id)) {
      next(new ForbiddenError('Нельзя удалять чужие карточки'));
      return;
    }
    const cardDelById = await Card.findByIdAndRemove(req.params.cardId);
    res.status(200).send(cardDelById);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные'));
      return;
    }
    next(err);
  }
};

const createCard = async (req, res, next) => {
  try {
    const card = new Card({
      name: req.body.name,
      link: req.body.link,
      owner: req.user.id,
    });
    res.status(201).send(await card.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      return;
    }
    next(err);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const addLikeCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user.id } },
      { new: true },
    );
    if (!addLikeCard) {
      next(new NotFoundError('Карточка не найдена'));
      return;
    }
    res.status(200).send(addLikeCard);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
      return;
    }
    if (err.statusCode === 404) {
      next(new NotFoundError('Карточка не найдена'));
      return;
    }
    next(err);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const addDislikeCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user.id } }, // убрать _id из массива
      { new: true },
    );
    if (!addDislikeCard) {
      next(new NotFoundError('Карточка не найдена'));
      return;
    }
    res.status(200).send(addDislikeCard);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные для снятия лайка'));
      return;
    }
    if (err.statusCode === 404) {
      next(new NotFoundError('Карточка не найдена'));
      return;
    }
    next(err);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
