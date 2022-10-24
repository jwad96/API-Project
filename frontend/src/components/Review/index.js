import {useDispatch} from "react-redux";
import {deleteReview} from "../../store/review";

import "./Review.css";

const Review = ({review, stars, isOwn, reviewId, spotId}) => {
    const dispatch = useDispatch();

    const onDelete = (e) => {
        dispatch(deleteReview(reviewId))
    }    

    return <div className="individual-review">
        <div id="rating-container"><i class="fa-solid fa-star"></i><span>{`${stars}`}</span></div>
        <p id="review-text">{review}</p>
        {isOwn && <button id="delete-review" onClick={onDelete}>DELETE</button>}
    </div>
}

export default Review;
