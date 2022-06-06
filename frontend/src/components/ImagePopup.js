import React from "react";

function ImagePopup({card, isOpen, onClose}) {

    const {name, link} = card;

    return (
        <article className={`popup popup-image ${isOpen && 'popup_is-opened'}`} >
            <div className="popup-image__block">
                <button type="button" className="popup__close-button popup__close-button_open_image" onClick={onClose}></button>
                <img src={link} alt={name} className="popup-image__image" />
                <h3 className="popup-image__text">{name}</h3>
            </div>
        </article>
    )
}

export default ImagePopup;