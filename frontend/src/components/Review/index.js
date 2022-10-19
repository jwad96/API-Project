import {useDispatch} from "react-redux";
import {deleteReview} from "../../store/review";

const Review = ({review, stars, isOwn, reviewId, spotId}) => {
    const dispatch = useDispatch();

    const onDelete = (e) => {
        dispatch(deleteReview(reviewId))
    }    

    return <div>
        <div>{`${review} -- ${stars}`}</div>
        {isOwn && <button onClick={onDelete}>Delete REVIEW (ABOVE)</button>}
    </div>
}

export default Review;
