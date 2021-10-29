import React from 'react'
import CurrentUserContext from '../contexts/CurrentUserContext'

const Card = ({card, ...props}) => {
  const currentUserContext = React.useContext(CurrentUserContext)

  const isOwn = card.owner._id === currentUserContext._id
  const cardDeleteButtonClassName=(`${isOwn ? 'element__delete-btn' : 'element__delete-btn_inactive'}`)
  const isLiked = props.likes.some(item => item._id === currentUserContext._id);
  const   cardLikeButtonClassName = (`${isLiked ? 'element__like_active' : 'element__like'}`)
  
  function handleLikeClick() {
    props.onCardLike(card)
  }

  function handleImageClick() {
    props.onCardClick(card);
  }

  function handleDeleteclick() {
    props.onDeleteCard(card)
  }

  return (
      <div className="element">
        <img onClick={handleImageClick} alt={props.title} className="element__image" src={props.link} />
        <button onClick={handleDeleteclick} type="button" name="delete-btn" className={cardDeleteButtonClassName}></button>
        <div className="element__description">
          <h2 className="element__title">{props.name}</h2>
          <div className="element__like-section">
            <button onClick={handleLikeClick} type="button" className={cardLikeButtonClassName}></button>
            <span className="element__like-counter">{props.likes.length}</span>
          </div>
        </div>
      </div>
  )
}

export default Card