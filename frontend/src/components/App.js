import "../index.css";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import React, { useState, useEffect } from "react";
import ImagePopup from "./ImagePopup";
import { api } from "../utils/Api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import InfoTooltip from "./InfoTooltip";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { createBrowserHistory } from "history";
import * as auth from "../utils/auth.js";
import ErrorImage from "../images/popup-fail.png"
import AcceptImage from "../images/popup-accept.png"

function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isErrorPopup, setErrorPopup] = useState(false);
  const [isAcceptPopup, setAcceptPopup] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const history = createBrowserHistory();
  const [currentPath, setCurrentPath] = useState(history.location.pathname);

  const navigate = useHistory();

  function handleCardClick(card) {
    setSelectedCard({ ...card });
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .addLike(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateUser(name, about) {
    api
      .editProfile(name, about)
      .then((data) => {
        setCurrentUser(data);
      })
      .then(() => {
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar(avatar) {
    api
      .editAvatar(avatar)
      .then((data) => {
        setCurrentUser(data);
      })
      .then(() => {
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlaceSubmit(name, link) {
    api
      .addCard(name, link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
      })
      .then(() => {
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }

  function closeAllPopups() {
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setErrorPopup(false);
    setAcceptPopup(false);

    setSelectedCard({});
  }

  const handleSignOut = () => {
    setLoggedIn(false);
    localStorage.removeItem("jwt");
    setCurrentUserEmail("");
    navigate.push("/sign-in");
  };

  const handleSignIn = (email, password) => {
    auth
      .authorize(email, password)
      .then((res) => {
        setLoggedIn(true);
        setCurrentUserEmail(email);
        navigate.push("/");
        localStorage.setItem("jwt", res.token);
      })
      .catch((err) => {
        console.log(err);

        setErrorPopup(true);

        return [];
      });
  };

  const handleSignUp = (email, password) => {
    auth
      .register(email, password)
      .then((res) => {
        if (res.statusCode !== 400) {
          setAcceptPopup(true);

          navigate.push("/sign-in");
        }
      })
      .catch((err) => {
        console.log(err);

        setErrorPopup(true);

        return [];
      });
  };

  useEffect(() => {
    if (!loggedIn) {
      api
        .getUserServerInfo()
        .then((data) => {
          setCurrentUser(data);
        })
        .catch((err) => {
          console.log(err);
        });

      api
        .getCards()
        .then((dataCards) => {
          setCards(dataCards);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [loggedIn]);

  useEffect(() => {
      const jwt = localStorage.getItem("jwt"); 
    if (jwt) {
      auth
        .tokenCheck(jwt)
        .then((res) => {
          setLoggedIn(true);
          navigate.push("/");
          setCurrentUserEmail(res.data.email);
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    }
  }, [navigate, currentUserEmail]);

  useEffect(() => {
    const handleEscClick = (e) => {
      if (e.key === "Escape") {
        closeAllPopups();
      }
    };
    document.addEventListener("keydown", handleEscClick);
    return () => {
      document.removeEventListener("keydown", handleEscClick);
    };
  }, []);

  useEffect(() => {
    const { pathname } = history.location;
    setCurrentPath(pathname);
  }, [history.location]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="pageContent">
        <div className="page">
          <Header
            headerEmail={currentUserEmail}
            signOut={handleSignOut}
            loggedIn={loggedIn}
          />

          <Switch>
            <ProtectedRoute
              loggedIn={loggedIn}
              component={Main}
              onEditAvatar={handleEditAvatarClick}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onCardClick={handleCardClick}
              cards={cards}
              exact
              path="/"
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
            />
            <Route path="/sign-in">
              <Login handleSignIn={handleSignIn} currentPath={currentPath} />
            </Route>

            <Route path="/sign-up">
              <Register handleSignUp={handleSignUp} currentPath={currentPath} />
            </Route>
            <Route>
              {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
            </Route>
          </Switch>

          <Footer />

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />
          <ImagePopup
            isOpen={selectedCard.name && selectedCard.link}
            card={selectedCard}
            onClose={closeAllPopups}
          />

          <InfoTooltip isOpen={isAcceptPopup} onClose={closeAllPopups} popupInfoImage={AcceptImage} />

          <InfoTooltip isOpen={isErrorPopup} onClose={closeAllPopups} popupInfoImage={ErrorImage} />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
