import {useContext} from "react";
import {ModalContext, Modal} from "../../context/Modal";
import ReviewForm from "../ReviewForm";

const ReviewFormModal = ({spotId}) => {
    const {showReviewModal, setShowReviewModal} = useContext(ModalContext);

    return showReviewModal && <Modal onClose={()=>setShowReviewModal(false)}><ReviewForm spotId={spotId}/></Modal>
}

export default ReviewFormModal;
