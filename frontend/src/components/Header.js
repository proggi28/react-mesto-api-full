import logo from '../images/png/logo.png';
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import HeaderText from './HeaderText';
import HeaderLogin from './HeaderLogin';
import HeaderRegister from './HeaderRegister';

function Header({ headerEmail, signOut, loggedIn }) {

    return (
        <header className="header">
            <img className="header__logo" src={logo} alt="Логотип страницы" />
            <Switch>
                {loggedIn && <Route exact path="/"><HeaderText headerEmail={headerEmail} signOut={signOut} /></Route>}
                <Route path="/sign-up"><HeaderLogin /></Route>
                <Route path="/sign-in"><HeaderRegister /></Route>
            </Switch>
        </header>
    )
}

export default Header;