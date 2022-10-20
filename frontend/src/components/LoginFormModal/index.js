import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import LoginForm from './LoginForm';

function LoginFormModal() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => {console.log("WE FIRIN"); setShowModal(true)}}>Log In</button>
      {showModal && (
        <Modal onClose={() => {console.log("WE CLOSIN"); setShowModal(false)}}>
          <LoginForm />
        </Modal>
      )}
    </>
  );
}

export default LoginFormModal;
