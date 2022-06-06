import React, { useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";

export default function AddPlacePopup({ isOpen, onClose, onAddPlace }) {

    const [name, setName] = useState('');
    const [link, setLink] = useState('');

    function handleNameChange(e) {
        setName(e.target.value);
    }

    function handleLinkChange(e) {
        setLink(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();

        onAddPlace({
            name,
            link
        })
    }

    useEffect(() => {
        setName('');
        setLink('');
    }, [isOpen]);

    return (<PopupWithForm
        title="Новое место"
        name="add-card"
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
        buttonText='Создать'>

        <input
            id="title"
            className="popup__input popup__input_type_title"
            type="text"
            name="title"
            placeholder="Название"
            required
            minLength="2"
            maxLength="30"
            value={name || ''}
            onChange={handleNameChange} />

        <span className="popup__input-error" id="title-error"></span>

        <input
            id="url"
            className="popup__input popup__input_type_place"
            type="url"
            name="url"
            placeholder="Ссылка на картинку"
            required
            value={link || ''}
            onChange={handleLinkChange} />

        <span className="popup__input-error" id="url-error"></span>
    </PopupWithForm>)
}