/* eslint-disable jsx-a11y/heading-has-content */
import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import Card from "./Card";


function Main({ onEditProfile, onAddPlace, onEditAvatar, onCardClick, onCardLike, onCardDelete, cards }) {

    const currentUser = React.useContext(CurrentUserContext);

    return (
        <main className="content">
            <section className="profile">
                <div className="profile__image-button" onClick={onEditAvatar}>
                    <img src={currentUser.avatar} alt="Аватарка" className="profile__avatar" />
                </div>
                <div className="profile__info">
                    <div className="profile__wrapper">
                        <h1 className="profile__title">{currentUser.name}</h1>
                        <p className="profile__text">{currentUser.about}</p>
                    </div>
                    <button type="button" className="profile__edit-button" onClick={onEditProfile}></button>
                </div>
                <button type="button" className="profile__add-button" aria-label="Кнопка редактирования" onClick={onAddPlace}></button>
            </section>
            <section className="cards">
                <ul className="cards__list-style">
                </ul>
            </section>
            <section className="cards">
                <ul className="cards__list-style">
                    {cards.map((card) => (
                        <Card key={card._id} card={card} onCardClick={onCardClick} onCardLike={onCardLike} onCardDelete={onCardDelete} />
                    ))}

                </ul>
            </section>
        </main>
    )
}

export default Main;