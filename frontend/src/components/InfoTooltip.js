export default function InfoTooltip(props) {
  return (
    <div className={`popup ${props.isOpen ? "popup_visible" : ""}`}>
      <div className="popup__content">
        <img
          className={`popup__image ${
            props.isSuccsess ? "popup__image_succsess" : "popup__image_fail"
          }`}
        ></img>
        <p className="popup__subtitle">
          {props.isSuccsess
            ?  `${props.succsess}`
            : `${props.fail}`}
        </p>
        <button onClose={props.onClose} className="popup__close-btn"></button>
      </div>
    </div>
  );
}