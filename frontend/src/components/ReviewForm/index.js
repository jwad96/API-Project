import {useState, useEffect} from "react";
import "./ReviewForm.css";

const ReviewForm = () => {
    const [review, setReview] = useState("");
    const [rating, setRating] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [reviewError, setReviewError] = useState("");
    // const []


    const onChangeRating = (e) => {
        console.log(e.target.value);
        setRating(e.target.value);
    }

    useEffect(() => {
        let reviewErr;
        if (rating.length === 0) {
            reviewErr = "Review text must be present.";
        }

        setReviewError(reviewErr);
    })

    const onFormSubmit = (e) => {
        e.preventDefault();
        if (!submitted) {
            setSubmitted(true);
        }

        if (!reviewError) {
            alert("NOT IMPLEMENTED");
        }

    }

    return <form onSubmit={onFormSubmit}>
        <label htmlFor="review"></label>
        <textarea placeholder="Review" id="review" value={review} onChange={e=>setReview(e.target.value)}></textarea>
        {submitted && <div id="review-error">{reviewError}</div>}

        <label htmlFor="rating">Rating</label>
        <input name="rating" type="radio" placeholder="rating" id="rating" value={1} onChange={onChangeRating}></input>
        <input name="rating" type="radio" placeholder="rating" id="rating" value={2} onChange={onChangeRating}></input>
        <input name="rating" type="radio" placeholder="rating" id="rating" value={3} onChange={onChangeRating}></input>
        <input name="rating" type="radio" placeholder="rating" id="rating" value={4} onChange={onChangeRating}></input>
        <input name="rating" type="radio" placeholder="rating" id="rating" value={5} onChange={onChangeRating}></input>
        {}

        <button>Submit Review</button>
    </form>
}

export default ReviewForm;
