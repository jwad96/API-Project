import {useEffect, useState} from "react";
import {Route, useHistory, useLocation} from "react-router";
import {useSelector, useDispatch} from "react-redux"
import {getReviews} from "../../store/review";
import Review from "../Review";
import ReviewForm from "../ReviewForm";

const ReviewContainer = ({spotId}) => {
    const [notReviewed, setNotReviewed] = useState(false);
    
    const urls = {
        [`/spots/${spotId}/createReview`]: `/spots/${spotId}`,
        [`/spots/${spotId}`]: `/spots/${spotId}/createReview`
    }

    const location = useLocation().pathname;
    const reviews = useSelector(state => state.reviews.spot)
    const user = useSelector(state => state.session.user);
    const currentUserId = user ? user.id : null
    const dispatch = useDispatch();

    const history = useHistory();

    const onDisplayReviewForm = (e) => {
        history.push(urls[location]);
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
        <>
            {currentUserId && notReviewed && <>
                              <button onClick={onDisplayReviewForm}>Create Review</button>
                              <Route path="/spots/:spotId/createReview">
                                <ReviewForm spotId={spotId} />
                              </Route>
                            </>}
             {reviews && Object.values(reviews).map(({review, stars, userId, id, spotId}) => {
                const isOwn = currentUserId === userId
                return <Review  spotId={spotId} reviewId={id} review={review} stars={stars} isOwn={isOwn}/>
             })}
        </>
    )
}


export default ReviewContainer
