import {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux"
import {useParams, useHistory} from "react-router"
import {Route} from "react-router-dom"
import {getSingleSpot, deleteSpot} from "../../store/spot";
import SpotForm from "../SpotForm";
import ReviewContainer from "../ReviewContainer";


const SingleSpot = () => {
    const {spotId} = useParams();
    const spot = useSelector(state => state.spots.singleSpot);
    const userId = useSelector(state => state.session.user.id);

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
        history.push(`/spots/${spotId}/edit`);
    }

    return spot && (
        <>
          <div>{spotId}</div>
          {ownSpot && (
            <>
              <button onClick={onDelete}>DELETE</button>
              <button onClick={onEdit}>EDIT</button>
              <Route path={`/spots/:spotId/edit`}>
                <SpotForm />
              </Route>
            </>
          )}
          <ReviewContainer spotId={spotId}/>
        </>
    )

}


export default SingleSpot;
