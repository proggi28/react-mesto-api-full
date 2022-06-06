import React from "react";
import { Link } from "react-router-dom";

export default function HeaderText({ headerEmail, signOut }) {
  return (
    <div className="header__text">
      <p className="header__email">{headerEmail}</p>
      <Link to="/" className="header__link link" onClick={signOut}>
        Выйти
      </Link>
    </div>
  );
}