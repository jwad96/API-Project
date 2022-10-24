import {csrfFetch} from "./csrf";
import {getSingleSpot} from "./spot";

const POPULATE = "reviews/populate";
const DELETE = "reviews/delete";
const ADD = "reviews/add";

const populateReviews = (reviews) => {
    return {
        type: POPULATE,
        reviews
    }
}

const removeReview = (reviewId) => {
    return {
        type: DELETE,
        reviewId
    }
}

const addReview = (review) => {
    return {
        type: ADD,
        review
    }
}

export const getReviews = (id) => async (dispatch) => {
    const reviews = await csrfFetch(`/api/spots/${id}/reviews`).then(res => res.json());

    const restructuredReviews = reviews.Reviews.reduce((acc, review) => {
        acc[review.id] = review;
        return acc;
    }, {})

    dispatch(populateReviews(restructuredReviews));
}

export const deleteReview = (reviewId, spotId) => async (dispatch) => {
    csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE"
    });

    dispatch(removeReview(reviewId));
    dispatch(getSingleSpot(spotId));
}

export const createReview = (spotId, review, user, reviewImages=[]) => async (dispatch) => {
    const createdReview = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        body: JSON.stringify(review)
    }).then(res => res.json())

    createdReview.User = user;
    createdReview.ReviewImages = reviewImages;

    dispatch(addReview(createdReview));
    dispatch(getSingleSpot(spotId));
}


const reviewReducer = (state={}, action) => {
    if (action.type === POPULATE) {
        return {...state, spot: action.reviews}
    }

    if (action.type === DELETE) {
        const newSpotReviews = {...state.spot}
        delete newSpotReviews[action.reviewId]
        return {...state, spot: newSpotReviews}
    }

    if (action.type === ADD) {
        const spotReviews = {...state.spot}
        spotReviews[action.review.id] = action.review

        return {...state, spot: spotReviews}
    }
    return state;
}

export default reviewReducer;
