import {useDispatch} from "react-redux";
import {deleteReview} from "../../store/review";

import "./Review.css";

const Review = ({review, stars, isOwn, reviewId, spotId, username}) => {
    const dispatch = useDispatch();

    const onDelete = (e) => {
        dispatch(deleteReview(reviewId, spotId))
    }    

    return (<>
    <div className="individual-review">
        <div id="rating-container"><i class="fa-solid fa-star"></i><span>{`${stars}`}</span><i className="fas fa-user-circle reviewer-profile-icon" /><span className="username">{username}</span></div>
        <p id="review-text-display">{`${review}`}</p>
        {isOwn && <button id="delete-review" onClick={onDelete}>DELETE</button>}
    </div>
        </>
    )
}

export default Review;
