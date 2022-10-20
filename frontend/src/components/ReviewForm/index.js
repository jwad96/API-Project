import {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router";
import {createReview} from "../../store/review";
import "./ReviewForm.css";

const ReviewForm = ({spotId}) => {
    const {id, firstName, lastName} = useSelector(state => state.session.user);

    const [review, setReview] = useState("");
    const [stars, setStars] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();
    const history = useHistory();

    const onChangeRating = (e) => {
        console.log(e.target.value);
        setStars(parseInt(e.target.value));
    }

    useEffect(() => {
        const errs = {}

        if (review.length === 0) {
            errs[0] = "Review text must be present."
        }

        if (!stars) {
            errs[1] = "Must provide a rating."
        }

        setErrors(errs);
    }, [review, stars]);

    const onFormSubmit = (e) => {
        e.preventDefault();
        if (!submitted) {
            setSubmitted(true);
        }

        if (Object.keys(errors).length === 0) {
            const user = {
                id,
                firstName,
                lastName
            }

            const reviewBody = {
                review,
                stars
            }

            console.log("REVIEW BODY", reviewBody);

            dispatch(createReview(spotId, reviewBody, user))
            history.push(`/spots/${spotId}`)
        }

    }

    return (
    <form id="review-form" onSubmit={onFormSubmit}>
        <label htmlFor="review-text"></label>
        <textarea  placeholder="Review" id="review-text" value={review} onChange={e=>setReview(e.target.value)}></textarea>
        {submitted && errors[0] && <div className="validationError">{errors[0]}</div>}

        <label htmlFor="rating">1</label>
        <input name="rating" type="radio" id="rating-1" value={1} onChange={onChangeRating}></input>
        
        <label htmlFor="rating">2</label>
        <input name="rating" type="radio" id="rating-2" value={2} onChange={onChangeRating}></input>
        
        <label htmlFor="rating">3</label>
        <input name="rating" type="radio" id="rating-3" value={3} onChange={onChangeRating}></input>
        
        <label htmlFor="rating">4</label>
        <input name="rating" type="radio" id="rating-4" value={4} onChange={onChangeRating}></input>
        
        <label htmlFor="rating">5</label>
        <input name="rating" type="radio" id="rating-5" value={5} onChange={onChangeRating}></input>
        {submitted && errors[1] && <div className="validationError">{errors[1]}</div>}

        <button>Submit Review</button>
     </form>
    )
}

export default ReviewForm;
