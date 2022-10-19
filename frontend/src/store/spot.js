import {csrfFetch} from "./csrf";

const ADD_SPOT = "spot/add_spot";
const DELETE_SPOT = "spot/delete_spot";
const ADD_IMAGE = "spot/add_image";

const GET_SINGLE_SPOT = "spot/get_single_spot"


const add = (spot) => {
    return {
        type: ADD_SPOT,
        spot
    }
}

const remove = (id) => {
    return {
        type: DELETE_SPOT,
        id
    }
}

const singleSpot = (spot) => {
    return {
        type: GET_SINGLE_SPOT,
        spot
    }
}

const addImage = (id, url) => {
    return {
        type: ADD_IMAGE,
        id,
        url
    }
}

export const getSingleSpot = (id) => async (dispatch) => {
    const spot = await csrfFetch(`/api/spots/${id}`).then(res => res.json());
    dispatch(singleSpot(spot));
}

export const populateSpots = () => async (dispatch) => {
    const spots = await csrfFetch("/api/spots").then(res => res.json());
    console.log("SPOTTIN", spots.Spots);
    spots.Spots.forEach(spot => dispatch(add(spot)));
}

export const addSpot = (spot) => async (dispatch) => {
    const previewImage = {url: spot.image, preview: true};
    delete spot.image;

    const response = await csrfFetch("/api/spots", {
        method: "POST",
        body: JSON.stringify(spot)
    })

    const resBody = await response.json();
    let imageResponse;

    if (response.status === 201) {
        imageResponse = await csrfFetch(`/api/spots/${resBody.id}/images`, {
            method: "POST",
            body: JSON.stringify(previewImage)
        }).then(res => res.json())
    }


    resBody.previewImage = imageResponse.url;


    dispatch(add(resBody));

}

export const deleteSpot = (id) => async (dispatch) => {
    dispatch(remove(id));

    csrfFetch(`/api/spots/${id}`, {
        method: "DELETE"
    }).then(() => dispatch(remove(id)));

}

export const editSpot = (id, spot) => async (dispatch) => {
    const previewImage = {url: spot.image, preview: true};
    delete spot.image;

    const response = await csrfFetch(`/api/spots/${id}`, {
        method: "PUT",
        body: JSON.stringify(spot)
    })

    const resBody = await response.json();

    if (response.status === 200) {
        csrfFetch(`/api/spots/${resBody.id}/images`, {
            method: "POST",
            body: JSON.stringify(previewImage)
        });
    }

    resBody.previewImage = previewImage.url

    dispatch(add(resBody));
}


const spotReducer = (state={}, action) => {
    if (action.type === ADD_SPOT) {
        const allSpots = {...state.allSpots, [action.spot.id]: action.spot};
        return {...state, allSpots: {...allSpots}};
    }

    if (action.type === DELETE_SPOT) {
        const allSpots = {...state.allSpots};
        delete allSpots[action.id];
        return {...state, allSpots: {...allSpots}, singleSpot: {...state.singleSpot}};
    }

    if (action.type === GET_SINGLE_SPOT) {
        return {...state, singleSpot: action.spot};
    }

    if (action.type === ADD_IMAGE) {
        const allSpots = {...state.allSpots};
        allSpots[action.id].previewImage = action.url;
        return {...state, allSpots}
    }

    return state
    
}


export default spotReducer;
