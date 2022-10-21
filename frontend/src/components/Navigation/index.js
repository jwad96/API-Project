// frontend/src/components/Navigation/index.js
import React, {useContext} from 'react';
import {Route, useHistory} from "react-router"
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {testLogin} from "../../store/session";
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';
import SpotForm from "../SpotForm";
import './Navigation.css';

import {ModalContext} from "../../context/Modal";

import SignupFormModal from "../SignupFormModal";
import SpotFormModal from "../SpotFormModal";

function Navigation({ isLoaded }){
  const {setShowSpotModal} = useContext(ModalContext);
  const sessionUser = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  const history = useHistory();

  const onCreateSpot = (e) => {
    // history.push("/spot-form");
    setShowSpotModal(true);
  }

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (<div id="session-links">
      <button id="create-spot" onClick={onCreateSpot}>Add spot</button>
      <SpotFormModal onClose={()=>setShowSpotModal(false)} edit={false}/>
      <ProfileButton user={sessionUser} />
      <Route path="/spot-form">
        <SpotForm />
      </Route>
    </div>
    );
  } else {
    sessionLinks = (
      <div id="session-links">
        <LoginFormModal />
        <SignupFormModal />
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
