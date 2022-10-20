import {useSelector, useDispatch} from "react-redux";
import {NavLink} from "react-router-dom";
import Spot from "../Spot";
import {populateSpots} from "../../store/spot";
import "./SpotsContainer.css";

const SpotsContainer = () => {
    const spots = useSelector(state => state.spots.allSpots)

    return (
        <ul id="spots-container">
            {spots && 
                Object.values(spots).map(spot => <li key={spot.id}> <NavLink className="spot-link" to={`/spots/${spot.id}`}><Spot spot={spot} /></NavLink></li>)
            }
        </ul>
    )
    
}

export default SpotsContainer
