import React from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export default function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {

    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');

    const currentUser = React.useContext(CurrentUserContext);

    React.useEffect(() => {
        setName(currentUser.name);
        setDescription(currentUser.about);
    }, [currentUser, isOpen]);

    function handleNameChange(e) {
        setName(e.target.value);
    }

    function handleDescriptionChange(e) {
        setDescription(e.target.value);
    }

    function handleSubmit(e) {
        // Запрещаем браузеру переходить по адресу формы
        e.preventDefault();

        // Передаём значения управляемых компонентов во внешний обработчик
        onUpdateUser({
            name,
            about: description,
        });
    }

    return (
        <PopupWithForm
            title="Редактировать профиль"
            name="profile"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
            buttonText='Сохранить'>
            <input id="name" className="popup__input popup__input_type_name" type="text" name="name"
                placeholder="Имя" required minLength="2" maxLength="40" onChange={handleNameChange} value={name||''} />
            <span className="popup__input-error" id="name-error"></span>

            <input id="description" className="popup__input popup__input_type_job" type="text" name="info"
                required placeholder="Занятие" minLength="2" maxLength="200" onChange={handleDescriptionChange} value={description||''} />
            <span className="popup__input-error" id="description-error"></span>
        </PopupWithForm>
    )
}

