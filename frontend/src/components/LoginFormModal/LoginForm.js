// frontend/src/components/LoginFormModal/LoginForm.js
import React, { useState, useContext } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";

import {ModalContext} from "../../context/Modal";
import "./LoginForm.css";

function LoginForm() {
  const {setShowLoginModal} = useContext(ModalContext);
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    const data = await dispatch(sessionActions.login({ credential, password })).catch((res) => res.json());
    console.log(data.errors);
    if (data && data.message){
      setErrors([data.message]);
      console.log("BINGBANG")
    } else {
      console.log("BOOMBOOM");
      setShowLoginModal(false);
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit} id="login-form">
      <h2 id="login-header">Welcome back!</h2>
      <ul id="login-errors">
        {errors.map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
      </ul>
      <label htmlFor="username-input-login" />
        <input
          id="username-input-login"
          placeholder="Username/Email"
          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
        />
      <div></div>
      <label htmlFor="password-input-login" />
        <input
          id="password-input-login"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      <button type="submit" id="submit-login">Log In</button>
    </form>
    </>
  );
}

export default LoginForm;
