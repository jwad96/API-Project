// frontend/src/components/Navigation/ProfileButton.js
import React, { useState, useEffect, useContext } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';

import {testLogin} from "../../store/session";
import LoginFormModal from '../LoginFormModal';
import { NavLink } from 'react-router-dom';
import {ModalContext} from "../../context/Modal";

function ProfileButton({ user }) {
  const {setShowSignupModal, setShowLoginModal} = useContext(ModalContext);
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
        <ul className="profile-dropdown" id="logged-in">
          <li id="username-display">{user.username}</li>
          <li id="email-display">{user.email}</li>
          <li>
            <button className="menu-button" id="logout-button" onClick={logout}>Log Out</button>
          </li>
        </ul>
    )
  } else if (!user) {
    menu = (
      <ul className="profile-dropdown" id="logged-out">
        <li>
          <button onClick={e=>setShowLoginModal(true)} id="login-button" className="menu-button">Login</button>
        </li>
        <li>
          {/* <NavLink to="/signup"><button>Sign Up</button></NavLink> */}
          <button  className="menu-button" id="signup-button" onClick={e=>setShowSignupModal(true)}>Sign Up</button>
        </li>
        <li><button className="menu-button" id="demo-button" onClick={e=>dispatch(testLogin())}>Demo-lition</button></li>
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
