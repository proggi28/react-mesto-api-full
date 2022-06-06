import React from "react";
import { useRef } from "react";
import PopupWithForm from "./PopupWithForm";

export default function EditAvatarPopup({isOpen, onClose, onUpdateAvatar}) {

    const avatarRef = useRef();

    function handleAvatarChange(e) {
        e.preventDefault();

        onUpdateAvatar({
            avatar: avatarRef.current.value
        })
    }

    return (
        <PopupWithForm
            title="Обновить аватар"
            name="avatar"
            isOpen={isOpen}
            onClose={onClose}
            buttonText='Сохранить'
            onSubmit={handleAvatarChange}>
            <input id="avatar" className="popup__input popup__input_avatar" type="url" name="avatar"
                placeholder="Обновить аватар" required ref={avatarRef}/>
            <span className="popup__input-error" id="avatar-error"></span>
        </PopupWithForm>
    )
}