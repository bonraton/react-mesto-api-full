import PopupWithForm from "./PopupWithForm";
import { React, useState, useContext, useEffect } from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";
export default function EditProfilePopup(props) {
  const currentUser = useContext(CurrentUserContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, props.isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    props.onUpdateUser(name, description);
  }

  function handleChangeName(event) {
    setName(event.target.value);
  }

  function handleChangeDescription(event) {
    setDescription(event.target.value);
  }

  return (
    <PopupWithForm
      onSubmit={handleSubmit}
      onClose={props.onClose}
      button={"Сохранить"}
      id={"profile"}
      isOpen={props.isOpen}
      name="Profile"
      title="Редактировать профиль"
    >
      <input
        onChange={handleChangeName}
        value={name || ""}
        type="text"
        name="profileName"
        placeholder="Ваше Имя"
        className="popup-form__input popup-form__input_name"
        id="profile-input"
        maxLength="40"
        minLength="2"
        required
      />
      <input
        onChange={handleChangeDescription}
        value={description || ""}
        type="text"
        name="profileAbout"
        placeholder="О себе"
        className="popup-form__input popup-form__input_description"
        minLength="2"
        maxLength="200"
        required
      />
    </PopupWithForm>
  );
}
