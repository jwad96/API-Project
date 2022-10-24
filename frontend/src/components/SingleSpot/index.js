import {useEffect, useState, useContext} from "react";
import {useSelector, useDispatch} from "react-redux"
import {useParams, useHistory} from "react-router"
import {Route} from "react-router-dom"
import {getSingleSpot, deleteSpot} from "../../store/spot";
import SpotForm from "../SpotForm";
import ReviewContainer from "../ReviewContainer";

import SpotFormModal from "../SpotFormModal";
import {ModalContext} from "../../context/Modal"
import "./SingleSpot.css";


const SingleSpot = () => {
    const {spotId} = useParams();
    const {setShowSpotEditModal} = useContext(ModalContext);
    const spot = useSelector(state => state.spots.singleSpot);
    const user = useSelector(state => state.session.user);
    const userId = user ? user.id : null;

    const [ownSpot, setOwnSpot] = useState(false);

    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        dispatch(getSingleSpot(spotId));
    }, [dispatch, spotId])


    useEffect(() => {
        if (spot) {
            setOwnSpot(userId === spot.ownerId);
        }
    }, [spot, spotId, dispatch, setOwnSpot, userId])

    const onDelete = async (e) => {
        dispatch(deleteSpot(spotId)).then(() => history.push("/"));
    }

    const onEdit = (e) => {
        // history.push(`/spots/${spotId}/edit`);
        setShowSpotEditModal(true);
    }

    return spot && (
        <>
          <div id="single-spot-container">
            <div id="header">
              <h1>{spot.name}</h1>
                {ownSpot && (
                <>
                  <button id="delete" onClick={onDelete}>DELETE</button>
                  <button id="edit" onClick={onEdit}>EDIT</button>
                  {/* <Route path={`/spots/:spotId/edit`}>
                    <SpotForm />
                  </Route> */}
                  <SpotFormModal edit={true}/>
                </>
                )}
            </div>
            <div id="single-spot-subheading">
              <div><i class="fa-solid fa-star"></i>  {spot.avgStarRating ? Number(spot.avgStarRating).toFixed(2) : "No ratings yet"}</div>
              <div>{spot.numReviews} {spot.numReviews === 1 ? "review" : "reviews"}</div>
              <div>{spot.city}, {spot.state}, {spot.country}</div>
            </div>
            {/* <img id="single-spot-img" src={spot.SpotImages.at(-1).url} /> */}
            <div id="single-spot-img">
              <img id="img-1" src={spot.SpotImages.at(-1).url} />
              <img id="img-2" src={spot.SpotImages.at(-1).url} />
              <img id="img-3" src={spot.SpotImages.at(-1).url} />
              <img id="img-4" src={spot.SpotImages.at(-1).url} />
              <img id="img-5" src={spot.SpotImages.at(-1).url} />
            </div>
            <h2>{spot.description}</h2>
            
            <ReviewContainer spotId={spotId}/>
          </div>

        </>
    )

}


export default SingleSpot;
