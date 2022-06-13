import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card({ card, onCardClick, onCardLike, onCardDelete }) {

    const { name, link, likes, owner } = card;

    const currentUser = React.useContext(CurrentUserContext);

    // Определяем, являемся ли мы владельцем текущей карточки
    const isOwn = owner === currentUser._id;

    // Создаём переменную, которую после зададим в `className` для кнопки удаления
    const cardDeleteButtonClassName =
        `card__button-delete ${isOwn ? 'card__button-delete' : 'card__button-delete_hidden'}`;

    // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
    const isLiked = likes.some(i => i === currentUser._id);

    // Создаём переменную, которую после зададим в `className` для кнопки лайка
    const cardLikeButtonClassName = `'card__heart' ${!isLiked ? 'card__heart' : 'card__heart_active'}`;


    function handleClick() {
        onCardClick(card);
    }

    function handleLikeClick() {
        onCardLike(card);
    }

    function handleCardClick() {
        onCardDelete(card);
    }


    return (
        <li className="card">
            <img src={link} alt={name} className="card__image" onClick={handleClick} />
            <button type="button" className={`card__button-delete ${cardDeleteButtonClassName}`} onClick={handleCardClick}></button>
            <div className="description">
                <h2 className="card__title">{name}</h2>
                <div className="card__like-container">
                    <button type="button" className={`card__heart ${cardLikeButtonClassName}`} onClick={handleLikeClick}></button>
                    <p className="card__like-length">{likes.length}</p>
                </div>
            </div>
        </li>
    )
}

export default Card;