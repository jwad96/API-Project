import {useSelector, useDispatch} from "react-redux"
import {useEffect} from "react";
import {getReviews} from "../../store/review";
import Review from "../Review";
import ReviewForm from "../ReviewForm";

const ReviewContainer = ({spotId}) => {
    const reviews = useSelector(state => state.reviews.spot)
    const currentUserId = useSelector(state => state.session.user.id);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getReviews(spotId));
        console.log("BING BANG BOOM");
    }, [])

    return (
        <>
            {/* <ReviewForm /> */}
             {reviews && Object.values(reviews).map(({review, stars, userId, id, spotId}) => {
                const isOwn = currentUserId === userId
                return <Review  spotId={spotId} reviewId={id} review={review} stars={stars} isOwn={isOwn}/>
             })}
        </>
    )
}


export default ReviewContainer
