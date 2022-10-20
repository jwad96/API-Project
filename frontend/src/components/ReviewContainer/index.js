import {useEffect, useState} from "react";
import {Route, useHistory} from "react-router";
import {useSelector, useDispatch} from "react-redux"
import {getReviews} from "../../store/review";
import Review from "../Review";
import ReviewForm from "../ReviewForm";

const ReviewContainer = ({spotId}) => {
    const [notReviewed, setNotReviewed] = useState(false);
    const [currentUrl, setCurrentUrl] = useState(0);
    
    const urls = {
        0: `/spots/${spotId}`,
        1: `/spots/${spotId}/createReview`
    }

    const reviews = useSelector(state => state.reviews.spot)
    const currentUserId = useSelector(state => state.session.user.id);
    const dispatch = useDispatch();

    const history = useHistory();

    const onDisplayReviewForm = (e) => {
        setCurrentUrl(currentUrl ^ 1);
        history.push(urls[currentUrl]);
    }
    
    useEffect(() => {
        dispatch(getReviews(spotId));
    }, [])
    
    useEffect(() => {
        if (reviews) {
            setNotReviewed(!Object.values(reviews).some(review => review.User.id === currentUserId))
            setCurrentUrl(0);
        }
        setCurrentUrl(1);
        
    }, [reviews])

    return (
        <>
            {notReviewed && <>
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
