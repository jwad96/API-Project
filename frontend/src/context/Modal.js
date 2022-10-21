import React, { useContext, useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

export const ModalContext = React.createContext();

export function ModalProvider({ children }) {
  const modalRef = useRef();
  const [modalNode, setModalNode] = useState();
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false);

  const values = {
    modalNode,
    showLoginModal,
    setShowLoginModal,
    showSignupModal,
    setShowSignupModal
  }

  useEffect(() => {
    setModalNode(modalRef.current);
  }, [])

  return (
    <>
      <ModalContext.Provider value={values}>
        {children}
      </ModalContext.Provider>
      <div ref={modalRef} />
    </>
  );
}

export function Modal({ onClose, children }) {
  const {modalNode} = useContext(ModalContext);
  if (!modalNode) return null;

  console.log("MODAL NODE", modalNode);

  return ReactDOM.createPortal(
    <div id="modal">
      <div id="modal-background" onClick={onClose} />
      <div id="modal-content">
        {children}
      </div>
    </div>,
    modalNode
  );
}
