// frontend/src/components/Navigation/ProfileButton.js
import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';

import {testLogin} from "../../store/session";
import LoginFormModal from '../LoginFormModal';
import { NavLink } from 'react-router-dom';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [profileButtonActive, setProfileButtonActive] = useState("");
  
  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
    setProfileButtonActive("profile-button-active");
  };
  
  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = () => {
      setShowMenu(false);
      setProfileButtonActive("");
    };

    document.addEventListener('click', closeMenu);
  
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  let menu;

  if (user) {
    console.log("HERE IS USER", user)
    menu = (
        <ul className="profile-dropdown">
          <li id="username-display">{user.username}</li>
          <li id="email-display">{user.email}</li>
          <li>
            <button id="logout-button" onClick={logout}>Log Out</button>
          </li>
        </ul>
    )
  } else if (!user) {
    menu = (
      <ul className="profile-dropdown">
        <li>
          <LoginFormModal />
        </li>
        <li>
          <NavLink to="/signup"><button>Sign Up</button></NavLink>
        </li>
        <li><button onClick={e=>dispatch(testLogin())}>Demo-lition</button></li>
      </ul>
    )

  }


  return (
    <>
      <button className={`profile-button ${profileButtonActive}`} onClick={openMenu}>
        <i class="fa-solid fa-bars"/>
        <i className="fas fa-user-circle" />
      {showMenu && menu}
      </button>
    </>
  );
}

export default ProfileButton;
