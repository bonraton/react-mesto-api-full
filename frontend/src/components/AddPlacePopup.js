import PopupWithForm from "./PopupWithForm";
import { React, useState } from "react";


export default function AddPlacePopup(props) {

    const [name, setName] = useState('')
    const [link, setLink] = useState('')

    function handleNameInput (e) {
        setName(e.target.value)
    } 

    function handleLinkInput(e) {
        setLink(e.target.value)
    }

    function submitHandle (e) {
        e.preventDefault()

        props.onSubmit({
            name: name,
            link: link
        })
        setName('')
        setLink('')
    }

    return (
             <PopupWithForm
             onSubmit={submitHandle}
        onClose={props.onClose}
        id="cards"
        isOpen={props.isOpen}
        name="Cards"
        title="Новое место"
        button="Отправить"
      >
        <input
          onChange={handleNameInput}
          value={name}
          type="text"
          placeholder="Название"
          name="cardName"
          className="popup-form__input popup-form__input_name"
          minLength="2"
          maxLength="30"
          required
        />
        <input
            onChange={handleLinkInput}
            value={link}
          type="url"
          placeholder="Ссылка на картинку"
          name="cardLink"
          className="popup-form__input popup-form__input_description"
          required
        />
      </PopupWithForm>
    )
}