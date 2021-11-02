import React from "react";

export default function ImagePopup(props) {
  return (
    <div
      className={`popup popup_preview ${
        props.card !== null ? "popup_visible" : ""
      } `}
      id="popupLargeCard"
    >
      <div className="popup__content popup__content_preview">
        <img src={props.card} alt={props.title} className="popup__image" />
        <button
          onClick={props.onClose}
          type="button"
          className="popup__close-btn popup__close-btn_preview"
        ></button>
        <p className="popup__description">{props.title}</p>
      </div>
    </div>
  );
}
