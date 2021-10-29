import React from "react"

export default function PopupWithForm(props) {

    return (
        <div className={`popup ${props.isOpen ? 'popup_visible' :''}`} id={`popup${props.name}`}>
            <div className="popup__content">
                <h2 className="popup__title">{props.title}</h2>
                <form onSubmit={props.onSubmit} name={`popup${props.name}Form`} id={`${props.id}-form`} method="post" className="popup-form" required>
                    {props.children}
                    <input type="submit" name="submit" value={props.button} className="popup-form__submit" />
                </form>
                <button onClick={props.onClose} type="button" className="popup__close-btn"></button>
            </div>
        </div>
    )
}

//нет спанов с ошибкой 

