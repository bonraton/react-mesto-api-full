
import CurrentUserContext from "../contexts/CurrentUserContext";
import React, { useEffect, useState } from "react";
import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup.js";
import Api from "../utils/Api.js";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import Login from "./Login";
import InfoTooltip from "./InfoTooltip";
import Register from "./Register";
import { Route, withRouter, useHistory, Redirect } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import * as auth from "../utils/auth";

function App(props) {
  const [currentUser, setCurrentUser] = useState({});
  const [userInfo, setuserInfo] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [headerInfo, setHeaderInfo] = useState(false);

  const history = useHistory();

  //попапы
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditRegisterPopupOpen, setIsEditRegisterPopupOpen] = useState(false);
  const [isEditRegisterSuccsess, setIsEditRegisterSuccsess] = useState(false);

  //карточки
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCardTitle, setSelectedCardTitle] = useState(null);
  const [cards, setCards] = useState([]);

  //обработчики попапов

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function onCardClick(card) {
    setSelectedCard(card.link);
    setSelectedCardTitle(card.name);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsEditRegisterPopupOpen(false);
    setSelectedCard(null);
  }

  function registerSuccsess() {
    setIsEditRegisterSuccsess(true);
  }

  function handleRegisterPopupOpen() {
    setIsEditRegisterPopupOpen(true);
  }

  const closeByEsc = (event) => {
    const EscKeyCode = 27;
    if (event.keyCode === EscKeyCode) {
      closeAllPopups();
    }
  };

  const closeByOverlay = (event) => {
    const overlay = "popup_visible";
    const closeButton = "popup__close-btn";
    const target = event.target.className;
    if (target.includes(overlay) || target.includes(closeButton)) {
      closeAllPopups();
    }
  };

  //слушатели для закрытия по оверлею и Esc
  useEffect(() => {
    window.addEventListener("keydown", closeByEsc);
    window.addEventListener("click", closeByOverlay);
  }, [loggedIn]);

  
  useEffect(() => {
    getUser();
    getCards();
  }, [loggedIn, setCards, setCurrentUser]);

  async function getUser() {
    try {
      const result = await Api.getProfileInfo();
      if (result) {
        setCurrentUser(result);
      }
    } catch (e) {
      console.log(`Ошибка при получении данных`)
    }
  }

  //Обновлаяем данные профиля
  async function handleUpdateUser(name, about) {
    try {
      const result = await Api.editProfileInfo(name, about);
      if (result) {
        setCurrentUser(result.data);
        closeAllPopups();
        console.log(result, result.data)
      }
    } catch (e) {
      console.log(`Ошибка при отправке данных ${e}`);
    }
  }

  //Обновляем аватар
  async function handleUpdateAvatar(avatar) {
    try {
      const result = await Api.editAvatarInfo(avatar);
      if (result) {
        setCurrentUser(result.data);
        closeAllPopups();
      }
    } catch (e) {
      console.log(`Ошибка при отправке данных ${e}`);
    }
  }

  //берем карточки с сервера
  async function getCards() {
    try {
      const result = await Api.getCards();
      if (result) {
        const card = result.data.map((card) => {
          return {
            key: card._id,
            link: card.link,
            name: card.name,
            _id: card._id,
            likes: card.likes,
            owner: card.owner,
          };
        });
        setCards(card);
      }
    } catch (e) {
      console.log(`Ошибка при отправке данных ${e}`);
    }
  }

  // лайк карточки
  async function handleCardLike(card) {
    const isLiked = card.likes.some((item) => item === currentUser._id);
      try {
        const result = await Api.changeLikeStatus(card._id, !isLiked);
        if (result.data) {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? result.data : c))
        );
        }
      } catch (e) {
        console.log(`Ошибка при отправке данных ${e}`);
      }
  }

  //Добавление карточки
  async function handleAddPlaceSubmit(data) {
    try {
      const result = await Api.postCard(data);
      setCards([result.data, ...cards]);
      closeAllPopups();
    } catch (e) {
      console.log(`Ошибка при отправке данных ${e}`);
    }
  }

  //удаление карточки
  async function handleCardDelete(card) {
    try {
      await Api.deleteCard(card._id);
      setCards(cards.filter((c) => c._id !== card._id));
    } catch (e) {
      console.log(`Ошибка при отправке данных ${e}`);
    }
  }

  //регистрация
  async function handleRegister(email, password) {
    try {
      let result = await auth.register(email, password);
      if (result) {
        registerSuccsess();
        handleRegisterPopupOpen();
        props.history.push("./signin");
      } 
    } catch (e) {
      handleRegisterPopupOpen();
      console.log(e);
    }
  }

  //логин
  async function handleLogin(email, password) {
    try {
      let result = await auth.login(email, password);
      if (result.token) {
        setLoggedIn(true);
        props.history.push("./");
        setuserInfo(email);
        closeAllPopups()
      }
    } catch (e) {
      setIsEditRegisterSuccsess(false)
      handleRegisterPopupOpen(); 
      console.log(e);
    }
  }

  const tokenCheck = () => {
    const jwt = localStorage.getItem("jwt");
    auth.getContent(jwt)
    .then((result) => {
      setLoggedIn(true);
      setuserInfo(result.email);
      setCurrentUser(result)
    })
    .catch((e) =>
    console.log(`Ошибка ${e}`))
  };


  function clicked() {
    setHeaderInfo(true);
    setHeaderInfo(!headerInfo);
  }

  function signOut() {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
    history.push("./signup");
  }

  useEffect(() => {
    tokenCheck()
  }, [loggedIn, history])

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <div className="page__container">
          <Route path="/signin">
            <Header link="Регистрация" path="/signup" onSignOut={signOut} />
            <Login
              onLogin={handleLogin}
              onPopupOpen={handleRegisterPopupOpen}
            />
            <InfoTooltip
              isOpen={isEditRegisterPopupOpen}
              onClose={closeAllPopups}
              isSuccsess={isEditRegisterSuccsess}
              fail="Что-то пошло не так! Пропробуйте еще раз"
              succsess="Вы успешно зарегистрировались!"
            />
          </Route>
          <Route path="/signup">
            <Header
              link="Войти"
              path="/signin"
              onClick={clicked}
              onSignOut={signOut}
            />
            <Register onRegister={handleRegister} onClick={clicked} />
            <InfoTooltip
              isOpen={isEditRegisterPopupOpen}
              onClose={closeAllPopups}
              isSuccsess={isEditRegisterSuccsess}
              fail="Что-то пошло не так! Пропробуйте еще раз"
            />
          </Route>

          <Route path="/" exact>
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}

            <Header
              link="Выйти"
              userEmail={userInfo}
              path="/signin"
              onClick={clicked}
              isClicked={headerInfo}
              onSignOut={signOut}
            ></Header>
            <ProtectedRoute
              path="/"
              loggedIn={loggedIn}
              component={Main}
              onEditAvatar={handleEditAvatarClick}
              onAddPlace={handleAddPlaceClick}
              onEditProfile={handleEditProfileClick}
              onCardClick={onCardClick}
              onCardLike={handleCardLike}
              onDeleteCard={handleCardDelete}
              cards={cards}
            ></ProtectedRoute>
            <Footer />
          </Route>
          <EditProfilePopup
            onUpdateUser={handleUpdateUser}
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
          />
          <EditAvatarPopup
            onUpdateAvatar={handleUpdateAvatar}
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
          />
          <AddPlacePopup
            onSubmit={handleAddPlaceSubmit}
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
          />
          <ImagePopup
            title={selectedCardTitle}
            card={selectedCard}
            onClose={closeAllPopups}
          />
        </div>
        <Route path="*">
          {loggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
        </Route>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);