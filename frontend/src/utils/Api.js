class Api {
    constructor(config) {
        this._baseUrl = config.baseUrl;
        this._headers = config.headers;
    }

    _errorHandler(res) {
        if(res.ok) {
            return res.json();
        }

        return Promise.reject(`Ошибка: ${res.status}`);
    }

    _getHeaders() {
        const jwt = localStorage.getItem("jwt");
        return {
          Authorization: `Bearer ${jwt}`,
          ...this._headers,
        };
      }

    getUserServerInfo() {
        return fetch(`${this._baseUrl}/users/me`, {
            headers: this._getHeaders(),
        }).then(this._errorHandler)
    }

    getCards() {
        return fetch(`${this._baseUrl}/cards`, {
            headers: this._getHeaders(),
        }).then(this._errorHandler)
    }

    addCard(data) {
        return fetch(`${this._baseUrl}/cards`, {
            method: 'POST',
            headers: this._getHeaders(),
            credentials: "include",
            body: JSON.stringify({
                name: data.name,
                link: data.link
            }), 
        }).then(this._errorHandler)
    }
    
    editProfile(data) {
        return fetch(`${this._baseUrl}/users/me`, {
            method: 'PATCH',
            headers: this._getHeaders(),
            body: JSON.stringify(data)
        }).then(this._errorHandler)
    }

    editAvatar(data) {
        return fetch(`${this._baseUrl}/users/me/avatar`, {
            method: 'PATCH',
            headers: this._getHeaders(),
            body: JSON.stringify(data)
        }).then(this._errorHandler)
    }

    deleteCard(cardId) {
        return fetch(`${this._baseUrl}/cards/${cardId}`, {
            method: 'DELETE',
            headers: this._getHeaders(),
        }).then(this._errorHandler)
    }

    addLike(cardId) {
        return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
            method: 'PUT',
            headers: this._getHeaders(),
        }).then(this._errorHandler)
    }

    deleteLike(cardId) {
        return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
            method: 'DELETE',
            headers: this._getHeaders(),
        }).then(this._errorHandler)
    }    
}

export const api = new Api({
    baseUrl: 'https://api.praktikum.karpenko.nomoredomains.xyz',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    }
  });