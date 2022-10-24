const Spot = ({spot}) => {    
    const avgRating = spot.avgRating ? Number(spot.avgRating).toFixed(2) : "No ratings yet"

    return (
    <div className="spot">
        <img src={spot.previewImage} className="spot-image" />
        <div className="spot-info">
            <div className="title">
                <h2>{spot.name}</h2>
                <div className="spot-rating"><i class="spot-star fa-solid fa-star"></i>{avgRating}</div>
            </div>
            <div>{spot.description}</div>
            <div>{`$${spot.price}`} <span className="night">night</span></div>
        </div>
    </div>
    )    
}

export default Spot;
