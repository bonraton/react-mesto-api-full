import React from "react";
import logo from "../images/logo.svg";
import { Link } from "react-router-dom";

function Header(props) {

  return (
    <header className="header">
      <div className="header__container">
        <img src={logo} alt="логотип" className="header__logo" />
        <button onClick={props.onClick} className="header__button"></button>
      </div>
      <div
        className={`header__autorization-container ${
          props.isClicked ? "header__autorization-container_visible" : ""
        }`}
      >
        <p className="header__user-email">{props.userEmail}</p>
        <Link className="header__link" to={props.path}>
          <p onClick={props.onSignOut} className="header__link">
            {props.link}
          </p>
        </Link>
      </div>
    </header>
  );
}

export default Header;
