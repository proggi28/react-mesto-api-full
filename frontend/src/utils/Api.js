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

    getUserServerInfo() {
        return fetch(`${this._baseUrl}/user/me`, {
            headers: this._headers,
        }).then(this._errorHandler)
    }

    getCards() {
        return fetch(`${this._baseUrl}/card`, {
            headers: this._headers
        }).then(this._errorHandler)
    }

    addCard(item) {
        return fetch(`${this._baseUrl}/card`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify(item) 
        }).then(this._errorHandler)
    }
    
    editProfile(data) {
        return fetch(`${this._baseUrl}/user/me`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify(data)
        }).then(this._errorHandler)
    }

    editAvatar(data) {
        return fetch(`${this._baseUrl}/user/me/avatar`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify(data)
        }).then(this._errorHandler)
    }

    deleteCard(cardId) {
        return fetch(`${this._baseUrl}/card/${cardId}`, {
            method: 'DELETE',
            headers: this._headers
        }).then(this._errorHandler)
    }

    deleteLike(cardId) {
        return fetch(`${this._baseUrl}/card/like/${cardId}`, {
            method: 'DELETE',
            headers: this._headers
        }).then(this._errorHandler)
    }

    addLike(cardId, isLiked) {
        return fetch(`${this._baseUrl}/card/${cardId}/like`, {
            method: `${isLiked ? 'PUT' : 'DELETE'}`,
            headers: this._headers
        }).then(this._errorHandler)
    }

    
}

const token = localStorage.getItem('jwt');
export const api = new Api({
    baseUrl: 'https://api.praktikum.karpenko.nomoredomains.xyz',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  });