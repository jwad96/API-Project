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

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  const history = useHistory();

  const onCreateSpot = (e) => {
    history.push("/spot-form");
  }

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (<>
      <ProfileButton user={sessionUser} />
      <button id="create-spot" onClick={onCreateSpot}>Add spot</button>
      <Route path="/spot-form">
        <SpotForm />
      </Route>
    </>
    );
  } else {
    sessionLinks = (
      <>
        <LoginFormModal />
        <NavLink to="/signup">Sign Up</NavLink>
        <button onClick={e=>dispatch(testLogin())}>Demo-lition</button>
      </>
    );
  }

  return (
    <ul>
      <li>
        <NavLink exact to="/">Home</NavLink>
        {isLoaded && sessionLinks}
      </li>
    </ul>
  );
}

export default Navigation;
