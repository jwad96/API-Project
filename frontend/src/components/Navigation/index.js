// frontend/src/components/Navigation/index.js
import React from 'react';
import {Route, useHistory} from "react-router"
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {testLogin} from "../../store/session";
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';
import SpotForm from "../SpotForm";
import './Navigation.css';

import SignupFormModal from "../SignupFormModal";

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  const history = useHistory();

  const onCreateSpot = (e) => {
    history.push("/spot-form");
  }

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (<div id="session-links">
      <button id="create-spot" onClick={onCreateSpot}>Add spot</button>
      <ProfileButton user={sessionUser} />
      <Route path="/spot-form">
        <SpotForm />
      </Route>
    </div>
    );
  } else {
    sessionLinks = (
      <div id="session-links">
        {!sessionUser && <LoginFormModal />}
        {!sessionUser && <SignupFormModal />}
        <ProfileButton user={sessionUser} />
      </div>
    );
  }

  return (
    <div id="nav">
      <NavLink id="home-button" exact to="/">Home</NavLink>
      {isLoaded && sessionLinks}
    </div>
  );
}

export default Navigation;
