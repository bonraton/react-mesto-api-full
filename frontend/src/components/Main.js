import React from "react";  
import Card from "./Card.js";
import CurrentUserContext from "../contexts/CurrentUserContext.js";

export default function Main(props) {

  const userContext = React.useContext(CurrentUserContext)
  
  return (
    <main>
      <section className="profile">
        <img src={userContext.avatar} alt="аватар" className="profile__avatar" />
        <div className="profile__avatar-overlay">
          <button
            onClick={props.onEditAvatar}
            type="button"
            className="profile__avatar-edit-btn"
          ></button>
        </div>
        <div className="profile__info">
          <h1 className="profile__name">{userContext.name}</h1>
          <button
            onClick={props.onEditProfile}
            type="button"
            className="profile__edit-btn"
          ></button>
          <p className="profile__description">{userContext.about}</p>
        </div>
        <button
          onClick={props.onAddPlace}
          type="button"
          className="profile__add-btn"
        ></button>
      </section>

      <section className="elements">
        {props.cards.map((card) => {

          return (
            <Card
              key={card.id ?? Math.random()}
              _id={card.id}
              link={card.link}
              name={card.name}
              onCardClick={props.onCardClick}
              likes={card.likes}
              onCardLike={props.onCardLike}
              onDeleteCard={props.onDeleteCard}
              card={card}
              owner={card.owner}
            />
          );
        })}
      </section>
    </main>
  );
}
