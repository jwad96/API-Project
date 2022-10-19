import {useSelector, useDispatch} from "react-redux";
import {NavLink} from "react-router-dom";
import Spot from "../Spot";
import {populateSpots} from "../../store/spot";

const SpotsContainer = () => {
    const spots = useSelector(state => state.spots.allSpots)

    return (
        <ul>
            {spots && 
                Object.values(spots).map(spot => <NavLink to={`/spots/${spot.id}`}><li key={spot.id}><Spot spot={spot} /></li></NavLink>)
            }
        </ul>
    )
}

export default SpotsContainer
