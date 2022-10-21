import {useContext} from "react";
import {ModalContext, Modal} from "../../context/Modal";
import SignupFormPage from "../SignupFormPage"


const SignupFormModal = () => {
    const {showSignupModal, setShowSignupModal} = useContext(ModalContext);


    return showSignupModal && <Modal onClose={e=>setShowSignupModal(false)}><SignupFormPage /></Modal>
}

export default SignupFormModal;
