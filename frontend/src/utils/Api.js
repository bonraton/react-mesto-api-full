export class Api {
  constructor() {
    this._adress = 'https://api.nomoredomains.mesto.nomoredomains.work'
    this._token = `Bearer ${localStorage.jwt}`;
  }

  // Проверяем статус запроса
  _getResponseData(result) {
    if (result.ok) {
      return result.json();
    } else {
      return Promise.reject(`Ошибка: ${result.status}`);
    }
  }

  // Собираем карточки
  getCards() {
    return fetch(`${this._adress}/cards`, {
      headers: {
        'Authorization': this._token,
      },
    }).then((result) => this._getResponseData(result));
  }

  // Берем данные профиля
  getProfileInfo() {
    return fetch(`${this._adress}/users/me`, {
      headers: {
        'Authorization': this._token,
      },
    }).then((result) => this._getResponseData(result));
  }

  // Редактируем данные профиля
  editProfileInfo(profileName, profileDescription) {
    return fetch(`${this._adress}/users/me`, {
      method: "PATCH",
      headers: {
        'Authorization': this._token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: profileName,
        about: profileDescription,
      }),
    }).then((result) => this._getResponseData(result));
  }

  editAvatarInfo(avatar) {
    return fetch(`${this._adress}/users/me/avatar`, {
            method: 'PATCH',
            headers: {
                authorization: this._token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                avatar: avatar
            })
        })
        .then(result => this._getResponseData(result))
}

  // Отправляем карточку
  postCard(data) {
    return fetch(`${this._adress}/cards`, {
      method: "POST",
      headers: {
        authorization: this._token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((result) => this._getResponseData(result));
  }

  // Удаляем карточку
  deleteCard(id) {
    return fetch(`${this._adress}/cards/${id}`, {
      method: "DELETE",
      headers: {
        authorization: this._token,
      },
    }).then((result) => this._getResponseData(result));
  }

  changeLikeStatus(data, status) {
        if (status) {
            this.sendLike(data);
            return this.sendLike(data)
        } else {
            this.removeLike(data)
            return this.removeLike(data)
        }
    }


//   Отправляем лайк
  sendLike(card) {
    return fetch(`${this._adress}/cards/${card}/likes`, {
      method: "PUT",
      headers: {
        authorization: this._token,
        "Content-Type": "application/json",
      },
    }).then((result) => this._getResponseData(result));
  }

  // Удаляем лайк
  removeLike(data) {
    return fetch(`${this._adress}/cards/${data}/likes/`, {
      method: "DELETE",
      headers: {
        authorization: this._token,
      },
    }).then((result) => this._getResponseData(result));
  }
}

export default new Api();
