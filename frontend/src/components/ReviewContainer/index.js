import {useEffect, useState, useContext} from "react";
import {Route, useHistory, useLocation} from "react-router";
import {useSelector, useDispatch} from "react-redux"
import {getReviews} from "../../store/review";
import Review from "../Review";
import ReviewForm from "../ReviewForm";

import "./ReviewContainer.css";


import {ModalContext, Modal} from "../../context/Modal";
import ReviewFormModal from "../ReviewFormModal";

const ReviewContainer = ({spotId}) => {
    const [notReviewed, setNotReviewed] = useState(false);
    
    const {setShowReviewModal} = useContext(ModalContext);
    const location = useLocation().pathname;
    const reviews = useSelector(state => state.reviews.spot)
    const user = useSelector(state => state.session.user);
    const currentUserId = user ? user.id : null
    const dispatch = useDispatch();

    const history = useHistory();

    const onDisplayReviewForm = (e) => {
        setShowReviewModal(true);
    }
    
    useEffect(() => {
        dispatch(getReviews(spotId));
    }, [])
    
    useEffect(() => {
        if (reviews) {
            setNotReviewed(!Object.values(reviews).some(review => review.User.id === currentUserId))
        }
        
    }, [reviews])

    return (
        <div id="review-container">
            <div id="review-header">
                <h2>Reviews</h2>
            {currentUserId && notReviewed && <>
                              <button id="create-review" onClick={onDisplayReviewForm}>Create Review</button>
                              <ReviewFormModal spotId={spotId}/>
                              {/* <Route path="/spots/:spotId/createReview">
                                <ReviewForm spotId={spotId} />
                              </Route> */}
                            </>}
            </div>
             {reviews && Object.values(reviews).map(({review, stars, userId, id, spotId}) => {
                const isOwn = currentUserId === userId
                return <Review  spotId={spotId} reviewId={id} review={review} stars={stars} isOwn={isOwn}/>
             })}
        </div>
    )
}


export default ReviewContainer
