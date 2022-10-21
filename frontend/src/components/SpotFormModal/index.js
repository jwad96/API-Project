import { useContext } from "react";
import { Modal, ModalContext } from "../../context/Modal";
import SpotForm from "../SpotForm";



const SpotsFormModal = ({onClose, edit}) => {
    const {showSpotModal, setShowSpotModal,
           showSpotEditModal, setShowSpotEditModal} = useContext(ModalContext);

    let showForm;
    let setShowForm;

    if (edit) {
        [showForm, setShowForm] = [showSpotEditModal, setShowSpotEditModal];
    } else {
        [showForm, setShowForm] = [showSpotModal, setShowSpotModal]
    }
    
    return showForm && <Modal onClose={()=>setShowForm(false)}><SpotForm edit={edit}/></Modal>
}

export default SpotsFormModal
