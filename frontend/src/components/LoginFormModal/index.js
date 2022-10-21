import React, { useState, useContext } from 'react';
import { Modal, ModalContext } from '../../context/Modal';
import LoginForm from './LoginForm';

function LoginFormModal() {
  const {showLoginModal, setShowLoginModal} = useContext(ModalContext);

  return (
    <>
      {showLoginModal && (
        <Modal onClose={() => {console.log("WE CLOSIN"); setShowLoginModal(false)}}>
          <LoginForm />
        </Modal>
      )}
    </>
  );
}

export default LoginFormModal;
