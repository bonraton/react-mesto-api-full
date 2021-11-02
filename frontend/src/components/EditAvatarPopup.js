import PopupWithForm from "./PopupWithForm";
import { React, useRef } from "react";

export default function EditAvatarPopup(props) {
  // const [avatar, setAvatar] = useState('');

  const avatarInput = useRef();

  function handleSubmit(e) {
    e.preventDefault();
    let avatarValue = avatarInput.current.value;
    props.onUpdateAvatar(avatarValue);
    avatarInput.current.value = "";
  }

  return (
    <PopupWithForm
      onClose={props.onClose}
      onSubmit={handleSubmit}
      isOpen={props.isOpen}
      id="avatar"
      name="Avatar"
      title="Обновить аватар"
      button="Сохранить"
    >
      <input
        ref={avatarInput}
        value={avatarInput.value}
        type="url"
        placeholder="Ссылка на аватар"
        name="avatarLink"
        className="popup-form__input"
        required
      />
    </PopupWithForm>
  );
}
