import {csrfFetch} from "./csrf";

const POPULATE = "reviews/populate";
const DELETE = "reviews/delete"

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

export const getReviews = (id) => async (dispatch) => {
    const reviews = await csrfFetch(`/api/spots/${id}/reviews`).then(res => res.json());

    const restructuredReviews = reviews.Reviews.reduce((acc, review) => {
        acc[review.id] = review;
        return acc;
    }, {})

    dispatch(populateReviews(restructuredReviews));
}

export const deleteReview = (reviewId) => async (dispatch) => {
    csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE"
    });

    dispatch(removeReview(reviewId));
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
    return state;
}

export default reviewReducer;
