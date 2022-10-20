import {useState, useEffect} from "react";
import {useHistory, useParams, useLocation} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {addSpot, editSpot} from "../../store/spot";

import "./SpotForm.css";


const SpotForm = () => {
    const {spotId} = useParams();
    const currentSpot = useSelector(state => state.spots.allSpots[spotId]);
    const location = useLocation();
    const isEdit = location.pathname.split("/").at(-1) === "edit";

    const [address, setAddress] = useState(isEdit ? currentSpot.address : "")
    const [city, setCity] = useState(isEdit ? currentSpot.city : "")
    const [state, setState] = useState(isEdit ? currentSpot.state : "")
    const [country, setCountry] = useState(isEdit ? currentSpot.country : "")
    const [lat, setLat] = useState(isEdit ? currentSpot.lat : "")
    const [lng, setLng] = useState(isEdit ? currentSpot.lng : "")
    const [name, setName] = useState(isEdit ? currentSpot.name : "")
    const [description, setDescription] = useState(isEdit ? currentSpot.description : "")
    const [price, setPrice] = useState(isEdit ? currentSpot.price : "")
    const [errors, setErrors] = useState({});
    const [previewImage, setPreviewImage] = useState(isEdit ? currentSpot.previewImage : "")
    const [submittedOnce, setSubmittedOnce] = useState(false);

    const dispatch = useDispatch();
    

    if(submittedOnce) {
        console.log("SUBMTITED ONCE TRUUUUU");
        console.log("HERE ARE YOUR ERROOOOORS", errors);
    }

    const history = useHistory();

    useEffect(() => {
        const errs = {}
        
        if (address.length < 1) {
            errs[0] = ("address must be present");
        }

        if (city.length < 1) {
            errs[1] = ("city must be present");
        }

        if (state.length < 1) {
            errs[2] = ("state must be present");
        }

        if (country.length < 1) {
            errs[3] = ("country must be present");
        }

        if (lat === "" || isNaN(Number(lat))) {
            errs[4] = ("valid lat required")
        }

        if (lng === "" || isNaN(Number(lng))) {
            errs[5] = ("valid lng required")
        }

        if (name.length < 1) {
            errs[6] = ("name must be present");
        }

        if (description.length < 1) {
            errs[7] = ("description must be present");
        }

        if (!Number(price) || price < 0) {
            errs[8] = ("valid price required");
        }

        if (previewImage.length < 1) {
            errs[9] = ("preview image URL required");
        }

        setErrors(errs);

    }, [address, city, state, country, lat, lng, name, description, price, previewImage])

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!submittedOnce) {
            setSubmittedOnce(true);
        }

        if (Object.keys(errors).length === 0) {
            const spot = {address, city, state, country, lat, lng, name, description, price, image: previewImage}
            if (isEdit) {
                dispatch(editSpot(spotId, spot))
            } else {
                dispatch(addSpot(spot));
            }
            console.log("SUBMITTED BABY");
            history.push("/");
        }
    }

return (
    <>
    <form className="spot-form">
        <div className="input-wrapper">
            <label htmlFor="address"></label>
            <input id="address" placeholder="Address" value={address} onChange={e=>setAddress(e.target.value)}></input>
            {submittedOnce && <span className="validationError">{errors[0]}</span>}
        </div>
        
        <div className="input-wrapper">
            <label htmlFor="city"></label>
            <input id="city" placeholder="City" value={city} onChange={e=>setCity(e.target.value)}></input>
            {submittedOnce && <span className="validationError">{errors[1]}</span>}
        </div>

        <div className="input-wrapper">
            <label htmlFor="state"></label>
            <input id="state" placeholder="State" value={state} onChange={e=>setState(e.target.value)}></input>
            {submittedOnce && <span className="validationError">{errors[2]}</span>}
        </div>

        <div className="input-wrapper">
            <label htmlFor="country"></label>
            <input id="country" placeholder="Country" value={country} onChange={e=>setCountry(e.target.value)}></input>
            {submittedOnce && <span className="validationError">{errors[3]}</span>}
        </div>

        <div className="input-wrapper">
            <label htmlFor="lat"></label>
            <input id="lat" placeholder="Lat" value={lat} onChange={e=>setLat(e.target.value)}></input>
            {submittedOnce && <span className="validationError">{errors[4]}</span>}
        </div>

        <div className="input-wrapper">
            <label htmlFor="lng"></label>
            <input id="lng" placeholder="Lng" value={lng} onChange={e=>setLng(e.target.value)}></input>
            {submittedOnce && <span className="validationError">{errors[5]}</span>}
        </div>

        <div className="input-wrapper">
            <label htmlFor="name"></label>
            <input id="name" placeholder="Name" value={name} onChange={e=>setName(e.target.value)}></input>
            {submittedOnce && <span className="validationError">{errors[6]}</span>}
        </div>

        <div className="input-wrapper">
            <label htmlFor="description"></label>
            <input id="description" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)}></input>
            {submittedOnce && <span className="validationError">{errors[7]}</span>}
        </div>

        <div className="input-wrapper">
            <label htmlFor="price"></label>
            <input id="price" placeholder="Price" value={price} onChange={e=>setPrice(e.target.value)}></input>
            {submittedOnce && <span className="validationError">{errors[8]}</span>}
        </div>

        <div className="input-wrapper">
            <label htmlFor="preview"></label>
            <input id="preview" placeholder="Preview" value={previewImage} onChange={e=>setPreviewImage(e.target.value)}></input>
            {submittedOnce && <span className="validationError">{errors[9]}</span>}
        </div>

        <button id="submit-spot-form" onClick={onSubmit}>Submit</button>
    </form>
    </>
)

}

export default SpotForm
