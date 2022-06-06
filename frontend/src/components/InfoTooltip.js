import React from "react";

export default function InfoTooltip({
  popupType,
  popupInfoImage,
  isOpen,
  onClose,
}) {
  return (
    <div
      className={`popup popup-info popup-info__${popupType} ${
        isOpen && "popup_is-opened"
      }`}
      onClick={onClose}
    >
      <div className="popup__container popup-info__container">
        <button type="button" className="popup__close-button button"></button>
        <img
          src={popupInfoImage}
          alt="иконка для попапа"
          className="popup-info__image"
        />
      </div>
    </div>
  );
}