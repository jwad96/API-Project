// frontend/src/components/SignupFormPage/index.js
import React, { useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

import {ModalContext} from "../../context/Modal";
import "./SignupForm.css";

function SignupFormPage() {
  const {setShowSignupModal} = useContext(ModalContext);
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors([]);
      const data = await dispatch(sessionActions.signup({ email, username, firstName, lastName, password })).catch(res=>res.json())

      if (data && data.errors) {
        return setErrors(Object.values(data.errors))
      } else {
        return setShowSignupModal(false);
      }
    }
    return setErrors(['Confirm Password field must be the same as the Password field']);
  };

  return (
    <form onSubmit={handleSubmit} id="signup-form">
      <h2 id="signup-header">Welcome to HairBnB!</h2>
      <ul id="signup-errors">
        {(console.log("errors", errors)) || errors.map((error, idx) => <li key={idx}>{error}</li>)}
      </ul>
      <label htmlFor="email-input" />
        <input
          className="signup-input"
          id="email-input"
          placeholder="Email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      <label htmlFor="username-input"/>
        <input
          className="signup-input"
          id="username-input"
          placeholder="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      <label htmlFor="firstname-input" />
        <input
          className="signup-input"
          id="firstname-input"
          placeholder="First Name"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      <label id="lastname-input" />
        <input
          className="signup-input"
          placeholder="Last Name"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      <label htmlFor="password-input" />
        <input
          className="signup-input"
          id="password-input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      <label htmlFor="confirm-password-input"/>
        <input
          className="signup-input"
          id="confirm-password-input"
          placeholder="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      <button id="submit-signup" type="submit">Sign Up</button>
    </form>
  );
}

export default SignupFormPage;
